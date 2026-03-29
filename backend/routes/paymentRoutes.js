const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, controller.createPayment);

module.exports = router;