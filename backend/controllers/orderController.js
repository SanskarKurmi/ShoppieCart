const orderService = require("../services/orderService");

const isValidId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const order = await orderService.createOrderFromCart(userId);

    res.success(order, 201);
  } catch (err) {
    next(err);
  }
};

// CUSTOMER — my orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;

    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (!Number.isFinite(page) || page < 1) page = 1;
    if (!Number.isFinite(limit) || limit < 1 || limit > 100) limit = 10;

    const offset = (page - 1) * limit;

    const orders = await orderService.getMyOrders(user_id, limit, offset);

    res.success(orders);
  } catch (err) {
    next(err);
  }
};

// ADMIN — all orders
exports.getAllOrders = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, status, sort } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (!Number.isFinite(page) || page < 1) page = 1;
    if (!Number.isFinite(limit) || limit < 1 || limit > 100) limit = 10;

    const offset = (page - 1) * limit;

    const result = await orderService.getAllOrders({
      limit,
      offset,
      status,
      sort,
    });

    res.success(result);
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const { user_id, role } = req.user;

    if (!Number.isInteger(orderId)) {
      return res.fail("Invalid order id", 400);
    }

    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return res.fail("Order not found", 404);
    }

    if (role !== "admin" && order.user_id !== user_id) {
      return res.fail("Forbidden", 403);
    }

    res.success(order);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.fail("Admin only", 403);
    }

    const orderId = Number(req.params.id);
    const { status } = req.body;

    if (!isValidId(orderId) || !status) {
      return res.fail("Invalid input", 400);
    }

    const { affected, error } = await orderService.updateOrderStatus(
      orderId,
      status,
    );

    if (error === "Order not found") {
      return res.fail(error, 404);
    }

    if (error === "Invalid status transition") {
      return res.fail(error, 400);
    }

    if (!affected) {
      return res.fail("Unable to update status", 400);
    }

    res.success({ message: "Order status updated" });
  } catch (err) {
    next(err);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const userId = req.user.user_id;

    if (!isValidId(orderId)) {
      return res.fail("Invalid order id", 400);
    }

    const { affected, error } = await orderService.cancelOrderByCustomer(
      orderId,
      userId,
    );

    if (error === "Order not found") {
      return res.fail(error, 404);
    }

    if (error === "Forbidden") {
      return res.fail("You cannot cancel this order", 403);
    }

    if (error === "Only pending orders can be cancelled") {
      return res.fail(error, 400);
    }

    if (!affected) {
      return res.fail("Unable to cancel order", 400);
    }

    res.success({ message: "Order cancelled successfully" });
  } catch (err) {
    next(err);
  }
};