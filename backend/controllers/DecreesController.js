const Joi = require("joi");
const fs = require("fs");
const Op = require("sequelize").Op;
const { DecreesModel } = require("../model/index");
const responseHandler = require("../helpers/responseHandler");
const { Paginate } = require("../helpers/paginationHandler");

const getAllDecrees = async (req, res) => {
  try {
    const { search, userId, page, limit } = req.query;

    // Filter pencarian
    const whereClause = search
      ? {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    // Filter user berdasarkan role
    const userFilter =
      req.decoded.role === "admin"
        ? userId === undefined || userId === null || userId === ""
          ? {}
          : { user_id: userId }
        : { user_id: req.decoded.userId };

    // Gabungkan filter pencarian dan user
    const where = {
      ...whereClause,
      ...userFilter,
    };

    // Pagination
    const result = await Paginate(DecreesModel, {
      page,
      limit,
      where,
      include: [
        {
          association: "user",
          attributes: ["id", "role", "username", "avatarImg", "verified"],
        },
        {
          association: "category",
          attributes: ["id", "title", "description"],
        },
      ],
      attributes: { exclude: ["user_id", "category_id"] },
    });

    console.log(typeof userId);

    responseHandler(res, 200, {
      message: `Success get ${userId ? "user" : "all"} decrees`,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const getDecreeById = async (req, res) => {
  try {
    const data = await DecreesModel.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["user_id"] },
      include: ["user"],
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
      category_id,
      title,
      description,
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
      user_id: Joi.string().optional().allow(null, ""),
      category_id: Joi.number().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
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
      user_id: user_id || null,
      title,
      description,
      category_id,
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
      category_id,
      status,
      effective_date,
      expired_date,
    } = req.body;

    const schema = Joi.object({
      user_id: Joi.string().optional(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      category_id: Joi.string().required(),
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
          category_id,
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
          category_id,
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

module.exports = {
  getAllDecrees,
  getDecreeById,
  createDecree,
  updateDecreeById,
  deleteDecreeById,
};
