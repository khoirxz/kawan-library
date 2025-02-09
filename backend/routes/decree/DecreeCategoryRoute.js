const express = require("express");

const { DecreeCategorySchema } = require("../../validation/DecreeScheme.js");
const { validateInput } = require("../../middleware/validateMiddleware.js");

// controller decree category
const {
  fetchAll,
  fetchById,
  create,
  update,
  destroy,
} = require("../../controllers/decree/DecreeCategoryController.js");

const {
  adminRoleMiddleware,
  authMiddleware,
} = require("../../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", authMiddleware, adminRoleMiddleware, fetchAll);
router.get("/:id", authMiddleware, adminRoleMiddleware, fetchById);
router.post(
  "/",
  authMiddleware,
  adminRoleMiddleware,
  validateInput(DecreeCategorySchema),
  create
);
router.put(
  "/:id",
  authMiddleware,
  adminRoleMiddleware,
  validateInput(DecreeCategorySchema),
  update
);
router.delete("/:id", authMiddleware, adminRoleMiddleware, destroy);

module.exports = router;
