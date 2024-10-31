const express = require("express");

// controllers job history
const {
  getUserJobHistory,
  getUserJobHistoryById,
  createUserJobHistory,
  updateUserJobHistory,
  deleteUserJobHistory,
} = require("../controllers/JobHistoryController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", authMiddleware, getUserJobHistory);
router.get("/:id", authMiddleware, getUserJobHistory);
router.get("/id/:id", authMiddleware, getUserJobHistoryById);
router.post("/", authMiddleware, createUserJobHistory);
router.put("/:id", authMiddleware, updateUserJobHistory);
router.delete("/:id", authMiddleware, deleteUserJobHistory);

module.exports = router;
