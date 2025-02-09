const Joi = require("joi");

const CertificateSchema = Joi.object({
  user_id: Joi.string().optional().allow(null, ""),
  title: Joi.string().required(),
  description: Joi.string().required(),
  date: Joi.date().required(),
});

module.exports = { CertificateSchema };
