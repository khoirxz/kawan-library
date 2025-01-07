const express = require("express");

const {
  fetch,
  show,
  create,
  update,
  destroy,
} = require("../controllers/OfficeController");

const {
  adminRoleMiddleware,
  authMiddleware,
} = require("../middleware/authMiddleware");

const { OfficeSchema } = require("../validation/OfficeScheme");
const { validateInput } = require("../middleware/validateMiddleware");

const router = express.Router();

router.get("/", authMiddleware, adminRoleMiddleware, fetch);
router.get("/:id", authMiddleware, adminRoleMiddleware, show);
router.post(
  "/",
  authMiddleware,
  adminRoleMiddleware,
  validateInput(OfficeSchema),
  create
);
router.put(
  "/:id",
  authMiddleware,
  adminRoleMiddleware,
  validateInput(OfficeSchema),
  update
);
router.delete("/:id", authMiddleware, adminRoleMiddleware, destroy);

module.exports = router;
