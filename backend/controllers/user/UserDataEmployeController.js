const Joi = require("joi");
const { UserDataEmployeModel } = require("../../model/index");
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
      data = await UserDataEmployeModel.findAll({
        where: { user_id: req.params.id },
        attributes: { exclude: ["supervisor"] },
        include: ["supervisor_info"],
      });

      if (data.length === 0) {
        return res.status(204).json({
          code: 204,
          status: "success",
          message: "User data not found",
        });
      }
    } else {
      data = await UserDataEmployeModel.findOne({
        where: { user_id: req.decoded.userId },
        attributes: { exclude: ["supervisor"] },
        include: ["supervisor_info"],
      });

      if (!data) {
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

const create = async (req, res) => {
  const { user_id, supervisor_id, position, status, salary } = req.body;

  const schema = Joi.object({
    user_id: Joi.string().required(),
    supervisor_id: Joi.string().allow("", null),
    position: Joi.string().required(),
    status: Joi.string().required(),
    salary: Joi.number().required(),
    // start_date: Joi.date().required(),
    // end_date: Joi.date().allow(null).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return responseHandler(res, 400, {
      message: error.message,
    });
  }

  try {
    const oldData = await UserDataEmployeModel.findAll({
      where: { user_id: user_id },
    });

    if (oldData.length > 0) {
      return responseHandler(res, 400, {
        message: "User data already exist",
      });
    }

    const data = await UserDataEmployeModel.create({
      user_id: user_id,
      supervisor: supervisor_id ? supervisor_id : null,
      position: position,
      status: status,
      salary: salary,
      // start_date: start_date,
      // end_date: end_date,
    });

    responseHandler(res, 200, {
      message: "Success create user data",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  const {
    user_id,
    supervisor_id,
    position,
    status,
    salary,
    // start_date,
    // end_date,
  } = req.body;

  const schema = Joi.object({
    user_id: Joi.string().required(),
    supervisor_id: Joi.string().allow("", null),
    position: Joi.string().required(),
    status: Joi.string().required(),
    salary: Joi.number().required(),
    // start_date: Joi.date().required(),
    // end_date: Joi.date().allow(null).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return responseHandler(res, 400, {
      message: error.message,
    });
  }

  try {
    const data = await UserDataEmployeModel.update(
      {
        user_id: user_id,
        supervisor: supervisor_id ? supervisor_id : null,
        position: position,
        status: status,
        salary: salary,
        // start_date: start_date,
        // end_date: end_date,
      },
      {
        where: { user_id: user_id },
      }
    );

    responseHandler(res, 200, {
      message: "Success update user data",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

module.exports = {
  getById,
  create,
  update,
};
