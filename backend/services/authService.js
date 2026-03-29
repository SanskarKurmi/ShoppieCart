const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser({ name, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES (?, ?, ?)
  `;

  const [result] = await pool.execute(query, [name, email, hashedPassword]);

  return result.insertId;
}

async function findUserByEmail(email) {
  if (!email) return null;

  const query = `
    SELECT user_id, email, password_hash, role
    FROM users
    WHERE email = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute(query, [email]);
  return rows[0] || null;
}

function generateToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
}

module.exports = {
  registerUser,
  findUserByEmail,
  generateToken,
};
