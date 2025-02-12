const { UsersModel } = require("../model/index");
const Joi = require("joi");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { globals } = require("../config/config");
const responseHandler = require("../helpers/responseHandler");

const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const schema = Joi.object({
      username: Joi.string().required().min(4).alphanum(),
      password: Joi.string().required(),
      confirmPassword: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.only": "Kata santi tidak sama",
          "string.empty": "Konfirmasi kata sandi anda",
        }),
    }).with("password", "confirmPassword");

    const { error } = schema.validate(req.body);

    if (error) {
      return responseHandler(res, 400, {
        message: error.message,
      });
    }

    let data;
    // check if username exist in users table
    data = await UsersModel.findAll({
      where: { username: username },
    });

    if (data.length !== 0) {
      return responseHandler(res, 400, {
        message: "Username sudah ada, silahkan gunakan username lain",
      });
    }

    // encrypt password
    const encryptedPassword = await argon2.hash(password);

    // create user
    await UsersModel.create(
      {
        username: username,
        password: encryptedPassword,
        role: "user",
        verified: false,
      },
      {
        fields: ["username", "role", "verified", "password"],
      }
    );

    responseHandler(res, 201, {
      message:
        "Pendaftaran Berhasil, silahkan hubungi administrator untuk mengverifikasi data anda",
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: "Internal server error",
      data: error.message,
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
      return responseHandler(res, 401, {
        message: "Username salah",
      });
    }

    // check if user verified
    if (data[0].dataValues.verified === false) {
      return responseHandler(res, 401, {
        message: "Hubungi admin untuk mengverifikasi akun anda",
      });
    }

    // check if password match
    const match = await argon2.verify(data[0].dataValues.password, password);
    if (!match) {
      return responseHandler(res, 401, {
        message: "Password salah",
      });
    }

    if (data[0].dataValues.verified === false) {
      return responseHandler(res, 401, {
        message: "Hubungi admin untuk mengverifikasi akun anda",
      });
    }

    // generate token
    const userId = data[0].dataValues.id;
    const newUsername = data[0].dataValues.username;
    const role = data[0].dataValues.role;

    const token = jwt.sign(
      {
        userId: userId,
        username: newUsername,
        role: role,
      },
      globals.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    await UsersModel.update({ token: token }, { where: { id: userId } });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    responseHandler(res, 200, {
      message: "Berhasil",
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

const logout = async function (req, res) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return responseHandler(res, 401, {
        message: "Operation failed, invalid authorization",
      });
    }

    const data = await UsersModel.findAll({
      where: { token: token },
    });

    if (data.length === 0) {
      return responseHandler(res, 401, {
        message: "Something went wrong, please login again",
      });
    }

    await UsersModel.update(
      { token: null },
      { where: { id: data[0].dataValues.id } }
    );
    res.clearCookie("token");

    responseHandler(res, 200, {
      message: "Berhasil keluar",
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

const verifyUser = async function (req, res) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return responseHandler(res, 401, {
        message: "Operation failed, invalid authorization!",
      });
    }

    const data = await UsersModel.findAll({
      where: { token: token },
    });

    if (data.length === 0) {
      return responseHandler(res, 401, {
        message: "Something went wrong, please login again",
      });
    }

    jwt.verify(token, globals.ACCESS_TOKEN_SECRET, function (err) {
      if (err)
        return responseHandler(res, 401, {
          message: "Invalid authorization",
        });

      responseHandler(res, 200, {
        message: "User verified",
        data: {
          userId: data[0].dataValues.id,
          username: data[0].dataValues.username,
          role: data[0].dataValues.role,
          avatarImg: data[0].dataValues.avatarImg,
        },
      });
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

module.exports = {
  signup,
  login,
  logout,
  verifyUser,
};
