const Joi = require("joi");
const fs = require("fs");
const Op = require("sequelize").Op;
const DecreesModel = require("../model/DecreesModel");

// same as getAllDecrees
const getAllDecreesByIdUser = async (req, res) => {
  try {
    const data = await DecreesModel.findAll({
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

const getDecreeById = async (req, res) => {
  try {
    const data = await DecreesModel.findOne({
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

const createDecree = async (req, res) => {
  try {
    const {
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

    const schema = Joi.object({
      user_id: Joi.number().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      status: Joi.string().required(),
      effective_date: Joi.date().required(),
      expired_date: Joi.date().allow(null),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: error.message,
      });
    }

    const data = await DecreesModel.create({
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

const updateDecreeById = async (req, res) => {
  try {
    const oldData = await DecreesModel.findOne({
      where: { id: req.params.id },
    });

    const {
      user_id,
      title,
      description,
      category,
      status,
      effective_date,
      expired_date,
    } = req.body;

    const schema = Joi.object({
      user_id: Joi.number().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      status: Joi.string().required(),
      effective_date: Joi.date().required(),
      expired_date: Joi.date().allow(null),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: error.message,
      });
    }

    let data;
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

const deleteDecreeById = async (req, res) => {
  try {
    const data = await DecreesModel.findOne({
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

// search decrees by name and userID
const searchDecrees = async (req, res) => {
  try {
    const data = await DecreesModel.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${req.query.search}%` } },
          { description: { [Op.like]: `%${req.query.search}%` } },
        ],
        user_id: req.params.id,
      },
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

// fungsi ini digunakan untuk menampilkan semua decrees
// dari id user yang didapatkan dari req.decoded.id (middleware/auth.js)
const getAllDecrees = async (req, res) => {
  try {
    const data = await DecreesModel.findAll({
      where: { user_id: req.decoded.userId },
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

module.exports = {
  getAllDecreesByIdUser,
  getDecreeById,
  createDecree,
  updateDecreeById,
  deleteDecreeById,
  searchDecrees,
  getAllDecrees,
};
