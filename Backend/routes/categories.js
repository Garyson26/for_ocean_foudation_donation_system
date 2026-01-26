const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// Add category with validation
router.post("/", async (req, res) => {
  try {
    const { name, sortDescription, donationAmount, descriptions } = req.body;

    if (!name || !descriptions || !sortDescription || !donationAmount) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if category already exists
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = new Category({
      name,
      sortDescription,
      donationAmount,
      descriptions: descriptions || []
    });
    await category.save();
    res.json({ message: "Category added successfully", category });
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ error: err.message });
  }
});

// Get all categories with pagination
router.get("/", async (req, res) => {
  try {
    const { page, limit } = req.query;

    // If pagination params are provided, use pagination
    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      const total = await Category.countDocuments();
      const categories = await Category.find()
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      res.json({
        categories,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum),
          limit: limitNum
        }
      });
    } else {
      // Return all categories without pagination (for dropdowns, etc.)
      const categories = await Category.find().sort({ displayOrder: 1, createdAt: -1 });
      res.json(categories);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update category
router.put("/:id", async (req, res) => {
  try {
    const { name, donationAmount, sortDescription, descriptions } = req.body;

    const updateData = {
      name,
      sortDescription,
      donationAmount,
      descriptions: descriptions || []
    };

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category updated successfully", category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete category
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reorder categories
router.put("/reorder", async (req, res) => {
  try {
    const { categories } = req.body; // Array of { id, displayOrder }

    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({ error: "Invalid categories data" });
    }

    // Update all categories with new display order
    const updatePromises = categories.map(({ id, displayOrder }) =>
      Category.findByIdAndUpdate(id, { displayOrder }, { new: true })
    );

    await Promise.all(updatePromises);

    res.json({ message: "Categories reordered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
