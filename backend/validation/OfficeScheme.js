const Joi = require("joi");

// Skema
const OfficeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  address: Joi.string().required(),
});

module.exports = { OfficeSchema };
