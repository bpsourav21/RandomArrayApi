
const bcrypt = require("bcryptjs");
const db = require("helpers/db");
const Role = require('../accounts/role');

const {
  getRefreshToken,
  hash,
  generateJwtToken,
  generateRefreshToken,
  randomTokenString,
  basicDetails,
  sendPasswordResetEmail,
} = require("../../helpers/methods");

module.exports = {
  authenticate,
  refreshToken,
  revokeToken,
  register,
  verifyEmail,
  forgotPassword,
  validateResetToken,
  resetPassword,
};

async function authenticate({ email, password, ipAddress }) {
  const account = await db.Account.findOne({ email });

  if (!account || !bcrypt.compareSync(password, account.passwordHash)) {
    throw "Email or password is incorrect";
  }

  // authentication successful so generate jwt and refresh tokens
  const jwtToken = generateJwtToken(account);
  const refreshToken = generateRefreshToken(account, ipAddress);

  // save refresh token
  await refreshToken.save();

  // return basic details and tokens
  return {
    ...basicDetails(account),
    jwtToken,
    refreshToken: refreshToken.token,
  };
}

async function refreshToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);
  const { account } = refreshToken;

  // replace old refresh token with a new one and save
  const newRefreshToken = generateRefreshToken(account, ipAddress);
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();

  // generate new jwt
  const jwtToken = generateJwtToken(account);

  // return basic details and tokens
  return {
    ...basicDetails(account),
    jwtToken,
    refreshToken: newRefreshToken.token,
  };
}

async function revokeToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);

  // revoke token and save
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  await refreshToken.save();
}

async function register(params, origin) {
  // validate
  if (await db.Account.findOne({ email: params.email })) {
    // send already registered error in email to prevent account enumeration
    // return await sendAlreadyRegisteredEmail(params.email, origin);
    throw "Email already exist";
  }

  if (await db.Account.findOne({ phone: params.phone })) {
    throw "Phone number already exist";
  }

  // create account object
  const account = new db.Account(params);

  // first registered account is an admin
  const isFirstAccount = (await db.Account.countDocuments({})) === 0;
  account.role = isFirstAccount ? Role.Admin : Role.User;
  account.verificationToken = randomTokenString();

  // hash password
  if (params.password) {
    account.passwordHash = hash(params.password);
  }

  // save account
  return await account.save();

  // send email
  // await sendVerificationEmail(account, origin);
}

async function verifyEmail({ token }) {
  const account = await db.Account.findOne({ verificationToken: token });

  if (!account) throw "Verification failed";

  account.verified = Date.now();
  account.verificationToken = undefined;
  await account.save();
}

async function forgotPassword({ email }, origin) {
  const account = await db.Account.findOne({ email });

  // always return ok response to prevent email enumeration
  if (!account) return;

  // create reset token that expires after 24 hours
  account.resetToken = {
    token: randomTokenString(),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
  await account.save();

  // send email
  await sendPasswordResetEmail(account, origin);
}

async function validateResetToken({ token }) {
  const account = await db.Account.findOne({
    "resetToken.token": token,
    "resetToken.expires": { $gt: Date.now() },
  });

  if (!account) throw "Invalid token";
}

async function resetPassword({ token, password }) {
  const account = await db.Account.findOne({
    "resetToken.token": token,
    "resetToken.expires": { $gt: Date.now() },
  });

  if (!account) throw "Invalid token";

  // update password and remove reset token
  account.passwordHash = hash(password);
  account.passwordReset = Date.now();
  account.resetToken = undefined;
  await account.save();
}