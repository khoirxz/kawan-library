const Joi = require("joi");

const DecreeSchema = Joi.object({
  user_id: Joi.string().optional().allow(null, ""),
  category_id: Joi.number().required(),
  title: Joi.string().required(),
  number: Joi.string().required().allow(null, ""),
  description: Joi.string().required().allow(null, ""),
  effective_date: Joi.date().required(),
  expired_date: Joi.date().allow(null),
});

const DecreeCategorySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  isPublic: Joi.boolean().required(),
});

module.exports = { DecreeCategorySchema, DecreeSchema };
