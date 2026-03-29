const pool = require("../config/db");

async function createPaymentAndMarkPaid({
  order_id,
  user,
  payment_method,
  transaction_ref,
}) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [orders] = await connection.execute(
      `SELECT order_id, user_id, order_status
       FROM orders
       WHERE order_id = ?
       FOR UPDATE`,
      [order_id],
    );

    if (!orders.length) {
      await connection.rollback();
      return { error: "Order not found" };
    }

    const order = orders[0];

    if (user.role !== "admin" && order.user_id !== user.user_id) {
      await connection.rollback();
      return { error: "Forbidden" };
    }

    if (order.order_status !== "pending") {
      await connection.rollback();
      return { error: "Only pending orders can be paid" };
    }

    // payments.order_id is UNIQUE, so duplicate pays will error (idempotency guard)
    const [paymentResult] = await connection.execute(
      `INSERT INTO payments
        (order_id, payment_method, payment_status, transaction_ref, paid_at)
       VALUES (?, ?, 'success', ?, NOW())`,
      [
        order_id,
        payment_method ?? null,
        transaction_ref ?? null,
      ],
    );

    const [updateResult] = await connection.execute(
      `UPDATE orders
       SET order_status = 'paid'
       WHERE order_id = ?`,
      [order_id],
    );

    await connection.commit();

    return {
      payment_id: paymentResult.insertId,
      order_id,
      order_status: "paid",
      updated: updateResult.affectedRows,
    };
  } catch (err) {
    await connection.rollback();

    if (err?.code === "ER_DUP_ENTRY") {
      return { error: "Payment already exists for this order" };
    }

    throw err;
  } finally {
    connection.release();
  }
}

module.exports = {
  createPaymentAndMarkPaid,
};
