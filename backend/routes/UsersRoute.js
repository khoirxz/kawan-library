var express = require("express");
var multer = require("multer");
var path = require("path");

// controllers user
var {
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  deleteUser,
  uploadAvatar,
  getAvatarById,
  deleteAvatar,
} = require("../controllers/UsersController.js");
var {
  authMiddleware,
  adminRoleMiddleware,
} = require("../middleware/authMiddleware.js");

var router = express.Router();

var storage = multer.diskStorage({
  mimeTypes: ["image/png", "image/jpg", "image/jpeg"],
  destination: function (req, file, cb) {
    cb(null, "public/uploads/avatars");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage, limits: { fileSize: 2000000 } });

router.get("/users", authMiddleware, adminRoleMiddleware, getUsers);
router.get("/users/:id", authMiddleware, adminRoleMiddleware, getUsersById);
router.post("/users", authMiddleware, adminRoleMiddleware, createUser);
router.put("/users/:id", authMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, adminRoleMiddleware, deleteUser);

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
