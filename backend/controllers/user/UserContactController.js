const Joi = require("joi");
const { UserContactModel } = require("../../model/index");
const responseHandler = require("../../helpers/responseHandler");

const getById = async (req, res) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });

  const { error } = schema.validate(req.params);

  if (error) {
    return responseHandler(res, 400, {
      message: error.message,
    });
  }

  try {
    let data;

    if (req.decoded.role === "admin") {
      data = await UserContactModel.findAll({
        where: { user_id: req.params.id },
      });

      if (data.length === 0) {
        return res.status(204).json({
          code: 204,
          status: "success",
          message: "User data not found",
        });
      }
    } else {
      data = await UserContactModel.findAll({
        where: { user_id: req.decoded.id },
      });
    }

    responseHandler(res, 200, {
      message: "Success get user contact",
      data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  const { user_id, email, phone, emergency_contact, instagram, facebook } =
    req.body;

  const schema = Joi.object({
    user_id: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.number().required(),
    emergency_contact: Joi.number().required(),
    instagram: Joi.string().required(),
    facebook: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return responseHandler(res, 400, {
      message: error.message,
    });
  }

  try {
    const oldData = await UserContactModel.findAll({
      where: { user_id: user_id },
    });

    if (oldData.length > 0) {
      return responseHandler(res, 400, {
        message: "User contact already exist",
      });
    }

    let data;
    if (req.decoded.role === "admin") {
      data = await UserContactModel.create({
        user_id: user_id,
        email: email,
        phone: phone,
        emergency_contact: emergency_contact,
        instagram: instagram,
        facebook: facebook,
      });
    } else {
      data = await UserContactModel.create({
        user_id: req.decoded.id,
        email: email,
        phone: phone,
        emergency_contact: emergency_contact,
        instagram: instagram,
        facebook: facebook,
      });
    }

    responseHandler(res, 200, {
      message: "Success create user contact",
      data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  const { user_id, email, phone, emergency_contact, instagram, facebook } =
    req.body;

  const schema = Joi.object({
    user_id: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.number().required(),
    emergency_contact: Joi.number().required(),
    instagram: Joi.string().required(),
    facebook: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return responseHandler(res, 400, {
      message: error.message,
    });
  }

  try {
    const oldData = await UserContactModel.findAll({
      where: { user_id: user_id },
    });

    if (oldData.length === 0) {
      return responseHandler(res, 400, {
        message: "User contact not found",
      });
    }

    let data;
    if (req.decoded.role === "admin") {
      data = await UserContactModel.update(
        {
          user_id: user_id,
          email: email,
          phone: phone,
          emergency_contact: emergency_contact,
          instagram: instagram,
          facebook: facebook,
        },
        {
          where: { user_id: user_id },
        }
      );
    } else {
      data = await UserContactModel.update(
        {
          user_id: req.decoded.id,
          email: email,
          phone: phone,
          emergency_contact: emergency_contact,
          instagram: instagram,
          facebook: facebook,
        },
        {
          where: { user_id: req.decoded.id },
        }
      );
    }

    responseHandler(res, 200, {
      message: "Success update user contact",
      data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

module.exports = { getById, create, update };
