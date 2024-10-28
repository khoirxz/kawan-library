var Joi = require("joi");
var UserDataModel = require("../model/UserDataModel");

/**
 * Get user data by id
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {Promise} - promise that resolves to an object with a status code, status message, and data (if any)
 */
var getUserDataById = async function (req, res) {
  try {
    var data;
    if (req.decoded.role === "admin") {
      data = await UserDataModel.findAll({
        where: { user_id: req.params.id },
      });
      if (data.length === 0) {
        return res.status(404).json({
          code: 404,
          status: "error",
          message: "User data not found",
        });
      }
    } else {
      data = await UserDataModel.findAll({
        where: { user_id: req.decoded.userId },
      });
      if (data.length === 0) {
        return res.status(404).json({
          code: 404,
          status: "error",
          message: "User data not found",
        });
      }
    }

    res.status(200).json({
      code: 200,
      status: "success",
      data,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Create user data if it does not already exist.
 *
 * This function receives a request object containing user details and checks if
 * the data already exists in the database. If it does, it returns a conflict error.
 * Otherwise, it validates the input using Joi schema and creates new user data in
 * the database. The response includes a status code, status message, and the created data.
 *
 * @param {Object} req - The request object containing user data in the body.
 * @param {Object} res - The response object to send the status and data.
 * @returns {Promise} - Resolves to a JSON response indicating success or error.
 */
var createUserData = async function (req, res) {
  try {
    var {
      user_id,
      address,
      subdistrict,
      city,
      province,
      country,
      postal_code,
      email,
    } = req.body;

    // cek jika data sudah ada
    var data = await UserDataModel.findAll({
      where: { user_id: user_id },
    });
    if (data.length > 0) {
      return res.status(409).json({
        code: 409,
        status: "error",
        message: "Data already exist",
      });
    }

    var schema = Joi.object({
      user_id: Joi.number().required(),
      address: Joi.string().required(),
      subdistrict: Joi.string().required(),
      city: Joi.string().required(),
      province: Joi.string().required(),
      country: Joi.string().required(),
      postal_code: Joi.string().required(),
      email: Joi.string().required(),
    });

    var { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: error.message,
      });
    }

    if (req.decoded.role === "admin") {
      data = await UserDataModel.create({
        user_id: user_id,
        address: address,
        subdistrict: subdistrict,
        city: city,
        province: province,
        country: country,
        postal_code: postal_code,
        email: email,
      });
    } else {
      // cek jika data sudah ada
      data = await UserDataModel.findAll({
        where: { user_id: req.decoded.userId },
      });

      if (data.length > 0) {
        return res.status(409).json({
          code: 409,
          status: "error",
          message: "Data already exist",
        });
      }

      data = await UserDataModel.create({
        user_id: req.decoded.userId,
        address: address,
        subdistrict: subdistrict,
        city: city,
        province: province,
        country: country,
        postal_code: postal_code,
        email: email,
      });
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

var updateUserData = async function (req, res) {
  try {
    var {
      user_id,
      address,
      subdistrict,
      city,
      province,
      country,
      postal_code,
      email,
    } = req.body;

    var schema = Joi.object({
      user_id: Joi.number().required(),
      address: Joi.string().required(),
      subdistrict: Joi.string().required(),
      city: Joi.string().required(),
      province: Joi.string().required(),
      country: Joi.string().required(),
      postal_code: Joi.string().required(),
      email: Joi.string().required(),
    });

    var { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: error.message,
      });
    }

    // check if data exist
    var oldData = await UserDataModel.findAll({
      where: { user_id: user_id },
    });
    if (oldData.length == 0) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Data not found",
      });
    }

    var data;
    if (req.decoded.role === "admin") {
      data = await UserDataModel.update(
        {
          address: address,
          subdistrict: subdistrict,
          city: city,
          province: province,
          country: country,
          postal_code: postal_code,
          email: email,
        },
        {
          where: { user_id: user_id },
        }
      );
    } else {
      if (req.decoded.userId != user_id) {
        return res.status(403).json({
          code: 403,
          status: "error",
          message: "Forbidden",
        });
      } else {
        data = await UserDataModel.update(
          {
            address: address,
            subdistrict: subdistrict,
            city: city,
            province: province,
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
