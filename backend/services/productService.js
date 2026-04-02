const pool = require("../config/db");

// CREATE PRODUCT
async function createProduct({
  product_name,
  description,
  price,
  stock,
  image_url,
  category_id,
}) {
  const query = `
    INSERT INTO products
    (product_name, description, price, stock, image_url, category_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.execute(query, [
    product_name,
    description ?? null,
    price,
    stock ?? 0,
    image_url ?? null,
    category_id,
  ]);

  return result.insertId;
}

async function getAllProducts({
  page = 1,
  limit = 10,
  category_id,
  sort,
} = {}) {
  // normalize
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  if (!Number.isInteger(page) || page < 1) page = 1;
  if (!Number.isInteger(limit) || limit <= 0) limit = 10;
  if (limit > 100) limit = 100;

  const offset = (page - 1) * limit;

  //WHERE
  let baseWhere = `
    WHERE p.status = 1 AND c.status = 1
  `;

  const filterParams = [];

  if (category_id !== undefined && category_id !== null) {
    const catId = parseInt(category_id, 10);
    if (Number.isInteger(catId) && catId > 0) {
      baseWhere += ` AND p.category_id = ?`;
      filterParams.push(catId);
    }
  }

  //COUNT
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM products p
    JOIN categories c ON p.category_id = c.category_id
    ${baseWhere}
  `;

  const [countRows] = await pool.execute(countQuery, filterParams);
  const total = countRows[0]?.total || 0;

  //DATA
  let dataQuery = `
    SELECT 
      p.product_id,
      p.product_name,
      p.description,
      p.price,
      p.stock,
      p.image_url,
      p.category_id,
      c.category_name,
      p.created_at
    FROM products p
    JOIN categories c ON p.category_id = c.category_id
    ${baseWhere}
  `;

  // sorting
  if (sort === "price_asc") {
    dataQuery += ` ORDER BY p.price ASC`;
  } else if (sort === "price_desc") {
    dataQuery += ` ORDER BY p.price DESC`;
  } else {
    dataQuery += ` ORDER BY p.product_id DESC`;
  }

  // Use validated integers for LIMIT/OFFSET (MySQL prepared stmt can fail with ? placeholders)
  const safeLimit = Math.floor(limit);
  const safeOffset = Math.floor((page - 1) * limit);

  dataQuery += ` LIMIT ${safeLimit} OFFSET ${safeOffset}`;

  const [rows] = await pool.execute(dataQuery, filterParams);

  return {
    data: rows,
    pagination: {
      total,
      page,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  };
}

// GET PRODUCT BY ID
async function getProductById(id) {
  const query = `
    SELECT 
      p.product_id,
      p.product_name,
      p.description,
      p.price,
      p.stock,
      p.image_url,
      p.category_id,
      c.category_name,
      p.created_at,
      p.updated_at
    FROM products p
    JOIN categories c 
      ON p.category_id = c.category_id
    WHERE p.product_id = ? 
      AND p.status = 1 
      AND c.status = 1
    LIMIT 1
  `;

  const [rows] = await pool.execute(query, [id]);
  return rows[0] || null;
}

// UPDATE PRODUCT (safe full update)
async function updateProduct(id, data) {
  const query = `
    UPDATE products
    SET
      product_name = ?,
      description = ?,
      price = ?,
      stock = ?,
      image_url = ?,
      category_id = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE product_id = ? AND status = 1
  `;

  const [result] = await pool.execute(query, [
    data.product_name,
    data.description ?? null,
    data.price,
    data.stock,
    data.image_url ?? null,
    data.category_id,
    id,
  ]);

  return result.affectedRows;
}

// SOFT DELETE
async function deactivateProduct(id) {
  const query = `
    UPDATE products
    SET status = 0
    WHERE product_id = ?
  `;

  const [result] = await pool.execute(query, [id]);
  return result.affectedRows;
}

// REACTIVATE PRODUCT
async function reactivateProduct(id) {
  const query = `
    UPDATE products
    SET status = 1
    WHERE product_id = ?
  `;

  const [result] = await pool.execute(query, [id]);
  return result.affectedRows;
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deactivateProduct,
  reactivateProduct,
};
