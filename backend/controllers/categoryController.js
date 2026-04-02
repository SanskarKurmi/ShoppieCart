const categoryService = require("../services/categoryService");

// helper
const sanitize = (value) => value?.trim();

// CREATE
exports.createCategory = async (req, res) => {
  try {
    let { category_name, description, image_url } = req.body;

    category_name = sanitize(category_name);
    description = sanitize(description);
    image_url = sanitize(image_url);

    if (!category_name) {
      return res.fail("Category name is required", 400);
    }

    const id = await categoryService.createCategory({
      category_name,
      description,
      image_url,
    });

    res.success({ message: "Category created successfully", category_id: id }, 201);
  } catch (err) {
    console.error("createCategory error:", err);
    res.fail("Server error", 500);
  }
};

// GET ALL
exports.getCategories = async (req, res) => {
  try {
    const data = await categoryService.getAllCategories();
    res.success(data);
  } catch (err) {
    console.error("getCategories error:", err);
    res.fail("Server error", 500);
  }
};

// GET BY ID 
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await categoryService.getCategoryById(id);

    if (!data) {
      return res.fail("Category not found", 404);
    }

    res.success(data);
  } catch (err) {
    console.error("getCategoryById error:", err);
    res.fail("Server error", 500);
  }
};

// UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let { category_name, description, image_url } = req.body;

    category_name = sanitize(category_name);
    description = sanitize(description);
    image_url = sanitize(image_url);

    if (!category_name) {
      return res.fail("Category name is required", 400);
    }

    const affected = await categoryService.updateCategory(id, {
      category_name,
      description,
      image_url,
    });

    if (!affected) {
      return res.fail("Category not found", 404);
    }

    res.success({ message: "Category updated successfully" });
  } catch (err) {
    console.error("updateCategory error:", err);
    res.fail("Server error", 500);
  }
};

// SOFT DELETE
exports.deactivateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const affected = await categoryService.deactivateCategory(id);

    if (!affected) {
      return res.fail("Category not found", 404);
    }

    res.success({ message: "Category deactivated successfully" });
  } catch (err) {
    console.error("deactivateCategory error:", err);
    res.fail("Server error", 500);
  }
};

// REACTIVATE CATEGORY
exports.reactivateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const affected = await categoryService.reactivateCategory(id);

    if (!affected) {
      return res.fail("Category not found", 404);
    }

    res.success({ message: "Category reactivated successfully" });
  } catch (err) {
    console.error(err);
    res.fail("Server error", 500);
  }
};
