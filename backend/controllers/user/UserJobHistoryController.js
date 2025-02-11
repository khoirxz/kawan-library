const Op = require("sequelize").Op;
const JobHistoryModel = require("../../model/user/UserJobHistoryModel");
const UsersModel = require("../../model/user/UsersModel");
const responseHandler = require("../../helpers/responseHandler");

// getAllUserJobHistory is get all user job history with id user
const fetchAll = async function (req, res) {
  try {
    // user id
    const { id } = req.params;
    const { search = "", page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10); // Ensure radix is specified
    const pageSize = parseInt(limit, 10); // Ensure radix is specified

    const whereClause = {
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
      order: [["createdAt", "DESC"]],
    };

    let data;
    if (req.decoded.role === "admin") {
      data = await JobHistoryModel.findAndCountAll({
        ...whereClause,
        where: {
          [Op.or]: [{ user_id: id }],
          [Op.and]: [{ company_name: { [Op.like]: `%${search}%` } }],
        },
      });
    } else {
      data = await JobHistoryModel.findAndCountAll({
        ...whereClause,
        where: {
          [Op.or]: [{ user_id: req.decoded.userId }],
          [Op.and]: [{ company_name: { [Op.like]: `%${search}%` } }],
        },
      });
    }

    return responseHandler(res, 200, {
      message: `Success get ${
        req.decoded.role === "admin" ? "all" : req.decoded.username
      } job history`,
      data: data.rows,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        totalData: data.count,
        totalPage: Math.ceil(data.count / pageSize),
      },
    });
  } catch (error) {
    return responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const fetchAllById = async function (req, res) {
  try {
    const { id } = req.params;

    const data = await JobHistoryModel.findByPk(id);

    return responseHandler(res, 200, {
      message: "Success get user job history",
      data: data,
    });
  } catch (error) {
    return responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const create = async function (req, res) {
  try {
    const {
      user_id,
      company_name,
      position,
      start_date,
      end_date,
      job_description,
      location,
      is_current,
    } = req.body;

    // check if user exist
    const user = await UsersModel.findAll({
      where: { id: user_id },
    });

    if (user.length == 0) {
      return responseHandler(res, 404, {
        message: "User not found",
      });
    }

    let data;

    if (req.decoded.role === "admin") {
      data = await JobHistoryModel.create({
        user_id: user_id,
        company_name: company_name,
        position: position,
        start_date: start_date,
        end_date: end_date,
        job_description: job_description,
        location: location,
        is_current: is_current,
      });
    } else {
      data = await JobHistoryModel.create({
        user_id: req.decoded.userId,
        company_name: company_name,
        position: position,
        start_date: start_date,
        end_date: end_date,
        job_description: job_description,
        location: location,
        is_current: is_current,
      });
    }

    return responseHandler(res, 201, {
      message: "Success create user job history",
      data: data,
    });
  } catch (error) {
    return responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const update = async function (req, res) {
  try {
    const { id } = req.params;
    const {
      user_id,
      company_name,
      position,
      start_date,
      end_date,
      job_description,
      location,
      is_current,
    } = req.body;

    // check if user exist
    const user = await UsersModel.findByPk(user_id);

    if (!user) {
      return responseHandler(res, 404, {
        message: "User not found",
      });
    }

    let data;
    if (req.decoded.role === "admin") {
      data = await JobHistoryModel.update(
        {
          user_id: user_id,
          company_name: company_name,
          position: position,
          start_date: start_date,
          end_date: end_date,
          job_description: job_description,
          location: location,
          is_current: is_current,
        },
        {
          where: { id: id },
        }
      );
    } else {
      data = await JobHistoryModel.update(
        {
          user_id: req.decoded.userId,
          company_name: company_name,
          position: position,
          start_date: start_date,
          end_date: end_date,
          job_description: job_description,
          location: location,
          is_current: is_current,
        },
        {
          where: { id: id },
        }
      );
    }

    return responseHandler(res, 200, {
      message: "Success update user job history",
      data: data,
    });
  } catch (error) {
    return responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const destroy = async function (req, res) {
  try {
    const { id } = req.params;

    // cek jika data sudah ada
    const oldData = await JobHistoryModel.findByPk(id);

    if (!oldData) {
      return responseHandler(res, 404, {
        message: "User job history not found",
      });
    }

    let data;
    if (req.decoded.role !== "admin") {
      const userJobHistory = await JobHistoryModel.findOne({
        where: { id: id, user_id: req.decoded.userId },
      });

      if (!userJobHistory) {
        return responseHandler(res, 404, {
          message: "User job history not found",
        });
      }

      data = await JobHistoryModel.destroy({
        where: { id: id, user_id: req.decoded.userId },
      });
    } else {
      data = await JobHistoryModel.destroy({
        where: { id: id },
      });
    }

    return responseHandler(res, 200, {
      message: "Success delete user job history",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

module.exports = {
  fetchAll,
  fetchAllById,
  create,
  update,
  destroy,
};
