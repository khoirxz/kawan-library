const express = require("express");

const { userDataSchema } = require("../../validation/User/UserDataScheme");
const { validateInput } = require("../../middleware/validateMiddleware");

// controllers user data
const {
  getById,
  create,
  update,
} = require("../../controllers/user/UserDataController.js");
const { authMiddleware } = require("../../middleware/authMiddleware.js");

const router = express.Router();

router.get("/:id", authMiddleware, getById);
router.post("/", authMiddleware, validateInput(userDataSchema), create);
router.put("/", authMiddleware, validateInput(userDataSchema), update);

module.exports = router;
