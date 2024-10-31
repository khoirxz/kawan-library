const express = require("express");

// controllers user data
const {
  getUserDataById,
  createUserData,
  updateUserData,
} = require("../controllers/UserDataController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/:id", authMiddleware, getUserDataById);
router.post("/", authMiddleware, createUserData);
router.put("/", authMiddleware, updateUserData);

module.exports = router;
