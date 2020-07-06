const db = require("helpers/db");
const { getAccount, hash, basicDetails } = require("../../helpers/methods");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  const accounts = await db.Account.find();
  return accounts.map((x) => basicDetails(x));
}

async function getById(id) {
  const account = await getAccount(id);
  return basicDetails(account);
}

async function create(params) {
  // validate
  if (await db.Account.findOne({ email: params.email })) {
    throw 'Email "' + params.email + '" is already registered';
  }

  const account = new db.Account(params);
  account.verified = Date.now();

  // hash password
  if (params.password) {
    account.passwordHash = hash(params.password);
  }

  // save account
  await account.save();

  return basicDetails(account);
}

async function update(id, params) {
  const account = await getAccount(id);

  // validate
  if (
    account.email !== params.email &&
    (await db.Account.findOne({ email: params.email }))
  ) {
    throw 'Email "' + params.email + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
    params.passwordHash = hash(params.password);
  }

  // copy params to account and save
  Object.assign(account, params);
  account.updated = Date.now();
  await account.save();

  return basicDetails(account);
}

async function _delete(id) {
  const account = await getAccount(id);
  await account.remove();
}