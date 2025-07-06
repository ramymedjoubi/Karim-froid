import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/add', protect, addToCart);
router.get('/', protect, getCart);
router.delete('/remove/:productId', protect, removeFromCart);


export default router;
