import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../api";

type Product = { _id: string; name: string; price: number };

type CartItem = {
  product: Product | string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  fetchCart: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => void;
  confirmOrder: (phone: string, wilaya: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data.items || []);
    } catch (err) {
      console.error("Erreur panier:", err);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!token) return;
    try {
      await axios.post(
        "/cart/add",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
      alert("Produit ajouté !");
    } catch (err) {
      console.error("Erreur ajout panier:", err);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!token) return;
    try {
      await axios.delete(`/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Erreur suppression panier:", err);
    }
  };

  const confirmOrder = async (phone: string, wilaya: string) => {
    if (!token) return;
    try {
      await axios.post(
        "/orders",
        { phone, wilaya },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems([]);
      alert("Commande confirmée !");
    } catch (err) {
      console.error("Erreur commande:", err);
      alert("Échec de la commande");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ items, fetchCart, addToCart, removeFromCart, confirmOrder }}>
      {children}
    </CartContext.Provider>
  );
};
