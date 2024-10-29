var Joi = require("joi");
var JobHistoryModel = require("../model/JobHistoryModel");
var UsersModel = require("../model/UsersModel");

var getUserJobHistory = async function (req, res) {
  try {
    var { user_id } = req.params;

    var data;
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

    return res.status(200).json({
      code: 200,
      status: "success",
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: err.message,
    });
  }
};

var getUserJobHistoryById = async function (req, res) {
  try {
    var { id } = req.params;

    var data = await JobHistoryModel.findAll({
      where: { id: id },
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: err.message,
    });
  }
};

var createUserJobHistory = async function (req, res) {
  try {
    var {
      user_id,
      company_name,
      position,
      start_date,
      end_date,
      job_description,
      location,
      is_current,
    } = req.body;

    var schema = Joi.object({
      user_id: Joi.number().required(),
      company_name: Joi.string().required(),
      position: Joi.string().required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().allow(null),
      job_description: Joi.string().required(),
      location: Joi.string().required(),
      is_current: Joi.boolean().required(),
    });

    var { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: error.message,
      });
    }

    // check if user exist
    var user = await UsersModel.findAll({
      where: { id: user_id },
    });

    if (user.length == 0) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        message: "User not found",
      });
    }

    var data;

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

    return res.status(200).json({
      code: 200,
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "failed",
      message: error.message,
    });
  }
};

var updateUserJobHistory = async function (req, res) {
  try {
    var { id } = req.params;
    var {
      user_id,
      company_name,
      position,
      start_date,
      end_date,
      job_description,
      location,
      is_current,
    } = req.body;

    var schema = Joi.object({
      user_id: Joi.number().required(),
      company_name: Joi.string().required(),
      position: Joi.string().required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().allow(null),
      job_description: Joi.string().required(),
      location: Joi.string().required(),
      is_current: Joi.boolean().required(),
    });

    var { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: error.message,
      });
    }

    // check if user exist
    var user = await UsersModel.findAll({
      where: { id: user_id },
    });

    if (user.length == 0) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        message: "User not found",
      });
    }

    var data;
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

    return res.status(200).json({
      code: 200,
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "failed",
      message: error.message,
    });
  }
};

var deleteUserJobHistory = async function (req, res) {
  try {
    var { id } = req.params;
    var data;

    // cek jika data sudah ada
    data = await JobHistoryModel.findAll({
      where: { id: id },
    });

    if (!data) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        message: "Data not found",
      });
    }

    if (req.decoded.role !== "admin") {
      var userJobHistory = await JobHistoryModel.findOne({
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

    return res.status(200).json({
      code: 200,
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "failed",
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
