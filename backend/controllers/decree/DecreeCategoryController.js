const Op = require("sequelize").Op;
const { DecreeCategoryModel } = require("../../model/index");
const responseHandler = require("../../helpers/responseHandler");
const { Paginate } = require("../../helpers/paginationHandler");

const fetchAll = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const { data, pagination } = await Paginate(DecreeCategoryModel, {
      Op,
      search,
      where: "title",
      page,
      limit,
      order: [["createdAt", "DESC"]],
    });

    responseHandler(res, 200, {
      message: "Success get all decree category",
      data,
      pagination,
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

const fetchById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await DecreeCategoryModel.findByPk(id);

    responseHandler(res, 200, {
      message: "Success get decree category",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

const create = async (req, res) => {
  const { title, description, isPublic } = req.body;

  try {
    // check if decree category already exist
    const oldData = await DecreeCategoryModel.findAll({
      where: { title: title },
    });

    if (oldData.length > 0) {
      return responseHandler(res, 400, {
        message: "Decree category already exist",
      });
    }

    // save
    const data = await DecreeCategoryModel.create({
      title,
      description,
      isPublic,
    });

    responseHandler(res, 200, {
      message: "Success create decree category",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { title, description, isPublic } = req.body;

  try {
    // cek title

    const oldData = await DecreeCategoryModel.findAll({
      where: { title: title, id: { [Op.ne]: id } },
    });

    if (oldData.length > 0) {
      return responseHandler(res, 400, {
        message: "Nama sudah ada, silahkan coba lagi",
      });
    }

    const result = await DecreeCategoryModel.update(
      { title, description, isPublic },
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

const destroy = async (req, res) => {
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
  fetchAll,
  fetchById,
  create,
  update,
  destroy,
};
