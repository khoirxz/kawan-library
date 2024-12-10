const Joi = require("joi");

const userDataSchema = Joi.object({
  user_id: Joi.string().required(),
  nik: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  dateBirth: Joi.date().required(),
  gender: Joi.string().required(),
  religion: Joi.string().required(),
  maritalStatus: Joi.string().required(),
});

module.exports = { userDataSchema };
