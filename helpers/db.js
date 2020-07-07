const config = require("config.json");
const mongoose = require("mongoose");
const AccountModel = require("endpoints/accounts/account.model");
const RefreshTokenModel = require("endpoints/accounts/refresh-token.model");
const ProductModel = require("endpoints/products/product.model");
const OrderModel = require("endpoints/orders/order.model");

const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
mongoose.connect(
  process.env.MONGODB_URI || config.connectionString,
  connectionOptions,
  (err) => {
    if (err) {
      throw err;
    }
    console.log("Mongo db connected...");
  }
);
mongoose.Promise = global.Promise;

module.exports = {
  Account: AccountModel,
  Product: ProductModel,
  Order: OrderModel,
  RefreshToken: RefreshTokenModel,
  isValidId,
};

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
