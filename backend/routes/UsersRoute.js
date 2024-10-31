const express = require("express");
const multer = require("multer");
const path = require("path");

// controllers user
const {
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  deleteUser,
  uploadAvatar,
  getAvatarById,
  deleteAvatar,
} = require("../controllers/UsersController.js");
const {
  authMiddleware,
  adminRoleMiddleware,
} = require("../middleware/authMiddleware.js");

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

const upload = multer({ storage: storage, limits: { fileSize: 2000000 } });

router.get("/", authMiddleware, adminRoleMiddleware, getUsers);
router.get("/:id", authMiddleware, adminRoleMiddleware, getUsersById);
router.post("/", authMiddleware, adminRoleMiddleware, createUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, adminRoleMiddleware, deleteUser);

// upload avatar
router.post(
  "/users/avatar/:id",
  authMiddleware,
  upload.single("avatar"),
  uploadAvatar
);
router.get("/users/avatar/:id", authMiddleware, getAvatarById);
router.delete("/users/avatar/:id", authMiddleware, deleteAvatar);

module.exports = router;
