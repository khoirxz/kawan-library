const Joi = require("joi");
const fs = require("fs");
const Op = require("sequelize").Op;
const { CertificationsModel } = require("../model/index");
const responseHandler = require("../helpers/responseHandler");
const { Paginate } = require("../helpers/paginationHandler");

const getAllCertificates = async (req, res) => {
  try {
    // Example: GET /certificates?search=cert&userId=123&page=2&limit=5

    // Ambil query dari request
    const { search, userId, page, limit } = req.query;

    // Filter pencarian
    const whereClause =
      search !== undefined && search !== null && search !== ""
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
    const result = await Paginate(CertificationsModel, {
      page,
      limit,
      where,
      include: [
        {
          association: "user",
          attributes: {
            exclude: ["password", "token", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: { exclude: ["user_id"] },
    });

    responseHandler(res, 200, {
      message: "Success get all certificates",
      pagination: result.pagination,
      data: result.data,
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
      attributes: { exclude: ["user_id"] },
      include: ["user"],
    });

    if (!data) {
      return responseHandler(res, 404, {
        message: "Certificate not found",
      });
    }

    responseHandler(res, 200, {
      message: "Success get certificate by id",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const createCertificate = async (req, res) => {
  try {
    const { user_id, title, description, date } = req.body;

    if (!req.file) {
      return responseHandler(res, 400, {
        message: "File is required",
      });
    }

    const schema = Joi.object({
      user_id: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      date: Joi.date().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return responseHandler(res, 400, {
        message: error.message,
      });
    }

    const data = await CertificationsModel.create({
      user_id: user_id,
      title: title,
      description: description,
      date: date,
      file_path: req.file.filename,
    });

    responseHandler(res, 200, {
      message: "Success create certificate",
      data: data,
    });
  } catch (error) {
    fs.unlinkSync("public/uploads/certificates/" + req.file.filename);
    responseHandler(res, 500, {
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
      return responseHandler(res, 404, {
        message: "Certificate not found",
      });
    }

    const { user_id, title, description, date } = req.body;

    const schema = Joi.object({
      user_id: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      date: Joi.date().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return responseHandler(res, 404, {
        message: "Lengkapi data dengan benar",
        data: error.message,
      });
    }

    let data;
    // check if file exist
    if (req.file) {
      await CertificationsModel.update(
        {
          user_id,
          title,
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
          title,
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

    return responseHandler(res, 200, {
      message: "Success update certificate",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, {
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
      return responseHandler(res, 404, {
        message: "Certificate not found",
      });
    }

    fs.unlinkSync("public/uploads/certificates/" + data.file_path);

    await CertificationsModel.destroy({
      where: { id: req.params.id },
    });

    responseHandler(res, 200, {
      message: "Success delete certificate",
    });
  } catch (error) {
    responseHandler(res, 500, {
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
};
