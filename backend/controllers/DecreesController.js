var Joi = require("joi");
var fs = require("fs");
var DecreesModel = require("../model/DecreesModel");

// same as getAllDecrees
var getAllDecreesByIdUser = async function (req, res) {
  try {
    var data = await DecreesModel.findAll({
      where: { user_id: req.params.id },
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "failed",
      message: error.message,
    });
  }
};

var getDecreeById = async function (req, res) {
  try {
    var data = await DecreesModel.findOne({
      where: { id: req.params.id },
    });

    if (!data) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        message: "Decree not found",
      });
    }

    return res.status(200).json({
      code: 200,
      status: "success",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "failed",
      message: error.message,
    });
  }
};

var createDecree = async function (req, res) {
  try {
    var {
      user_id,
      title,
      description,
      category,
      status,
      effective_date,
      expired_date,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: "File required",
      });
    }

    var schema = Joi.object({
      user_id: Joi.number().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      status: Joi.string().required(),
      effective_date: Joi.date().required(),
      expired_date: Joi.date().allow(null),
    });

    var { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: error.message,
      });
    }

    var data = await DecreesModel.create({
      user_id,
      title,
      description,
      category,
      status,
      effective_date,
      expired_date: expired_date || null,
      file_path: req.file.filename,
    });

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

var updateDecreeById = async function (req, res) {
  try {
    var oldData = await DecreesModel.findOne({
      where: { id: req.params.id },
    });

    var {
      user_id,
      title,
      description,
      category,
      status,
      effective_date,
      expired_date,
    } = req.body;

    var schema = Joi.object({
      user_id: Joi.number().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      status: Joi.string().required(),
      effective_date: Joi.date().required(),
      expired_date: Joi.date().allow(null),
    });

    var { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: error.message,
      });
    }

    var data;
    // check if file exist,
    if (req.file) {
      await DecreesModel.update(
        {
          user_id,
          title,
          description,
          category,
          status,
          effective_date,
          expired_date,
          file_path: req.file.filename,
        },
        {
          where: { id: req.params.id },
        }
      );

      // delete old file
      fs.unlinkSync("public/uploads/decrees/" + oldData.file_path);
    } else {
      await DecreesModel.update(
        {
          user_id,
          title,
          description,
          category,
          status,
          effective_date,
          expired_date,
        },
        {
          where: { id: req.params.id },
        }
      );
    }

    data = await DecreesModel.findOne({
      where: { id: req.params.id },
    });

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

var deleteDecreeById = async function (req, res) {
  try {
    var data = await DecreesModel.findOne({
      where: { id: req.params.id },
    });

    if (!data) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        message: "Decree not found",
      });
    }

    fs.unlinkSync("public/uploads/decrees/" + data.file_path);

    await DecreesModel.destroy({
      where: { id: req.params.id },
    });

    res.status(204).json({
      code: 204,
      status: "success",
      data: "Decree deleted successfully",
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
  getAllDecreesByIdUser,
  getDecreeById,
  createDecree,
  updateDecreeById,
  deleteDecreeById,
};
