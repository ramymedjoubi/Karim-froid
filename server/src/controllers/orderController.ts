import { Request, Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';

interface AuthRequest extends Request {
  user?: { userId: string; isAdmin: boolean };
}

interface PopulatedProduct {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category?: any;
}

interface PopulatedCartItem {
  product: PopulatedProduct;
  quantity: number;
}

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { phone, wilaya } = req.body;

    if (!phone || !wilaya) {
      res.status(400).json({ message: "Téléphone et wilaya requis." });
      return;
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    const items = cart.items as unknown as PopulatedCartItem[];
    const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const order = new Order({
      user: userId,
      items: cart.items,
      total,
      phone,
      wilaya
    });

    await order.save();
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Order creation failed', err });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user!.userId }).populate('items.product');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', err });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('items.product')
      .populate('user', 'name email'); // admin sees buyer info
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', err });
  }
};

export const confirmOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    order.isConfirmed = true;
    await order.save();

    res.status(200).json({ message: 'Order confirmed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to confirm order', err });
  }
};
export const deleteOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.isAdmin) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const { id } = req.params;
    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order", err });
  }
};
