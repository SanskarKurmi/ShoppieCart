const express = require("express");
const router = express.Router();
const controller = require("../controllers/categoryController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

// admin routes
router.post("/", verifyToken, requireAdmin, controller.createCategory);
router.put("/:id", verifyToken, requireAdmin, controller.updateCategory);
router.patch(
  "/:id/deactivate",
  verifyToken,
  requireAdmin,
  controller.deactivateCategory,
);
router.patch(
  "/:id/reactivate",
  verifyToken,
  requireAdmin,
  controller.reactivateCategory,
);

// protected read routes
router.get("/", verifyToken, controller.getCategories);
router.get("/:id", verifyToken, controller.getCategoryById);

module.exports = router;
