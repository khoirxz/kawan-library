const UsersModel = require("../model/UsersModel");
const Joi = require("joi");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { globals } = require("../config/config");

const signup = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const schema = Joi.object({
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

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: error.message,
      });
    }

    let data;
    // check if username exist in users table
    data = await UsersModel.findAll({
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
    const encryptedPassword = await argon2.hash(password);

    // create user
    data = await UsersModel.create(
      {
        name: name,
        username: username,
        password: encryptedPassword,
        role: "user",
        verified: true,
      },
      {
        fields: ["name", "username", "role", "verified", "password"],
      }
    );
    res.status(201).json({
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

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const schema = Joi.object({
      username: Joi.string().required().min(4).alphanum(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: error.message,
      });
    }

    // check if username exist in users table
    const data = await UsersModel.findAll({
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
    const match = await argon2.verify(data[0].dataValues.password, password);
    if (!match) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Incorrect password",
      });
    }

    // generate token
    const userId = data[0].dataValues.id;
    const name = data[0].dataValues.name;
    const newUsername = data[0].dataValues.username;
    const role = data[0].dataValues.role;
    const accessToken = jwt.sign(
      {
        userId: userId,
        name: name,
        username: newUsername,
        role: role,
      },
      globals.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      {
        userId: userId,
        name: name,
        username: newUsername,
        role: role,
      },
      globals.REFRESH_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    await UsersModel.update(
      { refreshToken: refreshToken },
      { where: { id: userId } }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
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

const logout = async function (req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Operation failed, invalid authorization",
      });
    }

    const data = await UsersModel.findAll({
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

const verifyUser = async function (req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Operation failed, invalid authorization",
      });
    }

    const data = await UsersModel.findAll({
      where: { refreshToken: refreshToken },
    });

    if (data.length === 0) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Something went wrong, please login again",
      });
    }

    jwt.verify(refreshToken, globals.REFRESH_TOKEN_SECRET, function (err) {
      if (err) return res.status(401).json({ code: 401, status: "failed" });

      const accessToken = jwt.sign(
        {
          userId: data[0].dataValues.id,
          name: data[0].dataValues.name,
          username: data[0].dataValues.username,
          role: data[0].dataValues.role,
        },
        globals.ACCESS_TOKEN_SECRET,
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
          avatarImg: data[0].dataValues.avatarImg,
          token: accessToken,
        },
      });
    });
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
