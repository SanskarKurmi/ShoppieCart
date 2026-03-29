const pool = require("../config/db");

// CREATE CATEGORY
async function createCategory({ category_name, description, image_url }) {
  const query = `
    INSERT INTO categories 
    (category_name, description, image_url) 
    VALUES (?, ?, ?)
  `;

  const [result] = await pool.execute(query, [
    category_name,
    description || null,
    image_url || null,
  ]);

  return result.insertId;
}

// GET ALL ACTIVE CATEGORIES
async function getAllCategories() {
  const query = `
    SELECT 
      c.category_id,
      c.category_name,
      c.description,
      c.image_url,
      c.status,
      COUNT(DISTINCT p.product_id) AS product_count,
      c.created_at,
      c.updated_at
    FROM categories c
    LEFT JOIN products p 
      ON c.category_id = p.category_id
    WHERE c.status = 1
    GROUP BY c.category_id
    ORDER BY c.category_id DESC
  `;

  const [rows] = await pool.execute(query);
  return rows;
}

// GET CATEGORY BY ID (NEW)
async function getCategoryById(id) {
  const query = `
    SELECT 
      category_id,
      category_name,
      description,
      image_url,
      status,
      created_at,
      updated_at
    FROM categories
    WHERE category_id = ? AND status = 1
    LIMIT 1
  `;

  const [rows] = await pool.execute(query, [id]);
  return rows[0] || null;
}

// UPDATE CATEGORY
async function updateCategory(id, { category_name, description, image_url }) {
  const query = `
    UPDATE categories
    SET 
      category_name = ?,
      description = ?,
      image_url = ?
    WHERE category_id = ? AND status = 1
  `;

  const [result] = await pool.execute(query, [
    category_name,
    description || null,
    image_url || null,
    id,
  ]);

  return result.affectedRows;
}

// SOFT DELETE
async function deactivateCategory(id) {
  const query = `
    UPDATE categories
    SET status = 0
    WHERE category_id = ?
  `;

  const [result] = await pool.execute(query, [id]);
  return result.affectedRows;
}

// REACTIVATE CATEGORY
async function reactivateCategory(id) {
  const query = `
    UPDATE categories
    SET status = 1
    WHERE category_id = ?
  `;

  const [result] = await pool.execute(query, [id]);
  return result.affectedRows;
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deactivateCategory,
  reactivateCategory,
};
