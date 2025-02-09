const express = require("express");
const multer = require("multer");
const path = require("path");

const { CertificateSchema } = require("../validation/CertificateScheme.js");
const { validateInput } = require("../middleware/validateMiddleware.js");

// controllers certifications
const {
  fetchAll,
  fetchById,
  create,
  update,
  destroy,
} = require("../controllers/CertificationsController.js");
const {
  authMiddleware,
  adminRoleMiddleware,
} = require("../middleware/authMiddleware.js");

const router = express.Router();

// configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/certificates");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 8000000,
  },
});

router.get("/", authMiddleware, fetchAll);
router.get("/id/:id", authMiddleware, fetchById);
router.post(
  "/",
  authMiddleware,
  adminRoleMiddleware,
  upload.single("certificateFile"),
  validateInput(CertificateSchema),
  create
);
router.put(
  "/:id",
  authMiddleware,
  adminRoleMiddleware,
  upload.single("certificateFile"),
  validateInput(CertificateSchema),
  update
);
router.delete("/:id", authMiddleware, adminRoleMiddleware, destroy);

module.exports = router;
