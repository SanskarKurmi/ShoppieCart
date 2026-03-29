const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

// PUBLIC
router.get("/", controller.getProducts);
router.get("/:id", controller.getProductById);

// ADMIN
router.post("/", verifyToken, requireAdmin, controller.createProduct);
router.put("/:id", verifyToken, requireAdmin, controller.updateProduct);
router.patch(
  "/:id/deactivate",
  verifyToken,
  requireAdmin,
  controller.deactivateProduct,
);
router.patch(
  "/:id/reactivate",
  verifyToken,
  requireAdmin,
  controller.reactivateProduct,
);

module.exports = router;
