const Joi = require("joi");
const argon2 = require("argon2");
const fs = require("fs");
const UsersModel = require("../model/UsersModel");
const responseHandler = require("../helpers/responseHandler");

const getUsers = async (req, res) => {
  try {
    const data = await UsersModel.findAll({
      attributes: ["id", "name", "role", "username", "avatarImg"],
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

const getUsersById = async (req, res) => {
  try {
    const data = await UsersModel.findAll({
      where: { id: req.params.id },
      attributes: ["id", "name", "role", "username", "avatarImg"],
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

const createUser = async (req, res) => {
  try {
    const { name, username, password, role } = req.body;

    const schema = Joi.object({
      name: Joi.string().required().min(3),
      username: Joi.string().required().min(4),
      password: Joi.string().required(),
      role: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return responseHandler(res, 400, {
        message: error.message,
      });
    }

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
      name: name,
      username: username,
      password: encryptedPassword,
      role: role,
      verified: true,
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

const updateUser = async (req, res) => {
  try {
    const { name, username, role, password } = req.body;

    // check if user exist
    const oldData = await UsersModel.findAll({
      where: { id: req.params.id },
    });
    if (oldData.length == 0) {
      return responseHandler(res, 404, {
        message: "User not found",
      });
    }

    const schema = Joi.object({
      name: Joi.string().min(3),
      username: Joi.string().min(4),
      password: Joi.string(),
      role: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: error.message,
      });
    }

    // encrypt password
    let newPassword;
    if (password) {
      newPassword = await argon2.hash(password);
    }

    // update user
    await UsersModel.update(
      {
        name: name,
        username: username,
        role: role,
        password: newPassword,
      },
      {
        where: { id: req.params.id },
      }
    );

    const data = await UsersModel.findAll({
      where: { id: req.params.id },
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

const deleteUser = async (req, res) => {
  try {
    // check if user exist
    const oldData = await UsersModel.findAll({
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
      fs.unlinkSync("public/uploads/avatars/" + data[0].avatarImg);
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
    res.status(500).json({ message: error.message });
  }
};

// get avatar by id
const getAvatarById = async (req, res) => {
  try {
    const data = await UsersModel.findAll({
      where: { id: req.params.id },
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
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  deleteUser,
  uploadAvatar,
  getAvatarById,
  deleteAvatar,
};
