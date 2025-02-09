const express = require("express");
const multer = require("multer");
const path = require("path");

const { DecreeSchema } = require("../../validation/DecreeScheme.js");
const { validateInput } = require("../../middleware/validateMiddleware.js");

// controllers decrees
const {
  fetchAll,
  fetchById,
  create,
  update,
  destroy,
} = require("../../controllers/decree/DecreesController.js");
const {
  authMiddleware,
  adminRoleMiddleware,
} = require("../../middleware/authMiddleware.js");

const router = express.Router();

const storage = multer.diskStorage({
  mimeTypes: ["application/pdf"],
  destination: function (req, file, cb) {
    cb(null, "public/uploads/decrees");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 8000000 } });

// Example: GET /decrees?search=cert&userId=123&page=2&limit=5
router.get("/", authMiddleware, fetchAll);
router.get("/:id", authMiddleware, fetchById);
router.post(
  "/",
  authMiddleware,
  adminRoleMiddleware,
  upload.single("decreeFile"),
  validateInput(DecreeSchema),
  create
);
router.put(
  "/:id",
  authMiddleware,
  adminRoleMiddleware,
  upload.single("decreeFile"),
  validateInput(DecreeSchema),
  update
);
router.delete("/:id", authMiddleware, adminRoleMiddleware, destroy);

module.exports = router;
