import express from 'express';
import { createOrder, getMyOrders, getAllOrders, confirmOrder, deleteOrder } from '../controllers/orderController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/confirm', protect, adminOnly, confirmOrder);
router.delete('/:id', protect, adminOnly, deleteOrder);


export default router;
