var express = require("express");

// controllers auth
var {
  signup,
  login,
  logout,
  verifyUser,
} = require("../controllers/AuthController.js");

var router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", logout);
router.get("/verify", verifyUser);

module.exports = router;
