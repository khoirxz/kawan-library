const Joi = require("joi");

// Skema dasar untuk semua kasus
const baseUserSchema = Joi.object({
  username: Joi.string().required().min(4),
  role: Joi.string().required(),
  verified: Joi.boolean().required(),
});

// Skema untuk create (memerlukan password)
const createUserSchema = baseUserSchema.keys({
  password: Joi.string().required(), // Password wajib untuk create
});

// Skema untuk update (password opsional)
const updateUserSchema = baseUserSchema.keys({
  password: Joi.string().allow("").optional(), // Password tidak wajib untuk update
});

module.exports = { createUserSchema, updateUserSchema };
