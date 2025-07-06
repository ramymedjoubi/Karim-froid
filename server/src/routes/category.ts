import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { createCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/categoryController';

const router = express.Router();

router.post('/', protect, adminOnly, createCategory);
router.get('/', getAllCategories);
router.put('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);


export default router;
