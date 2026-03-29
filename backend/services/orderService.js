const pool = require("../config/db");

// Allowed order status transitions
// pending -> paid | cancelled
// paid    -> shipped | cancelled
// shipped -> delivered
const isValidStatusTransition = (current, next) => {
  const allowed = {
    pending: new Set(["paid", "cancelled"]),
    paid: new Set(["shipped", "cancelled"]),
    shipped: new Set(["delivered"]),
    delivered: new Set(),
    cancelled: new Set(),
  };

  const targets = allowed[current];
  return targets ? targets.has(next) : false;
};

// Create order from the user's cart, transactionally
async function createOrderFromCart(userId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [users] = await connection.execute(
      "SELECT user_id FROM users WHERE user_id = ? AND status = 1",
      [userId],
    );

    if (users.length === 0) {
      throw new Error("Invalid user");
    }

    const [carts] = await connection.execute(
      "SELECT cart_id FROM carts WHERE user_id = ? FOR UPDATE",
      [userId],
    );

    if (carts.length === 0) {
      throw new Error("Cart not found");
    }

    const cartId = carts[0].cart_id;

    const [cartItems] = await connection.execute(
      `SELECT ci.product_id, ci.quantity
       FROM cart_items ci
       WHERE ci.cart_id = ?`,
      [cartId],
    );

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    let totalAmount = 0;

    for (const item of cartItems) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error("Invalid quantity");
      }

      const [products] = await connection.execute(
        `SELECT product_id, price, stock, status 
         FROM products 
         WHERE product_id = ?
         FOR UPDATE`,
        [item.product_id],
      );

      if (!products.length) {
        throw new Error("Product not found");
      }

      const product = products[0];

      if (product.status !== 1) {
        throw new Error("Product not available");
      }

      if (product.stock < item.quantity) {
        throw new Error("Insufficient stock");
      }

      totalAmount += product.price * item.quantity;
    }

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, total_amount) 
       VALUES (?, ?)`,
      [userId, totalAmount],
    );

    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      const [products] = await connection.execute(
        `SELECT product_id, price 
         FROM products 
         WHERE product_id = ?`,
        [item.product_id],
      );

      const product = products[0];

      await connection.execute(
        `INSERT INTO order_items
           (order_id, product_id, price_at_purchase, quantity)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, product.price, item.quantity],
      );

      await connection.execute(
        `UPDATE products
         SET stock = stock - ?
         WHERE product_id = ?`,
        [item.quantity, item.product_id],
      );
    }

    await connection.execute("DELETE FROM cart_items WHERE cart_id = ?", [
      cartId,
    ]);

    await connection.commit();

    return {
      order_id: orderId,
      total_amount: totalAmount,
      order_status: "pending",
    };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function getMyOrders(user_id, limit = 10, offset = 0) {
  const safeLimit = Math.max(1, Math.floor(limit));
  const safeOffset = Math.max(0, Math.floor(offset));

  const [rows] = await pool.execute(
    `
    SELECT
      order_id,
      total_amount,
      order_status,
      created_at
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ${safeLimit} OFFSET ${safeOffset}
    `,
    [user_id],
  );

  return rows;
}

async function getAllOrders({
  limit = 10,
  offset = 0,
  status,
  sort = "desc",
} = {}) {
  const params = [];
  let where = "WHERE 1=1";

  if (status) {
    where += " AND o.order_status = ?";
    params.push(status);
  }

  const orderBy =
    sort === "asc" ? "ORDER BY o.created_at ASC" : "ORDER BY o.created_at DESC";

  const safeLimit = Math.max(1, Math.floor(limit));
  const safeOffset = Math.max(0, Math.floor(offset));

  const [rows] = await pool.execute(
    `
    SELECT
      o.order_id,
      o.user_id,
      u.name,
      u.email,
      o.total_amount,
      o.order_status,
      o.created_at
    FROM orders o
    JOIN users u ON o.user_id = u.user_id
    ${where}
    ${orderBy}
    LIMIT ${safeLimit} OFFSET ${safeOffset}
    `,
    params,
  );

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM orders o
     JOIN users u ON o.user_id = u.user_id
     ${where}`,
    params,
  );

  const total = countRows[0]?.total || 0;

  return {
    data: rows,
    pagination: {
      total,
      limit: safeLimit,
      offset: safeOffset,
      hasMore: safeOffset + safeLimit < total,
    },
  };
}

async function getOrderById(order_id) {
  const [orders] = await pool.execute(
    `
    SELECT order_id, user_id, total_amount, order_status, created_at
    FROM orders
    WHERE order_id = ?
    `,
    [order_id],
  );

  if (!orders.length) return null;

  const [items] = await pool.execute(
    `
    SELECT
      oi.order_item_id,
      oi.product_id,
      p.product_name,
      oi.price_at_purchase,
      oi.quantity
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    WHERE oi.order_id = ?
    `,
    [order_id],
  );

  return {
    ...orders[0],
    items,
  };
}

async function updateOrderStatus(order_id, nextStatus) {
  const [rows] = await pool.execute(
    `SELECT order_status FROM orders WHERE order_id = ?`,
    [order_id],
  );

  if (!rows.length) {
    return { affected: 0, error: "Order not found" };
  }

  const current = rows[0].order_status;

  if (!isValidStatusTransition(current, nextStatus)) {
    return { affected: 0, error: "Invalid status transition" };
  }

  const [result] = await pool.execute(
    `
    UPDATE orders
    SET order_status = ?
    WHERE order_id = ?
    `,
    [nextStatus, order_id],
  );

  return { affected: result.affectedRows };
}

async function cancelOrderByCustomer(order_id, user_id) {
  const [rows] = await pool.execute(
    `SELECT order_status, user_id FROM orders WHERE order_id = ?`,
    [order_id],
  );

  if (!rows.length) {
    return { affected: 0, error: "Order not found" };
  }

  const order = rows[0];

  if (order.user_id !== user_id) {
    return { affected: 0, error: "Forbidden" };
  }

  if (order.order_status !== "pending") {
    return { affected: 0, error: "Only pending orders can be cancelled" };
  }

  const [result] = await pool.execute(
    `UPDATE orders SET order_status = 'cancelled' WHERE order_id = ?`,
    [order_id],
  );

  return { affected: result.affectedRows };
}

module.exports = {
  createOrderFromCart,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrderByCustomer,
};