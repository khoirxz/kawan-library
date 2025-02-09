const argon2 = require("argon2");
const fs = require("fs");
const Op = require("sequelize").Op;
const { UsersModel } = require("../../model/index");
const responseHandler = require("../../helpers/responseHandler");
const { Paginate } = require("../../helpers/paginationHandler");

const fetchAll = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const { data, pagination } = await Paginate(UsersModel, {
      attributes: [
        "id",
        "role",
        "username",
        "avatarImg",
        "verified",
        "createdAt",
        "updatedAt",
      ],
      Op,
      search,
      where: "username",
      page,
      limit,
      order: [["createdAt", "DESC"]],
    });

    responseHandler(res, 200, {
      message: "Success get all users",
      data,
      pagination,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const fetchById = async (req, res) => {
  try {
    const data = await UsersModel.findByPk(req.params.id, {
      attributes: ["id", "role", "username", "avatarImg", "verified"],
    });

    responseHandler(res, 200, {
      message: "Success get all users",
      data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const { username, password, role, verified } = req.body;

    // encrypt password
    const encryptedPassword = await argon2.hash(password);

    // check if username exist
    const oldData = await UsersModel.findAll({
      where: { username: username },
    });

    if (oldData.length > 0) {
      return responseHandler(res, 400, {
        message: "Username already exist",
      });
    }

    const data = await UsersModel.create({
      username: username,
      password: encryptedPassword,
      role: role,
      verified: verified,
    });

    responseHandler(res, 201, {
      message: "Success create user",
      data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const { username, role, password = "", verified } = req.body;
    const { id } = req.params;
    // check if user exist
    const oldData = await UsersModel.findByPk(id);

    if (oldData === null) {
      return responseHandler(res, 404, {
        message: "User not found",
      });
    }

    // check if username exist
    if (username) {
      const userexist = await UsersModel.findAll({
        where: { username: username },
      });
      if (userexist.length > 0) {
        // check if user.id not equal to req.params.id
        if (userexist[0].id != req.params.id) {
          return responseHandler(res, 400, {
            message: "Username already exist",
          });
        }
      }
    }

    let newPassword;
    if (password === "") {
      newPassword = oldData.password;
    } else if (password) {
      newPassword = await argon2.hash(password);
    }

    if (req.decoded.role === "admin" || req.decoded.id == req.params.id) {
      // update user
      await UsersModel.update(
        {
          username: username,
          role: role,
          password: newPassword,
          verified: verified,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else {
      return responseHandler(res, 403, {
        message: "You don't have permission to update this user",
      });
    }

    const data = await UsersModel.findByPk(req.params.id, {
      attributes: ["id", "role", "username", "avatarImg", "verified"],
    });

    responseHandler(res, 200, {
      message: "Success update user",
      data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

const destroy = async (req, res) => {
  try {
    // check if user exist
    const oldData = await UsersModel.findByPk({
      where: { id: req.params.id },
    });

    if (oldData.length == 0) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        message: "User not found",
      });
    }

    // delete user
    const data = await UsersModel.destroy({
      where: { id: req.params.id },
    });

    responseHandler(res, 200, {
      message: "Success delete user",
      data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

// upload avatar
const uploadAvatar = async (req, res) => {
  try {
    // debug
    // console.log(req.file); <- success catch file
    // check if user available
    const oldData = await UsersModel.findAll({
      where: { id: req.params.id },
    });

    if (oldData.length == 0) {
      fs.unlinkSync("public/uploads/avatars/" + req.file.filename);
      return res.status(404).json({
        code: 404,
        status: "failed",
        message: "User not found",
      });
    }

    // check if file exist
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: "Image required",
      });
    }

    //  if old avatar exist
    if (oldData[0].avatarImg) {
      fs.unlinkSync("public/uploads/avatars/" + oldData[0].avatarImg);
    }

    // update avatar
    const data = await UsersModel.update(
      { avatarImg: req.file.filename },
      { where: { id: req.params.id } }
    );

    responseHandler(res, 200, {
      message: "Success upload avatar",
      data,
    });
  } catch (error) {
    fs.unlinkSync("public/uploads/avatars/" + req.file.filename);
    res.status(500).json({ message: error.message });
  }
};

// get avatar by id
const getAvatarById = async (req, res) => {
  try {
    const data = await UsersModel.findAll({
      where: { id: req.params.id },
      attributes: ["avatarImg"],
    });
    responseHandler(res, 200, {
      message: "Success get avatar",
      data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

// delete avatar
const deleteAvatar = async (req, res) => {
  try {
    const data = await UsersModel.update(
      { avatarImg: null },
      { where: { id: req.params.id } }
    );

    responseHandler(res, 200, {
      message: "Success delete avatar",
      data,
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
  uploadAvatar,
  getAvatarById,
  deleteAvatar,
};
