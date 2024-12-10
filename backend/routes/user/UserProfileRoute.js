const express = require("express");
const {
  getUserProfile,
} = require("../../controllers/user/UserProfileController.js");
const { authMiddleware } = require("../../middleware/authMiddleware.js");

const router = express.Router();

router.get("/:id", authMiddleware, getUserProfile);
router.get("/", authMiddleware, getUserProfile);

module.exports = router;
