const pool = require("../config/db");

async function getOrCreateCartId(user_id) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      "SELECT cart_id FROM carts WHERE user_id = ? FOR UPDATE",
      [user_id],
    );

    if (rows.length) {
      await connection.commit();
      return rows[0].cart_id;
    }

    const [result] = await connection.execute(
      "INSERT INTO carts (user_id) VALUES (?)",
      [user_id],
    );

    await connection.commit();
    return result.insertId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function getMyCart(user_id) {
  const cart_id = await getOrCreateCartId(user_id);

  const [items] = await pool.execute(
    `SELECT
      ci.cart_item_id,
      ci.product_id,
      ci.quantity,
      p.product_name,
      p.price,
      p.stock,
      p.status,
      p.image_url
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.product_id
     WHERE ci.cart_id = ?
     ORDER BY ci.cart_item_id DESC`,
    [cart_id],
  );

  return { cart_id, items };
}

async function addToCart({ user_id, product_id, quantity }) {
  const cart_id = await getOrCreateCartId(user_id);

  // NOTE: stock is validated at order time (not here)
  const [productRows] = await pool.execute(
    "SELECT product_id, status FROM products WHERE product_id = ?",
    [product_id],
  );

  if (!productRows.length) return { error: "Product not found" };
  if (productRows[0].status !== 1) return { error: "Product not available" };

  // Merge duplicates via UNIQUE(cart_id, product_id)
  await pool.execute(
    `
    INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `,
    [cart_id, product_id, quantity],
  );

  return { cart_id };
}

async function updateCartItemQuantity({ user_id, product_id, quantity }) {
  const cart_id = await getOrCreateCartId(user_id);

  const [result] = await pool.execute(
    `UPDATE cart_items
     SET quantity = ?
     WHERE cart_id = ? AND product_id = ?`,
    [quantity, cart_id, product_id],
  );

  return result.affectedRows;
}

async function removeFromCart({ user_id, product_id }) {
  const cart_id = await getOrCreateCartId(user_id);

  const [result] = await pool.execute(
    `DELETE FROM cart_items
     WHERE cart_id = ? AND product_id = ?`,
    [cart_id, product_id],
  );

  return result.affectedRows;
}

module.exports = {
  getMyCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
};
