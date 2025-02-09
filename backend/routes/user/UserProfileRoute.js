const express = require("express");
const { fetch } = require("../../controllers/user/UserProfileController.js");
const { authMiddleware } = require("../../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", authMiddleware, fetch);

module.exports = router;
