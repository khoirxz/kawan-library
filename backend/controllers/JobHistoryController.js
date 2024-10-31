const Joi = require("joi");
const JobHistoryModel = require("../model/JobHistoryModel");
const UsersModel = require("../model/UsersModel");
const responseHandler = require("../helpers/responseHandler");

const getUserJobHistory = async function (req, res) {
  try {
    const { user_id } = req.params;

    let data;
    // cek jika admin
    if (req.decoded.role === "admin") {
      data = await JobHistoryModel.findAll({
        where: { user_id: user_id },
      });
    } else {
      // jika bukan admin, hanya akan mengambil data sesuai user_id
      data = await JobHistoryModel.findAll({
        where: { user_id: req.decoded.userId },
      });
    }

    return responseHandler(res, 200, {
      message: "Success get user job history",
      data: data,
    });
  } catch (error) {
    return responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const getUserJobHistoryById = async function (req, res) {
  try {
    const { id } = req.params;

    const data = await JobHistoryModel.findAll({
      where: { id: id },
    });

    return responseHandler(res, 200, {
      message: "Success get user job history",
      data: data,
    });
  } catch (error) {
    return responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const createUserJobHistory = async function (req, res) {
  try {
    const {
      user_id,
      company_name,
      position,
      start_date,
      end_date,
      job_description,
      location,
      is_current,
    } = req.body;

    const schema = Joi.object({
      user_id: Joi.number().required(),
      company_name: Joi.string().required(),
      position: Joi.string().required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().allow(null),
      job_description: Joi.string().required(),
      location: Joi.string().required(),
      is_current: Joi.boolean().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: error.message,
      });
    }

    // check if user exist
    const user = await UsersModel.findAll({
      where: { id: user_id },
    });

    if (user.length == 0) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        message: "User not found",
      });
    }

    let data;

    if (req.decoded.role === "admin") {
      data = await JobHistoryModel.create({
        user_id: user_id,
        company_name: company_name,
        position: position,
        start_date: start_date,
        end_date: end_date,
        job_description: job_description,
        location: location,
        is_current: is_current,
      });
    } else {
      data = await JobHistoryModel.create({
        user_id: req.decoded.userId,
        company_name: company_name,
        position: position,
        start_date: start_date,
        end_date: end_date,
        job_description: job_description,
        location: location,
        is_current: is_current,
      });
    }

    return responseHandler(res, 201, {
      message: "Success create user job history",
      data: data,
    });
  } catch (error) {
    return responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const updateUserJobHistory = async function (req, res) {
  try {
    const { id } = req.params;
    const {
      user_id,
      company_name,
      position,
      start_date,
      end_date,
      job_description,
      location,
      is_current,
    } = req.body;

    const schema = Joi.object({
      user_id: Joi.number().required(),
      company_name: Joi.string().required(),
      position: Joi.string().required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().allow(null),
      job_description: Joi.string().required(),
      location: Joi.string().required(),
      is_current: Joi.boolean().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: error.message,
      });
    }

    // check if user exist
    const user = await UsersModel.findAll({
      where: { id: user_id },
    });

    if (user.length == 0) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        message: "User not found",
      });
    }

    let data;
    if (req.decoded.role === "admin") {
      data = await JobHistoryModel.update(
        {
          user_id: user_id,
          company_name: company_name,
          position: position,
          start_date: start_date,
          end_date: end_date,
          job_description: job_description,
          location: location,
          is_current: is_current,
        },
        {
          where: { id: id },
        }
      );
    } else {
      data = await JobHistoryModel.update(
        {
          user_id: req.decoded.userId,
          company_name: company_name,
          position: position,
          start_date: start_date,
          end_date: end_date,
          job_description: job_description,
          location: location,
          is_current: is_current,
        },
        {
          where: { id: id },
        }
      );
    }

    return responseHandler(res, 200, {
      message: "Success update user job history",
      data: data,
    });
  } catch (error) {
    return responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const deleteUserJobHistory = async function (req, res) {
  try {
    const { id } = req.params;

    // cek jika data sudah ada
    const oldData = await JobHistoryModel.findAll({
      where: { id: id },
    });

    if (!oldData) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        message: "Data not found",
      });
    }

    let data;
    if (req.decoded.role !== "admin") {
      const userJobHistory = await JobHistoryModel.findOne({
        where: { id: id, user_id: req.decoded.userId },
      });

      if (!userJobHistory) {
        return res.status(403).json({
          code: 403,
          status: "failed",
          message: "Forbidden, you don't have permission",
        });
      }

      data = await JobHistoryModel.destroy({
        where: { id: id, user_id: req.decoded.userId },
      });
    } else {
      data = await JobHistoryModel.destroy({
        where: { id: id },
      });
    }

    return responseHandler(res, 200, {
      message: "Success delete user job history",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

module.exports = {
  getUserJobHistory,
  getUserJobHistoryById,
  createUserJobHistory,
  updateUserJobHistory,
  deleteUserJobHistory,
};
