const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: { type: String },
  email: { type: String },
  phone: { type: String },
  name: { type: String },
});

const productSchema = new Schema({
  name: { type: String },
  subName: { type: String, default: "" },
  description: { type: String, default: "" },
  categoryId: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  unit: { type: String },
  img: { type: String },
  carouselImg: { type: [String], index: true },
  discount: { type: Number, default: 0 },
  tags: { type: [String], index: true },
  type: { type: String },
});

const shoppingCartSchema = new Schema({
  product: { type: productSchema },
  quantity: { type: Number },
});

const schema = new Schema({
  orderNo: { type: String },
  customerName: { type: String, default: "" },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  areaId: { type: Number, default: 0 },
  cart: [shoppingCartSchema],
  user: { type: userSchema },
  total: { type: Number, default: 0 },
  subTotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  discountCode: { type: String, default: "" },
  isPaid: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: Date,
});

// schema.virtual("productId").get(function () {
//   return this.id;
// });

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  // transform: function (doc, ret) {
  //   // remove these props when object is serialized
  //   delete ret._id;
  // },
});

module.exports = mongoose.model("Order", schema);
