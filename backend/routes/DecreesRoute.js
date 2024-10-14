var express = require("express");
var multer = require("multer");
var path = require("path");

// controllers decrees
var {
  getAllDecreesByIdUser,
  getDecreeById,
  createDecree,
  updateDecreeById,
  deleteDecreeById,
  searchDecrees,
} = require("../controllers/DecreesController.js");
var {
  authMiddleware,
  adminRoleMiddleware,
} = require("../middleware/authMiddleware.js");

var router = express.Router();

var storage = multer.diskStorage({
  mimeTypes: ["application/pdf"],
  destination: function (req, file, cb) {
    cb(null, "public/uploads/decrees");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage, limits: { fileSize: 2000000 } });

router.get("/search/:id", authMiddleware, searchDecrees);

router.get("/user/:id", authMiddleware, getAllDecreesByIdUser);
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
