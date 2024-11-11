const Joi = require("joi");
const fs = require("fs");
const Op = require("sequelize").Op;
const CertificationsModel = require("../model/CertificationsModel");
const responseHandler = require("../helpers/responseHandler");

const getAllCertificates = async (req, res) => {
  try {
    let data;
    if (req.decoded.role === "admin") {
      const searchQuery = req.query.search;
      const whereClause = searchQuery
        ? {
            [Op.or]: [
              { name: { [Op.like]: `%${searchQuery}%` } },
              { description: { [Op.like]: `%${searchQuery}%` } },
            ],
          }
        : {};

      data = await CertificationsModel.findAll({
        where: whereClause,
      });
    } else {
      data = await CertificationsModel.findAll({
        where: { user_id: req.decoded.userId },
      });
    }

    responseHandler(res, 200, {
      message: "Success get all decrees",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const getCertificateById = async (req, res) => {
  try {
    const data = await CertificationsModel.findOne({
      where: { id: req.params.id },
    });

    if (!data) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCertificate = async (req, res) => {
  try {
    const { user_id, name, description, date } = req.body;

    if (!req.file) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: "File required",
      });
    }

    const schema = Joi.object({
      user_id: Joi.number().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      date: Joi.date().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: error.message,
      });
    }

    const data = await CertificationsModel.create({
      user_id: user_id,
      name: name,
      description: description,
      date: date,
      file_path: req.file.filename,
    });

    return res.status(201).json({
      code: 201,
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

const updateCertificateById = async (req, res) => {
  try {
    const oldData = await CertificationsModel.findOne({
      where: { id: req.params.id },
    });

    if (!oldData) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        message: "Certificate not found",
      });
    }

    const { user_id, name, description, date } = req.body;

    const schema = Joi.object({
      user_id: Joi.number().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      date: Joi.date().required(),
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
    // check if file exist
    if (req.file) {
      await CertificationsModel.update(
        {
          user_id,
          name,
          description,
          date,
          file_path: req.file.filename,
        },
        {
          where: { id: req.params.id },
        }
      );

      fs.unlinkSync("public/uploads/certificates/" + oldData.file_path);
    } else {
      data = await CertificationsModel.update(
        {
          user_id,
          name,
          description,
          date,
        },
        {
          where: { id: req.params.id },
        }
      );
    }

    data = await CertificationsModel.findOne({
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

const deleteCertificateById = async (req, res) => {
  try {
    const data = await CertificationsModel.findOne({
      where: { id: req.params.id },
    });

    if (!data) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        message: "Certificate not found",
      });
    }

    fs.unlinkSync("public/uploads/certificates/" + data.file_path);

    await CertificationsModel.destroy({
      where: { id: req.params.id },
    });

    return res.status(204).json({
      code: 204,
      status: "success",
      data: "Certificate deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "failed",
      message: error.message,
    });
  }
};

/**
 * Search certification by name and description
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {String} req.query.search - Search query
 * @returns {Object} - Response object, containing status code and data
 */
const searchCertificate = async (req, res) => {
  try {
    const data = await CertificationsModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${req.query.search}%` } },
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

module.exports = {
  getAllCertificates,
  getCertificateById,
  createCertificate,
  updateCertificateById,
  deleteCertificateById,
  searchCertificate,
};
