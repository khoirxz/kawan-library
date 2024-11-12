const express = require("express");
const multer = require("multer");
const Joi = require("joi");
const path = require("path");
const responseHandler = require("../../helpers/responseHandler");

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

const filterInput = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required().min(4),
    password: Joi.string().required(),
    role: Joi.string().required(),
    verified: Joi.boolean().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return responseHandler(res, 400, {
      message: error.message,
    });
  }

  next();
};

router.get("/", authMiddleware, adminRoleMiddleware, getUsers);
router.get("/:id", authMiddleware, adminRoleMiddleware, getUsersById);
router.post("/", authMiddleware, adminRoleMiddleware, filterInput, createUser);
router.put("/:id", authMiddleware, filterInput, updateUser);
router.delete("/:id", authMiddleware, adminRoleMiddleware, deleteUser);

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
