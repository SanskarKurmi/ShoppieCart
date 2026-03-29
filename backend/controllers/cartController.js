const cartService = require("../services/cartService");

const isValidId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

exports.getMyCart = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const cart = await cartService.getMyCart(user_id);
    res.success(cart);
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const { product_id, quantity = 1 } = req.body;

    const pid = Number(product_id);
    const qty = Number(quantity);

    if (!isValidId(pid) || !Number.isInteger(qty) || qty <= 0) {
      return res.fail("Invalid input", 400);
    }

    const result = await cartService.addToCart({
      user_id,
      product_id: pid,
      quantity: qty,
    });

    if (result?.error === "Product not found") {
      return res.fail(result.error, 404);
    }

    if (result?.error === "Product not available") {
      return res.fail(result.error, 400);
    }

    res.success({ message: "Added to cart" }, 201);
  } catch (err) {
    next(err);
  }
};

exports.updateQuantity = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const { product_id } = req.params;
    const { quantity } = req.body;

    const pid = Number(product_id);
    const qty = Number(quantity);

    if (!isValidId(pid) || !Number.isInteger(qty) || qty <= 0) {
      return res.fail("Invalid input", 400);
    }

    const affected = await cartService.updateCartItemQuantity({
      user_id,
      product_id: pid,
      quantity: qty,
    });

    if (!affected) {
      return res.fail("Item not found in cart", 404);
    }

    res.success({ message: "Cart updated" });
  } catch (err) {
    next(err);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const { product_id } = req.params;

    const pid = Number(product_id);

    if (!isValidId(pid)) {
      return res.fail("Invalid product id", 400);
    }

    const affected = await cartService.removeFromCart({
      user_id,
      product_id: pid,
    });

    if (!affected) {
      return res.fail("Item not found in cart", 404);
    }

    res.success({ message: "Removed from cart" });
  } catch (err) {
    next(err);
  }
};

