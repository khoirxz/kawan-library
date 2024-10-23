var express = require("express");

// controllers user data
var {
  getUserDataById,
  createUserData,
  updateUserData,
} = require("../controllers/UserDataController.js");
var { authMiddleware } = require("../middleware/authMiddleware.js");

var router = express.Router();

router.get("/:id", authMiddleware, getUserDataById);
router.post("/", authMiddleware, createUserData);
router.put("/", authMiddleware, updateUserData);

module.exports = router;
