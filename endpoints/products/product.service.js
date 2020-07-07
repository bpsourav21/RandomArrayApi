const db = require("helpers/db");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  const products = await db.Product.find();
  return products;
}
async function getById(id) {
  const product = await db.Product.findById(id);
  if (!product) throw "Product not found";
  return product;
}

async function create(params) {
  // validate
  if (params.id && (await db.Product.findOne({ id: params.id }))) {
    throw "Product exists";
  }
  const product = new db.Product(params);
  // save product
  await product.save();
  return product;
}

async function update(id, params) {
  const product = await db.Product.findById(id);
  if (!product) throw "Product not found";
  Object.assign(product, params);
  product.updated = Date.now();
  // save product
  await product.save();
  return product;
}

async function _delete(id) {
  const product = await db.Product.findById(id);
  if (!product) throw "Product not found";
  await product.remove();
}
