var express = require("express");

// controllers job history
var {
  getUserJobHistory,
  getUserJobHistoryById,
  createUserJobHistory,
  updateUserJobHistory,
  deleteUserJobHistory,
} = require("../controllers/JobHistoryController.js");
var { authMiddleware } = require("../middleware/authMiddleware.js");

var router = express.Router();

router.get("/", authMiddleware, getUserJobHistory);
router.get("/:id", authMiddleware, getUserJobHistory);
router.get("/id/:id", authMiddleware, getUserJobHistoryById);
router.post("/", authMiddleware, createUserJobHistory);
router.put("/:id", authMiddleware, updateUserJobHistory);
router.delete("/:id", authMiddleware, deleteUserJobHistory);

module.exports = router;
