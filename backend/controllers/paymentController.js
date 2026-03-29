const paymentService = require("../services/paymentService");

const isValidId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

exports.createPayment = async (req, res, next) => {
  try {
    const { order_id, payment_method, transaction_ref } = req.body;

    const orderId = Number(order_id);

    if (!isValidId(orderId)) {
      return res.fail("Invalid order_id", 400);
    }

    const result = await paymentService.createPaymentAndMarkPaid({
      order_id: orderId,
      user: req.user,
      payment_method,
      transaction_ref,
    });

    if (result?.error === "Order not found") {
      return res.fail(result.error, 404);
    }

    if (result?.error === "Forbidden") {
      return res.fail("Forbidden", 403);
    }

    if (result?.error === "Only pending orders can be paid") {
      return res.fail(result.error, 400);
    }

    if (result?.error === "Payment already exists for this order") {
      return res.fail(result.error, 409);
    }

    res.success(result, 201);
  } catch (err) {
    next(err);
  }
};

