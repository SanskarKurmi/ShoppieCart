const productService = require("../services/productService");
const isValidId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

const sanitize = (value) => value?.trim();

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// CREATE product
exports.createProduct = async (req, res) => {
  try {
    let { product_name, description, price, stock, image_url, category_id } =
      req.body;

    product_name = sanitize(product_name);
    description = sanitize(description);
    image_url = sanitize(image_url);

    if (!product_name || price == null || category_id == null) {
      return res.fail("product_name, price, and category_id are required", 400);
    }

    price = Number(price);
    stock = stock == null ? 0 : Number(stock);
    category_id = Number(category_id);

    if (
      Number.isNaN(price) ||
      Number.isNaN(stock) ||
      Number.isNaN(category_id)
    ) {
      return res.fail("Invalid numeric values", 400);
    }

    if (price < 0) {
      return res.fail("Price must be positive", 400);
    }

    if (stock < 0) {
      return res.fail("Stock cannot be negative", 400);
    }

    if (image_url && !isValidUrl(image_url)) {
      return res.fail("Invalid image URL", 400);
    }

    const id = await productService.createProduct({
      product_name,
      description,
      price,
      stock,
      image_url,
      category_id,
    });

    res.success({ message: "Product created successfully", product_id: id }, 201);
  } catch (err) {
    console.error("createProduct error:", err);

    // FK violation → invalid category
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.fail("Invalid category_id", 400);
    }

    res.fail("Server error", 500);
  }
};

// GET ALL
exports.getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, category_id, sort } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (!Number.isFinite(page) || page < 1) page = 1;
    if (!Number.isFinite(limit) || limit < 1 || limit > 100) limit = 10;

    const products = await productService.getAllProducts({
      page,
      limit,
      category_id,
      sort,
    });

    res.success(products);
  } catch (err) {
    console.error("getProducts error:", err);
    res.fail("Server error", 500);
  }
};

// GET BY ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.fail("Invalid product id", 400);
    }
    const product = await productService.getProductById(id);

    if (!product) {
      return res.fail("Product not found", 404);
    }

    res.success(product);
  } catch (err) {
    console.error("getProductById error:", err);
    res.fail("Server error", 500);
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.fail("Invalid product id", 400);
    }

    let { product_name, description, price, stock, image_url, category_id } =
      req.body;

    product_name = sanitize(product_name);
    description = sanitize(description);
    image_url = sanitize(image_url);

    price = Number(price);
    stock = Number(stock);
    category_id = Number(category_id);

    if (
      Number.isNaN(price) ||
      Number.isNaN(stock) ||
      Number.isNaN(category_id)
    ) {
      return res.fail("Invalid numeric values", 400);
    }

    if (price < 0) {
      return res.fail("Price must be positive", 400);
    }

    if (stock < 0) {
      return res.fail("Stock cannot be negative", 400);
    }

    if (image_url && !isValidUrl(image_url)) {
      return res.fail("Invalid image URL", 400);
    }
    const affected = await productService.updateProduct(id, {
      product_name,
      description,
      price,
      stock,
      image_url,
      category_id,
    });

    if (!affected) {
      return res.fail("Product not found", 404);
    }

    res.success({ message: "Product updated successfully" });
  } catch (err) {
    console.error("updateProduct error:", err);

    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.fail("Invalid category_id", 400);
    }

    res.fail("Server error", 500);
  }
};

// DEACTIVATE
exports.deactivateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.fail("Invalid product id", 400);
    }

    const affected = await productService.deactivateProduct(id);

    if (!affected) {
      return res.fail("Product not found", 404);
    }

    res.success({ message: "Product deactivated successfully" });
  } catch (err) {
    console.error("deactivateProduct error:", err);
    res.fail("Server error", 500);
  }
};

//REACTIVATE
exports.reactivateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.fail("Invalid product id", 400);
    }

    const affected = await productService.reactivateProduct(id);

    if (!affected) {
      return res.fail("Product not found", 404);
    }

    res.success({ message: "Product reactivated successfully" });
  } catch (err) {
    console.error(err);
    res.fail("Server error", 500);
  }
};
