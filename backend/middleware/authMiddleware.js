const jwt = require("jsonwebtoken");
const UserModel = require("../model/UsersModel");
const { globals } = require("../config/config");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "Please login first.",
    });
  }
  // check if token is valid
  jwt.verify(token, globals.ACCESS_TOKEN_SECRET, async function (err, decoded) {
    if (err) {
      return res.status(401).json({
        status: "failed",
        message: "Failed to authenticate.",
      });
    } else {
      const user = await UserModel.findOne({
        where: { id: decoded.userId },
      });

      if (!user.dataValues.refreshToken) {
        return res.status(401).json({
          status: "failed",
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
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized access.",
    });
  }
};

module.exports = {
  authMiddleware,
  adminRoleMiddleware,
};
