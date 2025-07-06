import express from 'express';
import { createProduct, getAllProducts , updateProduct, deleteProduct} from '../controllers/productController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

router.post('/', protect, adminOnly, upload.single("image"), createProduct);
router.get('/', getAllProducts);
router.put('/:id', protect, adminOnly, upload.single("image"), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);


export default router;
