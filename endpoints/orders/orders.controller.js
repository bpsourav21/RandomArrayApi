const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const validateRequest = require("middleware/validate-request");
const authorize = require("middleware/authorize");
const Role = require("../accounts/role");
const orderService = require("./order.service");

// routes
router.post("/placeOrder/", placeOrderSchema, placeOrder);

module.exports = router;

function placeOrderSchema(req, res, next) {
  const userDto = Joi.object({
    id: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    name: Joi.string().required(),
  });

  const ProductDto = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    subName: Joi.string().required(),
    description: Joi.string().required(),
    categoryId: Joi.number(),
    price: Joi.number(),
    unit: Joi.string().required(),
    img: Joi.string().required(),
    carouselImg: Joi.array(),
    discount: Joi.number(),
    tags: Joi.array(),
    type: Joi.string().required(),
    created: Joi.date(),
    updated: Joi.date(),
  });

  const shoppingCartDto = Joi.object({
    product: ProductDto,
    quantity: Joi.number().required(),
  });
  const schema = Joi.object({
    customerName: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    areaId: Joi.number(),
    cart: Joi.array().items(shoppingCartDto),
    user: userDto,
    total: Joi.number(),
    subTotal: Joi.number(),
    discount: Joi.number(),
    deliveryFee: Joi.number(),
    discountCode: Joi.string(),
    isPaid: Joi.boolean(),
  });
  validateRequest(req, next, schema);
}

function placeOrder(req, res, next) {
  orderService
    .placeOrder(req.body)
    .then((product) => res.json(product))
    .catch(next);
}
