import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Order from '../models/Order';
import Product from '../models/Product';

interface AuthRequest extends Request {
  user?: { userId: string; isAdmin: boolean };
}

// ➕ Ajouter un produit au panier
export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user!.userId;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', err });
  }
};

// 🛒 Obtenir le panier
export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user!.userId }).populate('items.product');
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', err });
  }
};

// ❌ Supprimer un produit du panier
export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    cart.items.splice(0, cart.items.length, ...cart.items.filter(item => item.product.toString() !== productId));

    await cart.save();

    res.status(200).json({ message: 'Product removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing product from cart', err });
  }
};

// ✅ Confirmer la commande
export const confirmOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Panier vide' });
      return;
    }

    const total = cart.items.reduce((acc, item) => {
      const product = item.product as any;
      return acc + product.price * item.quantity;
    }, 0);

    const order = new Order({
      user: userId,
      items: cart.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
      })),
      total,
    });

    await order.save();
    await Cart.findOneAndUpdate({ user: userId }, { items: [] }); // vider le panier

    res.status(201).json({ message: 'Commande confirmée', order });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la confirmation de la commande', err });
  }
};
