const express = require("express");

// controller decree category
const {
  getAllDecreeCategory,
  getDecreeCategoryById,
  createDecreeCategory,
  updateDecreeCategoryById,
  deleteDecreeCategory,
} = require("../controllers/DecreeCategoryController.js");

const {
  adminRoleMiddleware,
  authMiddleware,
} = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", authMiddleware, adminRoleMiddleware, getAllDecreeCategory);
router.get("/:id", authMiddleware, adminRoleMiddleware, getDecreeCategoryById);
router.post("/", authMiddleware, adminRoleMiddleware, createDecreeCategory);
router.put(
  "/:id",
  authMiddleware,
  adminRoleMiddleware,
  updateDecreeCategoryById
);
router.delete(
  "/:id",
  authMiddleware,
  adminRoleMiddleware,
  deleteDecreeCategory
);

module.exports = router;
