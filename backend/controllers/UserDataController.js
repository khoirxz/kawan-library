const Joi = require("joi");
const UserDataModel = require("../model/UserDataModel");
const responseHandler = require("../helpers/responseHandler");

/**
 * Get user data by id
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {Promise} - promise that resolves to an object with a status code, status message, and data (if any)
 */
const getUserDataById = async (req, res) => {
  try {
    let data;
    if (req.decoded.role === "admin") {
      const oldData = await UserDataModel.findAll({
        where: { user_id: req.params.id },
      });

      if (oldData.length === 0) {
        return res.status(204).json({
          code: 204,
          status: "success",
          message: "User data not found",
        });
      }
    } else {
      data = await UserDataModel.findAll({
        where: { user_id: req.decoded.userId },
      });

      if (data.length === 0) {
        return responseHandler(res, 204, {
          message: "User data not found",
        });
      }
    }

    responseHandler(res, 200, {
      message: "Success get user data",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const createUserData = async (req, res) => {
  try {
    const {
      user_id,
      address,
      subdistrict,
      city,
      province,
      country,
      postal_code,
      email,
      phone,
    } = req.body;

    // cek jika data sudah ada
    const oldData = await UserDataModel.findAll({
      where: { user_id: user_id },
    });
    if (oldData.length > 0) {
      return res.status(409).json({
        code: 409,
        status: "error",
        message: "Data already exist",
      });
    }

    const schema = Joi.object({
      user_id: Joi.number().required(),
      address: Joi.string().required(),
      subdistrict: Joi.string().required(),
      city: Joi.string().required(),
      province: Joi.string().required(),
      country: Joi.string().required(),
      postal_code: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: error.message,
      });
    }

    let data;
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
        phone: phone,
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
        phone: phone,
      });
    }

    responseHandler(res, 201, {
      message: "Success create user data",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserData = async (req, res) => {
  try {
    const {
      user_id,
      address,
      subdistrict,
      city,
      province,
      country,
      postal_code,
      email,
      phone,
    } = req.body;

    const schema = Joi.object({
      user_id: Joi.number().required(),
      address: Joi.string().required(),
      subdistrict: Joi.string().required(),
      city: Joi.string().required(),
      province: Joi.string().required(),
      country: Joi.string().required(),
      postal_code: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return responseHandler(res, 400, {
        message: error.message,
      });
    }

    // check if data exist
    const oldData = await UserDataModel.findAll({
      where: { user_id: user_id },
    });
    if (oldData.length == 0) {
      return responseHandler(res, 404, {
        message: "Data not found",
      });
    }

    let data;
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
          phone: phone,
        },
        {
          where: { user_id: user_id },
        }
      );
    } else {
      if (req.decoded.userId != user_id) {
        return responseHandler(res, 403, {
          message: "Forbidden, you don't have permission",
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
            phone: phone,
          },
          {
            where: { user_id: user_id },
          }
        );
      }
    }

    responseHandler(res, 200, {
      message: "Data updated successfully",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

module.exports = {
  getUserDataById,
  createUserData,
  updateUserData,
};
