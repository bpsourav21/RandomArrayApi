const db = require("helpers/db");

module.exports = {
  placeOrder,
};

async function placeOrder(params) {
  // validate
  if (params.id && (await db.Order.findOne({ id: params.id }))) {
    throw "order exists";
  }
  const order = new db.Order(params);
  // save order
  await order.save();
  return order;
}
