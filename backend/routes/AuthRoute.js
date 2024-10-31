const express = require("express");

// controllers auth
const {
  signup,
  login,
  logout,
  verifyUser,
} = require("../controllers/AuthController.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", logout);
router.get("/verify", verifyUser);

module.exports = router;
