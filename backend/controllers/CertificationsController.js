var Joi = require("joi");
var fs = require("fs");
var Op = require("sequelize").Op;
var CertificationsModel = require("../model/CertificationsModel");

var getCertificationsByIdUser = async function (req, res) {
  try {
    var data = await CertificationsModel.findAll({
      where: { user_id: req.params.id },
    });
    res.status(200).json({
      code: 200,
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

var getCertificateById = async function (req, res) {
  try {
    var data = await CertificationsModel.findOne({
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

var createCertificate = async function (req, res) {
  try {
    var { user_id, name, description, date } = req.body;

    if (!req.file) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: "File required",
      });
    }

    var schema = Joi.object({
      user_id: Joi.number().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      date: Joi.date().required(),
    });

    var { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: error.message,
      });
    }

    var data = await CertificationsModel.create({
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

var updateCertificateById = async function (req, res) {
  try {
    var oldData = await CertificationsModel.findOne({
      where: { id: req.params.id },
    });

    if (!oldData) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        message: "Certificate not found",
      });
    }

    var { user_id, name, description, date } = req.body;

    var schema = Joi.object({
      user_id: Joi.number().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      date: Joi.date().required(),
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

var deleteCertificateById = async function (req, res) {
  try {
    var data = await CertificationsModel.findOne({
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
var searchCertificate = async function (req, res) {
  try {
    var data = await CertificationsModel.findAll({
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
  getCertificationsByIdUser,
  getCertificateById,
  createCertificate,
  updateCertificateById,
  deleteCertificateById,
  searchCertificate,
};
