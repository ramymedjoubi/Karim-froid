import { Request, Response } from 'express';
import Category from '../models/Category';

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
      res.status(400).json({ message: 'Category already exists' });
      return;
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
};

export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating category", err });
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category", err });
  }
};
