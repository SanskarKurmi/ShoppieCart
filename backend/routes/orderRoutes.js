const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

// Customer actions
router.post("/", verifyToken, orderController.createOrder);
router.get("/my", verifyToken, orderController.getMyOrders);
router.get("/:id", verifyToken, orderController.getOrderById);
router.patch("/:id/cancel", verifyToken, orderController.cancelOrder);

// Admin only
router.get("/", verifyToken, requireAdmin, orderController.getAllOrders);
router.patch(
  "/:id/status",
  verifyToken,
  requireAdmin,
  orderController.updateOrderStatus,
);

module.exports = router;