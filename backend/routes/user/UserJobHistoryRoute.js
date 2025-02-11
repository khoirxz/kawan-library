const express = require("express");
const Joi = require("joi");

// controllers job history
const {
  fetchAll,
  fetchAllById,
  create,
  update,
  destroy,
} = require("../../controllers/user/UserJobHistoryController.js");
const { authMiddleware } = require("../../middleware/authMiddleware.js");

const router = express.Router();

const filterInput = (req, res, next) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
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

router.get("/:id", authMiddleware, fetchAll);
router.get("/id/:id", authMiddleware, fetchAllById);
router.post("/", authMiddleware, filterInput, create);
router.put("/:id", authMiddleware, filterInput, update);
router.delete("/:id", authMiddleware, destroy);

module.exports = router;
