const express = require("express");
const cors = require("cors");

const app = express();
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const cartRoutes = require("./routes/cartRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const responseMiddleware = require("./middleware/responseMiddleware");

// middlewares
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://shoppiecart.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use(responseMiddleware);

// health check route
app.get("/api/health", (req, res) => {
  res.success({ message: "API is running" });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/cart", cartRoutes);

app.use((req, res) => {
  res.fail("Route not found", 404);
});

app.use(errorMiddleware);

module.exports = app;