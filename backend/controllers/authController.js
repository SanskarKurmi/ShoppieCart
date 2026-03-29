const bcrypt = require("bcrypt");
const authService = require("../services/authService");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 6) {
      return res.fail("Invalid input", 400);
    }

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res.fail("Email already exists", 409);
    }

    const userId = await authService.registerUser({
      name,
      email,
      password,
    });

    res.success({ message: "User registered successfully", user_id: userId }, 201);
  } catch (err) {
    console.error(err);
    res.fail("Server error", 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.fail("Email and password are required", 400);
    }

    const user = await authService.findUserByEmail(email);

    if (!user) {
      return res.fail("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.fail("Invalid credentials", 401);
    }

    const token = authService.generateToken(user);

    res.success({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.fail("Server error", 500);
  }
};
