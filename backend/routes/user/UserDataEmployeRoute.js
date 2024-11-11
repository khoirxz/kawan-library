const express = require("express");

// controllers user data employe
const {
  getById,
  create,
  update,
} = require("../../controllers/user/UserDataEmployeController.js");
const {
  authMiddleware,
  adminRoleMiddleware,
} = require("../../middleware/authMiddleware.js");

const router = express.Router();

router.get("/:id", authMiddleware, getById);
router.post("/", authMiddleware, adminRoleMiddleware, create);
router.put("/", authMiddleware, adminRoleMiddleware, update);

module.exports = router;
