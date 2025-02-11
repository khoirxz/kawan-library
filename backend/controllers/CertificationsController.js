const fs = require("fs");
const Op = require("sequelize").Op;
const { CertificationsModel } = require("../model/index");
const responseHandler = require("../helpers/responseHandler");

const fetchAll = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, userId = "" } = req.query;
    const pageNumber = parseInt(page, 10); // Ensure radix is specified
    const pageSize = parseInt(limit, 10); // Ensure radix is specified

    const whereClause = {
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      },
      limit: pageSize,
      offet: (pageNumber - 1) * pageSize,
      order: [["createdAt", "DESC"]],
      include: [
        {
          association: "user",
          attributes: {
            exclude: ["password", "token", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: { exclude: ["user_id"] },
    };

    let data;
    if (req.decoded.role === "admin") {
      // check if user_id exist
      if (userId) {
        whereClause.where.user_id = userId || null;
      }

      data = await CertificationsModel.findAndCountAll({
        ...whereClause,
      });
    } else {
      data = await CertificationsModel.findAndCountAll({
        ...whereClause,
        where: {
          user_id: req.decoded.userId,
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
          ],
        },
      });
    }

    responseHandler(res, 200, {
      message: "Success get all certificates",
      data: data.rows,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        totalPage: Math.ceil(data.count / pageSize),
        totalData: data.count,
      },
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const fetchById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await CertificationsModel.findByPk(id, {
      attributes: { exclude: ["user_id"] },
      include: [
        {
          association: "user",
          attributes: { exclude: ["password", "token", "verified"] },
        },
      ],
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

const create = async (req, res) => {
  try {
    const { user_id, title, description, date } = req.body;

    if (!req.file) {
      return responseHandler(res, 400, {
        message: "File is required",
      });
    }

    const data = await CertificationsModel.create({
      user_id: user_id || null,
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

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, title, description, date } = req.body;

    const oldData = await CertificationsModel.findByPk(id);

    if (!oldData) {
      return responseHandler(res, 404, {
        message: "Certificate not found",
      });
    }

    let data;
    // check if file exist
    if (req.file) {
      await CertificationsModel.update(
        {
          user_id: user_id || oldData.user_id,
          title,
          description,
          date,
          file_path: req.file.filename,
        },
        {
          where: { id: id },
        }
      );

      fs.unlinkSync("public/uploads/certificates/" + oldData.file_path);
    } else {
      data = await CertificationsModel.update(
        {
          user_id: user_id || oldData.user_id,
          title,
          description,
          date,
        },
        {
          where: { id: id },
        }
      );
    }

    data = await CertificationsModel.findOne({
      where: { id: id },
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

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await CertificationsModel.findByPk(id);

    if (!data) {
      return responseHandler(res, 404, {
        message: "Certificate not found",
      });
    }

    fs.unlinkSync("public/uploads/certificates/" + data.file_path);

    await CertificationsModel.destroy({
      where: { id: id },
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
  fetchAll,
  fetchById,
  create,
  update,
  destroy,
};
