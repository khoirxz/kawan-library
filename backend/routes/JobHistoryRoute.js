const express = require("express");
const Joi = require("joi");

// controllers job history
const {
  getUserJobHistory,
  getUserJobHistoryById,
  createUserJobHistory,
  updateUserJobHistory,
  deleteUserJobHistory,
} = require("../controllers/JobHistoryController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");

const router = express.Router();

/**
 * Middleware to validate the input data for job history operations.
 *
 * Validates the request body against a predefined schema that includes:
 * - user_id: Required number
 * - company_name: Required string
 * - position: Required string
 * - start_date: Required date
 * - end_date: Optional date
 * - job_description: Required string
 * - location: Required string
 * - is_current: Required boolean
 *
 * If validation fails, responds with a 400 status code and error message.
 * Otherwise, proceeds to the next middleware or route handler.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const filterInput = (req, res, next) => {
  const schema = Joi.object({
    user_id: Joi.number().required(),
    company_name: Joi.string().required(),
    position: Joi.string().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().allow(null),
    job_description: Joi.string().required(),
    location: Joi.string().required(),
    is_current: Joi.boolean().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      code: 400,
      status: "failed",
      message: error.message,
    });
  }

  next();
};

router.get("/", authMiddleware, getUserJobHistory);
router.get("/:id", authMiddleware, getUserJobHistory);
router.get("/id/:id", authMiddleware, getUserJobHistoryById);
router.post("/", authMiddleware, filterInput, createUserJobHistory);
router.put("/:id", authMiddleware, filterInput, updateUserJobHistory);
router.delete("/:id", authMiddleware, deleteUserJobHistory);

module.exports = router;
