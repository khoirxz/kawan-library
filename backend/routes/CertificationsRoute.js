var express = require("express");
var multer = require("multer");
var path = require("path");

// controllers certifications
var {
  getCertificationsByIdUser,
  getCertificateById,
  createCertificate,
  updateCertificateById,
  deleteCertificateById,
} = require("../controllers/CertificationsController.js");
var {
  authMiddleware,
  adminRoleMiddleware,
} = require("../middleware/authMiddleware.js");

var router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/certificates");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 2000000,
  },
});

router.get("/user/:id", authMiddleware, getCertificationsByIdUser);
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
