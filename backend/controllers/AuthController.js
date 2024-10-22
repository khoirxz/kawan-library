var UsersModel = require("../model/UsersModel");
var Joi = require("joi");
var argon2 = require("argon2");
var jwt = require("jsonwebtoken");

var signup = async function (req, res) {
  try {
    var { name, username, password } = req.body;
    var schema = Joi.object({
      name: Joi.string().required().min(3),
      username: Joi.string().required().min(4).alphanum(),
      password: Joi.string().required(),
      confirmPassword: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.only": "Passwords do not match",
          "string.empty": "Please confirm your password",
        }),
    }).with("password", "confirmPassword");

    var { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: error.message,
      });
    }

    // check if username exist in users table
    var data = await UsersModel.findAll({
      where: { username: username },
    });

    if (data.length !== 0) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Username already exist",
      });
    }

    // encrypt password
    password = await argon2.hash(password);

    // create user
    data = await UsersModel.create(
      {
        name: name,
        username: username,
        password: password,
        role: "admin",
        verified: false,
      },
      {
        fields: ["name", "username", "role"],
      }
    );
    res.status(201).json({
      code: 201,
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

var login = async function (req, res) {
  try {
    var { username, password } = req.body;
    var schema = Joi.object({
      username: Joi.string().required().min(4).alphanum(),
      password: Joi.string().required(),
    });

    var { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: error.message,
      });
    }

    // check if username exist in users table
    var data = await UsersModel.findAll({
      where: { username: username },
    });

    if (data.length === 0) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Incorrect username or password",
      });
    }

    // check if password match
    var match = await argon2.verify(data[0].dataValues.password, password);
    if (!match) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Incorrect password",
      });
    }

    // generate token
    var userId = data[0].dataValues.id;
    var name = data[0].dataValues.name;
    var username = data[0].dataValues.username;
    var role = data[0].dataValues.role;
    var accessToken = jwt.sign(
      {
        userId: userId,
        name: name,
        username: username,
        role: role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    var refreshToken = jwt.sign(
      {
        userId: userId,
        name: name,
        username: username,
        role: role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    await UsersModel.update(
      { refreshToken: refreshToken },
      { where: { id: userId } }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "None",
    });

    res.status(200).json({
      code: 200,
      status: "success",
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

var logout = async function (req, res) {
  try {
    var refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Operation failed, invalid authorization",
      });
    }

    var data = await UsersModel.findAll({
      where: { refreshToken: refreshToken },
    });

    if (data.length === 0) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Invalid refresh token",
      });
    }

    await UsersModel.update(
      { refreshToken: null },
      { where: { id: data[0].dataValues.id } }
    );
    res.clearCookie("refreshToken");

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Logout success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

var verifyUser = async function (req, res) {
  try {
    var refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Operation failed, invalid authorization",
      });
    }

    var data = await UsersModel.findAll({
      where: { refreshToken: refreshToken },
    });

    if (data.length === 0) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Something went wrong, please login again",
      });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      function (err, decoded) {
        if (err) return res.status(401).json({ code: 401, status: "failed" });

        var accessToken = jwt.sign(
          {
            userId: data[0].dataValues.id,
            name: data[0].dataValues.name,
            username: data[0].dataValues.username,
            role: data[0].dataValues.role,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15s" }
        );

        res.status(200).json({
          code: 200,
          status: "success",
          data: {
            userId: data[0].dataValues.id,
            name: data[0].dataValues.name,
            username: data[0].dataValues.username,
            role: data[0].dataValues.role,
            token: accessToken,
          },
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
  logout,
  verifyUser,
};
