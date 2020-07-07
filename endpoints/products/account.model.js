const mongoose = require("mongoose");
const uuid = require("uuid");
const Schema = mongoose.Schema;

const schema = new Schema({
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  guid: { type: String, default: uuid.v4(), unique: true },
  role: { type: String, required: true },
  verificationToken: String,
  verified: Date,
  resetToken: {
    token: String,
    expires: Date,
  },
  passwordReset: Date,
  created: { type: Date, default: Date.now },
  updated: Date,
});

// schema.virtual("guid").get(function () {
//   return this._id;
// });

schema.virtual("isVerified").get(function () {
  return !!(this.verified || this.passwordReset);
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
    delete ret.passwordHash;
  },
});

module.exports = mongoose.model("Account", schema);
