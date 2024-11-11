const jwt = require("jsonwebtoken");
const UserModel = require("../model/user/UsersModel");
const { globals } = require("../config/config");
const responseHandler = require("../helpers/responseHandler");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return responseHandler(res, 401, {
      message: "Failed to authenticate.",
    });
  }

  // check if token is valid
  jwt.verify(token, globals.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return responseHandler(res, 401, {
        message: "Failed to authenticate.",
      });
    } else {
      const user = await UserModel.findOne({
        where: { id: decoded.userId },
      });

      if (!user.dataValues.token) {
        return responseHandler(res, 401, {
          message: "Failed to authenticate.",
        });
      }

      req.decoded = decoded;
      next();
    }
  });
};

const adminRoleMiddleware = (req, res, next) => {
  if (req.decoded.role === "admin") {
    next();
  } else {
    return responseHandler(res, 403, {
      message: "Forbidden, you don't have permission",
    });
  }
};

module.exports = {
  authMiddleware,
  adminRoleMiddleware,
};
