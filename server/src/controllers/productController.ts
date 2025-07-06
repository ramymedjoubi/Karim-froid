import { Request, Response } from 'express';
import Product from '../models/Product';

// CREATE Product (avec image depuis req.file)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

// GET All Products (avec catégorie peuplée)
export const getAllProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().populate('category', 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// UPDATE Product (image modifiable aussi)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    const updateData: any = {
      name,
      description,
      price,
      category,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating product", err });
  }
};

// DELETE Product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", err });
  }
};
