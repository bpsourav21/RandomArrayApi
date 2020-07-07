const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
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

module.exports = mongoose.model("Product", schema);
