const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const validateRequest = require("middleware/validate-request");
const authorize = require("middleware/authorize");
const Role = require("../accounts/role");
const productService = require("./product.service");

// routes
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createOrUpdateSchema, create);
router.put("/:id", createOrUpdateSchema, update);
router.delete("/:id", authorize(), _delete);

module.exports = router;

function getAll(req, res, next) {
  productService
    .getAll()
    .then((products) => res.json(products))
    .catch(next);
}

function getById(req, res, next) {
  productService
    .getById(req.params.id)
    .then((product) => (product ? res.json(product) : res.sendStatus(404)))
    .catch(next);
}

function createOrUpdateSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    subName: Joi.string(),
    description: Joi.string(),
    unit: Joi.string(),
    tags: Joi.array(),
    type: Joi.string(),
    img: Joi.string(),
    carouselImg: Joi.array(),
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  productService
    .create(req.body)
    .then((product) => res.json(product))
    .catch(next);
}

function update(req, res, next) {
  productService
    .update(req.params.id, req.body)
    .then((product) => res.json(product))
    .catch(next);
}

function _delete(req, res, next) {
  // users can delete their own product and admins can delete any product
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  productService
    .delete(req.params.id)
    .then(() => res.json({ message: "product deleted successfully" }))
    .catch(next);
}
