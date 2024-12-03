const express = require("express");
const multer = require("multer");
const path = require("path");

// controllers certifications
const {
  getAllCertificates,
  getCertificateById,
  createCertificate,
  updateCertificateById,
  deleteCertificateById,
  searchCertificate,
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

// routes
router.get("/search/:id", authMiddleware, searchCertificate);

router.get("/", authMiddleware, getAllCertificates);
router.get("/:id", authMiddleware, getCertificateById);
router.post(
  "/",
  authMiddleware,
  adminRoleMiddleware,
  upload.single("certificateFile"),
  createCertificate
);
router.put(
  "/:id",
  authMiddleware,
  adminRoleMiddleware,
  upload.single("certificateFile"),
  updateCertificateById
);
router.delete(
  "/:id",
  authMiddleware,
  adminRoleMiddleware,
  deleteCertificateById
);

module.exports = router;
