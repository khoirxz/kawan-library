const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  createUserSchema,
  updateUserSchema,
} = require("../../validation/UsersScheme");
const { validateInput } = require("../../middleware/validateMiddleware");

// controllers user
const {
  fetchAll,
  fetchById,
  create,
  update,
  destroy,
  uploadAvatar,
  getAvatarById,
  deleteAvatar,
} = require("../../controllers/user/UsersController.js");
const {
  authMiddleware,
  adminRoleMiddleware,
} = require("../../middleware/authMiddleware.js");

const router = express.Router();

const storage = multer.diskStorage({
  mimeTypes: ["image/png", "image/jpg", "image/jpeg"],
  destination: function (req, file, cb) {
    cb(null, "public/uploads/avatars");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 8000000 } });

router.get("/", authMiddleware, adminRoleMiddleware, fetchAll);
router.get("/:id", authMiddleware, adminRoleMiddleware, fetchById);
router.post(
  "/",
  authMiddleware,
  adminRoleMiddleware,
  validateInput(createUserSchema),
  create
);
router.put("/:id", authMiddleware, validateInput(updateUserSchema), update);
router.delete("/:id", authMiddleware, adminRoleMiddleware, destroy);

// upload avatar
router.post(
  "/avatar/:id",
  authMiddleware,
  upload.single("avatar"),
  uploadAvatar
);
router.get("/avatar/:id", authMiddleware, getAvatarById);
router.delete("/avatar/:id", authMiddleware, deleteAvatar);

module.exports = router;
