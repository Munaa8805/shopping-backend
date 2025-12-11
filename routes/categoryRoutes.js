import express from "express";
const router = express.Router();
import Category from "../models/Category.js";
import mongoose from "mongoose";

// GET /api/categories
// Returns a list of categories
// Example response: [{ id: 1, name: "Electronics" }, { id: 2, name: "Clothing" }]
// access: public
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid category ID");
    }
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    res.status(200).json({
      succsess: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/categories
/// Creates a new category
// Example request body: { name: "Toys" }
// Example response: { message: "Category created successfully" }
// access: private
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  if (!name?.trim() || !description.trim()) {
    res.status(400);
    throw new Error("Category name descriont are required to fill");
  }

  const newCategory = new Category({
    name: name.trim(),
    description: description.trim(),
  });

  const savedCategory = await newCategory.save();
  console.log("Category created", req.body);
  res.status(201).json({ succsess: true, data: savedCategory });
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid category ID");
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    res.status(200).json({
      succsess: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid category ID");
    }

    const category = await Category.findById(id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    if (category.name === name?.trim()) {
      category.name = category.name;
    } else {
      category.name = name?.trim() || category.name;
    }

    category.description = description?.trim() || category.description;

    // console.log("Updating category:", category);

    const updatedCategory = await Category.findByIdAndUpdate(id, category, {
      new: true,
      runValidators: true,
    });
    if (!updatedCategory) {
      res.status(404);
      throw new Error("Category not found after update");
    }

    res.status(200).json({
      succsess: true,
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
