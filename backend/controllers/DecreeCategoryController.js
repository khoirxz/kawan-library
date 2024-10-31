const Joi = require("joi");
const DecreeCategoryModel = require("../model/DecreeCategoryModel");
const responseHandler = require("../helpers/responseHandler");

const getAllDecreeCategory = async (req, res) => {
  try {
    const data = await DecreeCategoryModel.findAll();

    responseHandler(res, 200, {
      message: "Success get all decree category",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

const getDecreeCategoryById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await DecreeCategoryModel.findOne({
      where: id,
    });

    responseHandler(res, 200, {
      message: "Success get decree category",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

const createDecreeCategory = async (req, res) => {
  const { name, description } = req.body;

  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });

  const { error } = schema.validate({ name, description });

  if (error) {
    return responseHandler(res, 400, { message: error.message });
  }
  try {
    // check if decree category already exist
    const oldData = await DecreeCategoryModel.findAll({
      where: { name: name },
    });

    if (oldData.length > 0) {
      return responseHandler(res, 400, {
        message: "Decree category already exist",
      });
    }

    // save
    const data = await DecreeCategoryModel.create({
      name,
      description,
    });

    responseHandler(res, 200, {
      message: "Success create decree category",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

const updateDecreeCategoryById = async (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;

  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });

  const { error } = schema.validate({ name, description });

  if (error) {
    return responseHandler(res, 400, { message: error.message });
  }

  try {
    const result = await DecreeCategoryModel.update(
      { name, description },
      { where: { id: id } }
    );

    if (result[0] === 0) {
      return responseHandler(res, 404, {
        message: "Decree category not found",
      });
    }

    responseHandler(res, 200, {
      message: "Success update decree category",
      data: result,
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

/**
 * Delete decree category by id
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {String} req.params.id - Decree category id
 * @returns {Object} - Response object, containing status code and data
 */
const deleteDecreeCategory = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await DecreeCategoryModel.destroy({ where: { id: id } });
    if (result === 0) {
      return responseHandler(res, 404, {
        message: "Decree category not found",
      });
    }

    responseHandler(res, 200, {
      message: "Success delete decree category",
      data: result,
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

module.exports = {
  getAllDecreeCategory,
  getDecreeCategoryById,
  createDecreeCategory,
  updateDecreeCategoryById,
  deleteDecreeCategory,
};
