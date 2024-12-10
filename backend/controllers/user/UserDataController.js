const Joi = require("joi");
const { UserDataModel } = require("../../model/index");
const responseHandler = require("../../helpers/responseHandler");

const getById = async (req, res) => {
  // validation
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
      data = await UserDataModel.findAll({
        where: { user_id: req.params.id },
      });

      if (data.length === 0) {
        return responseHandler(res, 200, {
          message: "User data not found",
          data: null,
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

    return responseHandler(res, 200, {
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
  const {
    user_id,
    nik,
    first_name,
    last_name,
    dateBirth,
    gender,
    religion,
    maritalStatus,
  } = req.body;

  try {
    // cek jika data sudah ada
    const oldData = await UserDataModel.findAll({
      where: { user_id: user_id },
    });

    if (oldData.length > 0) {
      return responseHandler(res, 409, {
        message: "Data already exist",
      });
    }

    let data;
    if (req.decoded.role === "admin") {
      data = await UserDataModel.create({
        user_id: user_id,
        nik: nik,
        firstName: first_name,
        lastName: last_name,
        dateBirth: dateBirth,
        gender: gender,
        religion: religion,
        maritalStatus: maritalStatus,
      });
    } else {
      data = await UserDataModel.create({
        user_id: req.decoded.userId,
        nik: nik,
        firstName: first_name,
        lastName: last_name,
        dateBirth: dateBirth,
        gender: gender,
        religion: religion,
        maritalStatus: maritalStatus,
      });
    }

    return responseHandler(res, 201, {
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
    nik,
    first_name,
    last_name,
    dateBirth,
    gender,
    religion,
    maritalStatus,
  } = req.body;

  try {
    // cek jika data sudah ada
    const oldData = await UserDataModel.findAll({
      where: { user_id: user_id },
    });
    if (oldData.length === 0) {
      return responseHandler(res, 404, {
        message: "Data not found",
      });
    }

    let data;
    if (req.decoded.role === "admin") {
      data = await UserDataModel.update(
        {
          user_id: user_id,
          nik: nik,
          first_name: first_name,
          last_name: last_name,
          dateBirth: dateBirth,
          gender: gender,
          religion: religion,
          maritalStatus: maritalStatus,
        },
        { where: { user_id: user_id } }
      );
    } else {
      data = await UserDataModel.update(
        {
          user_id: req.decoded.userId,
          nik: nik,
          first_name: first_name,
          last_name: last_name,
          dateBirth: dateBirth,
          gender: gender,
          religion: religion,
          maritalStatus: maritalStatus,
        },
        { where: { user_id: req.decoded.userId } }
      );
    }

    return responseHandler(res, 200, {
      message: "Success update user data",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

module.exports = { getById, create, update };
