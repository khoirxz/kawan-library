const express = require("express");

// controllers user data
const {
  fetchById,
  create,
  update,
} = require("../../controllers/user/UserContactController.js");
const { authMiddleware } = require("../../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", authMiddleware, fetchById);
router.post("/", authMiddleware, create);
router.put("/", authMiddleware, update);

module.exports = router;
