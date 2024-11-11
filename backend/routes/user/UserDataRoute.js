const express = require("express");

// controllers user data
const {
  getById,
  create,
  update,
} = require("../../controllers/user/UserDataController.js");
const { authMiddleware } = require("../../middleware/authMiddleware.js");

const router = express.Router();

router.get("/:id", authMiddleware, getById);
router.post("/", authMiddleware, create);
router.put("/", authMiddleware, update);

module.exports = router;
