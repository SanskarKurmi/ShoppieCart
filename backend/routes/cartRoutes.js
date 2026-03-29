const express = require("express");
const router = express.Router();
const controller = require("../controllers/cartController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, controller.getMyCart);
router.post("/items", verifyToken, controller.addToCart);
router.patch("/items/:product_id", verifyToken, controller.updateQuantity);
router.delete("/items/:product_id", verifyToken, controller.removeItem);

module.exports = router;

