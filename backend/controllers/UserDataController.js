var Joi = require("joi");
var UserDataModel = require("../model/UserDataModel");

var getUserDataById = async function (req, res) {
  try {
    var data = await UserDataModel.findAll({
      where: { user_id: req.params.id },
    });
    res.status(200).json({
      code: 200,
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

var createUserData = async function (req, res) {
  try {
    var { user_id, address, city, state, country, postal_code, email } =
      req.body;

    // cek jika data sudah ada
    var data = await UserDataModel.findAll({
      where: { user_id: user_id },
    });
    if (data.length > 0) {
      return res.status(409).json({
        code: 409,
        status: "failed",
        message: "Data already exist",
      });
    }

    var schema = Joi.object({
      user_id: Joi.number().required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      postal_code: Joi.string().required(),
      email: Joi.string().required(),
    });

    var { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: error.message,
      });
    }

    var data = await UserDataModel.create({
      user_id: user_id,
      address: address,
      city: city,
      state: state,
      country: country,
      postal_code: postal_code,
      email: email,
    });

    res.status(200).json({
      code: 200,
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

var updateUserData = async function (req, res) {
  try {
    var { user_id, address, city, state, country, postal_code, email } =
      req.body;

    var schema = Joi.object({
      user_id: Joi.number().required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      postal_code: Joi.string().required(),
      email: Joi.string().required(),
    });

    var { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: error.message,
      });
    }

    if (res.decoded.role === "admin") {
      var data = await UserDataModel.update(
        {
          address: address,
          city: city,
          state: state,
          country: country,
          postal_code: postal_code,
          email: email,
        },
        {
          where: { user_id: user_id },
        }
      );
    } else {
      if (res.decoded.userId != user_id) {
        return res.status(403).json({
          code: 403,
          status: "failed",
          message: "Forbidden",
        });
      } else {
        var data = await UserDataModel.update(
          {
            address: address,
            city: city,
            state: state,
            country: country,
            postal_code: postal_code,
            email: email,
          },
          {
            where: { user_id: user_id },
          }
        );
      }
    }

    res.status(200).json({
      code: 200,
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserDataById,
  createUserData,
  updateUserData,
};
