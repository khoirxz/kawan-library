var Joi = require("joi");
var argon2 = require("argon2");
var fs = require("fs");
var UsersModel = require("../model/UsersModel");

var getUsers = async function (req, res) {
  try {
    var data = await UsersModel.findAll({
      attributes: ["id", "name", "role", "username", "avatarImg", "phone"],
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

var getUsersById = async function (req, res) {
  try {
    var data = await UsersModel.findAll({
      where: { id: req.params.id },
      attributes: ["id", "name", "role", "username", "avatarImg", "phone"],
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

var createUser = async function (req, res) {
  try {
    var { name, username, phone, password, role } = req.body;

    var schema = Joi.object({
      name: Joi.string().required().min(3),
      username: Joi.string().required().min(4),
      phone: Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.string().required(),
    });

    var { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: error.message,
      });
    }

    // encrypt password
    password = await argon2.hash(password);

    // check if username exist
    var data = await UsersModel.findAll({
      where: { username: username },
    });
    if (data.length > 0) {
      return res.status(409).json({
        code: 409,
        status: "failed",
        message: "Username already exist",
      });
    }

    data = await UsersModel.create({
      name: name,
      username: username,
      phone: phone,
      password: password,
      role: role,
      verified: true,
    });

    res.status(201).json({
      code: 201,
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

var updateUser = async function (req, res) {
  try {
    var { name, username, role, phone, password } = req.body;

    // check if user exist
    var data = await UsersModel.findAll({
      where: { id: req.params.id },
    });
    if (data.length == 0) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        message: "User not found",
      });
    }

    var schema = Joi.object({
      name: Joi.string().min(3),
      username: Joi.string().min(4),
      phone: Joi.string(),
      password: Joi.string(),
      role: Joi.string().required(),
    });
    var { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: error.message,
      });
    }

    // encrypt password
    if (password) {
      password = await argon2.hash(password);
    }

    // update user
    await UsersModel.update(
      {
        name: name,
        username: username,
        role: role,
        phone: phone,
        password: password,
      },
      {
        where: { id: req.params.id },
      }
    );

    data = await UsersModel.findAll({
      where: { id: req.params.id },
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

var deleteUser = async function (req, res) {
  try {
    // check if user exist
    var data = await UsersModel.findAll({
      where: { id: req.params.id },
    });

    if (data.length == 0) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        message: "User not found",
      });
    }

    // delete user
    data = await UsersModel.destroy({
      where: { id: req.params.id },
    });
    res.status(204).json({
      code: 204,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// upload avatar
var uploadAvatar = async function (req, res) {
  try {
    // debug
    // console.log(req.file); <- success catch file

    // check if user available
    var data = await UsersModel.findAll({
      where: { id: req.params.id },
    });
    if (data.length == 0) {
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
    if (data[0].avatarImg) {
      fs.unlinkSync("public/uploads/avatars/" + data[0].avatarImg);
    }

    // update avatar
    data = await UsersModel.update(
      { avatarImg: req.file.filename },
      { where: { id: req.params.id } }
    );

    res.status(200).json({
      code: 200,
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get avatar by id
var getAvatarById = async function (req, res) {
  try {
    var data = await UsersModel.findAll({
      where: { id: req.params.id },
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

// delete avatar
var deleteAvatar = async function (req, res) {
  try {
    var data = await UsersModel.update(
      { avatarImg: null },
      { where: { id: req.params.id } }
    );
    res.status(200).json({
      code: 200,
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
