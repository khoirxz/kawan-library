const express = require("express");

// controllers user portfolio
const {
  getUserPortfolio,
} = require("../../controllers/user/UserPortfolioController.js");
const { authMiddleware } = require("../../middleware/authMiddleware.js");

const router = express.Router();

router.get("/:id", authMiddleware, getUserPortfolio);

module.exports = router;
