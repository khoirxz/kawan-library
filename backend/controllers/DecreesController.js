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
            { number: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    // Filter user berdasarkan role
    let userFilter = {};
    if (req.decoded.role === "admin") {
      userFilter = userId ? { user_id: userId } : {};
    } else {
      // Non-admin dapat mengakses data dengan user_id mereka atau kategori isPublic
      userFilter = {
        [Op.or]: [
          { user_id: req.decoded.userId }, // Data milik mereka
          { "$category.isPublic$": true }, // Data kategori publik
        ],
      };
    }

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
          attributes: ["id", "isPublic", "title", "description"],
          required: false, // Tetap tampilkan meskipun kategori null
        },
      ],
      attributes: { exclude: ["user_id", "category_id"] },
    });

    responseHandler(res, 200, {
      message: `Success get ${userId ? "user" : "all"} decrees`,
      data: result.data,
      attributes: { exclude: ["user_id", "category_id"] },
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
      number,
      description,
      effective_date,
      expired_date,
    } = req.body;

    if (!req.file) {
      return responseHandler(res, 400, { message: "File is required" });
    }

    const schema = Joi.object({
      user_id: Joi.string().optional().allow(null, ""),
      category_id: Joi.number().required(),
      title: Joi.string().required(),
      number: Joi.string().required(),
      description: Joi.string().required(),
      effective_date: Joi.date().required(),
      expired_date: Joi.date().allow(null),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return responseHandler(res, 400, { message: error.message });
    }

    const data = await DecreesModel.create({
      user_id: user_id || null,
      title,
      description,
      number,
      category_id,
      effective_date,
      expired_date: expired_date || null,
      file_path: req.file.filename,
    });

    responseHandler(res, 201, {
      message: "Success create decree",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
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
      number,
      description,
      category_id,
      effective_date,
      expired_date,
    } = req.body;

    const schema = Joi.object({
      user_id: Joi.string().optional(),
      title: Joi.string().required(),
      number: Joi.string().allow(null),
      description: Joi.string().required(),
      category_id: Joi.string().required(),
      effective_date: Joi.date().required(),
      expired_date: Joi.date().allow(null),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return responseHandler(res, 400, { message: error.message });
    }

    let data;
    // check if file exist,
    if (req.file) {
      await DecreesModel.update(
        {
          user_id,
          title,
          number,
          description,
          category_id,
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
          number,
          description,
          category_id,
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

    responseHandler(res, 200, {
      message: "Success update decree",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

const deleteDecreeById = async (req, res) => {
  try {
    const data = await DecreesModel.findOne({
      where: { id: req.params.id },
    });

    if (!data) {
      return responseHandler(res, 404, { message: "Decree not found" });
    }

    fs.unlinkSync("public/uploads/decrees/" + data.file_path);

    await DecreesModel.destroy({
      where: { id: req.params.id },
    });

    responseHandler(res, 200, {
      message: "Success delete decree",
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

module.exports = {
  getAllDecrees,
  getDecreeById,
  createDecree,
  updateDecreeById,
  deleteDecreeById,
};
