const fs = require("fs");
const Op = require("sequelize").Op;
const { DecreesModel } = require("../../model/index");
const responseHandler = require("../../helpers/responseHandler");

const fetchAll = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 10,
      userId = "",
      isUser = false,
    } = req.query;
    const pageNumber = parseInt(page, 10); // Ensure radix is specified
    const pageSize = parseInt(limit, 10); // Ensure radix is specified

    const whereClause = {
      attributes: [
        "id",
        "user_id",
        "title",
        "number",
        "description",
        "effective_date",
        "expired_date",
        "file_path",
        "createdAt",
        "updatedAt",
      ],
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
      order: [["createdAt", "DESC"]],
    };

    // KITA AKAN RAPIKAN NANTI YA :)
    let data;
    if (req.decoded.role === "admin") {
      data = await DecreesModel.findAndCountAll({
        ...whereClause,
        where: {
          [Op.or]: [
            userId ? { user_id: userId } : { user_id: { [Op.ne]: null } },
            isUser
              ? { "$category.isPublic$": true }
              : { "$category.isPublic$": { [Op.ne]: null } }, // Include public categories
          ],
          [Op.and]: [
            {
              [Op.or]: [
                { title: { [Op.like]: `%${search}%` } },
                { number: { [Op.like]: `%${search}%` } },
              ],
            },
          ],
        },
        include: [
          {
            association: "category",
            attributes: ["id", "isPublic", "title", "description"],
            required: false, // Tetap tampilkan meskipun kategori null
          },
          {
            association: "user",
            attributes: ["id", "role", "username", "avatarImg", "verified"],
          },
        ],
      });
    } else {
      const Id = req.decoded.userId;
      data = await DecreesModel.findAndCountAll({
        ...whereClause,
        where: {
          [Op.or]: [
            { user_id: Id },
            { "$category.isPublic$": true }, // Include public categories
          ],
          [Op.and]: [
            {
              [Op.or]: [
                { title: { [Op.like]: `%${search}%` } },
                { number: { [Op.like]: `%${search}%` } },
              ],
            },
          ],
        },
        include: [
          {
            association: "category",
            attributes: ["id", "isPublic", "title", "description"],
            required: false, // Include even if category is null
          },
        ],
      });
    }

    responseHandler(res, 200, {
      message: `Success get all decrees`,
      data: data.rows,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        totalData: data.count,
        totalPage: Math.ceil(data.count / pageSize),
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

const create = async (req, res) => {
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

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user_id,
      title,
      number,
      description,
      category_id,
      effective_date,
      expired_date,
    } = req.body;

    const oldData = await DecreesModel.findByPk(id);

    if (!oldData) {
      return responseHandler(res, 404, { message: "Decree not found" });
    }

    let data;
    // check if file exist,
    if (req.file) {
      await DecreesModel.update(
        {
          user_id: user_id || oldData.user_id,
          title,
          number,
          description,
          category_id,
          effective_date,
          expired_date,
          file_path: req.file.filename,
        },
        {
          where: { id: id },
        }
      );

      // delete old file
      fs.unlinkSync("public/uploads/decrees/" + oldData.file_path);
    } else {
      await DecreesModel.update(
        {
          user_id: user_id || oldData.user_id,
          title,
          number,
          description,
          category_id,
          effective_date,
          expired_date,
        },
        {
          where: { id: id },
        }
      );
    }

    data = await DecreesModel.findByPk(id);

    responseHandler(res, 200, {
      message: "Success update decree",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

const destroy = async (req, res) => {
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
  fetchAll,
  fetchById,
  create,
  update,
  destroy,
};
