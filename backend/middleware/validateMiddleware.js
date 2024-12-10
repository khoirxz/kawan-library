const responseHandler = require("../helpers/responseHandler");

const validateInput = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return responseHandler(res, 400, {
      message: error.message,
    });
  }
  next();
};

module.exports = { validateInput };
