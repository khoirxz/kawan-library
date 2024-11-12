const express = require("express");
const multer = require("multer");
const path = require("path");

// controllers decrees
const {
  getAllDecrees,
  getDecreeById,
  createDecree,
  updateDecreeById,
  deleteDecreeById,
  searchDecrees,
} = require("../controllers/DecreesController.js");
const {
  authMiddleware,
  adminRoleMiddleware,
} = require("../middleware/authMiddleware.js");

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

router.get("/search/:id", authMiddleware, searchDecrees);

router.get("/", authMiddleware, getAllDecrees);
router.get("/:id", authMiddleware, getDecreeById);
router.post(
  "/",
  authMiddleware,
  adminRoleMiddleware,
  upload.single("decreeFile"),
  createDecree
);
router.put(
  "/:id",
  authMiddleware,
  adminRoleMiddleware,
  upload.single("decreeFile"),
  updateDecreeById
);
router.delete("/:id", authMiddleware, adminRoleMiddleware, deleteDecreeById);

module.exports = router;
