require("dotenv").config();

const bcrypt = require("bcrypt");
const pool = require("../config/db");

async function ensureUser({ name, email, password, role }) {
  const [rows] = await pool.execute(
    "SELECT user_id FROM users WHERE email = ? LIMIT 1",
    [email],
  );

  if (rows.length) return rows[0].user_id;

  const password_hash = await bcrypt.hash(password, 10);

  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password_hash, role, status)
     VALUES (?, ?, ?, ?, 1)`,
    [name, email, password_hash, role],
  );

  return result.insertId;
}

async function ensureCategory({ category_name, description, image_url }) {
  const [rows] = await pool.execute(
    "SELECT category_id FROM categories WHERE category_name = ? LIMIT 1",
    [category_name],
  );

  if (rows.length) return rows[0].category_id;

  const [result] = await pool.execute(
    `INSERT INTO categories (category_name, description, image_url, status)
     VALUES (?, ?, ?, 1)`,
    [category_name, description ?? null, image_url ?? null],
  );

  return result.insertId;
}

async function ensureProduct({
  category_id,
  product_name,
  description,
  price,
  stock,
  image_url,
}) {
  const [rows] = await pool.execute(
    `SELECT product_id FROM products
     WHERE product_name = ? AND category_id = ?
     LIMIT 1`,
    [product_name, category_id],
  );

  if (rows.length) return rows[0].product_id;

  const [result] = await pool.execute(
    `INSERT INTO products
      (category_id, product_name, description, price, stock, image_url, status)
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [
      category_id,
      product_name,
      description ?? null,
      price,
      stock ?? 0,
      image_url ?? null,
    ],
  );

  return result.insertId;
}

async function main() {
  console.log("Seeding database...");

  const adminId = await ensureUser({
    name: "Admin",
    email: "admin@shoppiecart.com",
    password: "Admin@123",
    role: "admin",
  });

  const customerId = await ensureUser({
    name: "Test Customer",
    email: "customer@shoppiecart.com",
    password: "Customer@123",
    role: "customer",
  });

  const catElectronics = await ensureCategory({
    category_name: "Electronics",
    description: "Gadgets and devices",
    image_url: null,
  });

  const catFashion = await ensureCategory({
    category_name: "Fashion",
    description: "Clothing and accessories",
    image_url: null,
  });

  const catHome = await ensureCategory({
    category_name: "Home",
    description: "Home and kitchen essentials",
    image_url: null,
  });

  await ensureProduct({
    category_id: catElectronics,
    product_name: "Wireless Headphones",
    description: "Over-ear, noise-cancelling",
    price: 1499.0,
    stock: 30,
  });

  await ensureProduct({
    category_id: catElectronics,
    product_name: "Smart Watch",
    description: "Fitness tracking with heart-rate sensor",
    price: 1999.0,
    stock: 20,
  });

  await ensureProduct({
    category_id: catElectronics,
    product_name: "Bluetooth Speaker",
    description: "Portable speaker with deep bass",
    price: 999.0,
    stock: 40,
  });

  await ensureProduct({
    category_id: catFashion,
    product_name: "Men's Sneakers",
    description: "Comfortable everyday sneakers",
    price: 1299.0,
    stock: 50,
  });

  await ensureProduct({
    category_id: catFashion,
    product_name: "Women's Handbag",
    description: "Minimal classic handbag",
    price: 1599.0,
    stock: 25,
  });

  await ensureProduct({
    category_id: catHome,
    product_name: "Non-stick Pan",
    description: "24cm non-stick frying pan",
    price: 799.0,
    stock: 60,
  });

  await ensureProduct({
    category_id: catHome,
    product_name: "Water Bottle",
    description: "1L insulated bottle",
    price: 399.0,
    stock: 100,
  });

  console.log("Seed complete.");
  console.log("Admin:", adminId, "Customer:", customerId);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await pool.end();
    } catch {
      // ignore
    }
  });

