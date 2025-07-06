import React, { useEffect, useState } from "react";
import axios from "../api";

interface OrderItem {
  product: { name: string; price: number } | null;
  quantity: number;
}

interface Order {
  _id: string;
  user: { name: string; email: string };
  items: OrderItem[];
  wilaya: string;
  phone: string;
  total: number;
  isConfirmed: boolean;
  createdAt: string;
}

const OrdersAdmin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  const handleConfirm = async (orderId: string) => {
    try {
      await axios.put(
        `/orders/${orderId}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Error confirming order", err);
    }
  };

 const handleDelete = async (orderId: string) => {
  if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) return;

  try {
    await axios.delete(`/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchOrders(); // Refresh the orders list
  } catch (err) {
    console.error("Erreur lors de la suppression de la commande", err);
    alert("Échec de la suppression");
  }
};


  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h3>Commandes Clients</h3>

      {orders.length === 0 ? (
        <p>Aucune commande pour le moment.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Wilaya</th>
                <th>Items</th>
                <th>Total</th>
                <th>Confirmed</th>
                <th>Date</th>
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.user?.name}</td>
                  <td>{order.phone}</td>
                  <td>{order.wilaya}</td>
                  <td>
                    <ul className="mb-0">
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {item.product ? `${item.product.name} x ${item.quantity}` : "Produit supprimé"}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{order.total} DA</td>
                  <td>{order.isConfirmed ? "✅" : "❌"}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="d-flex gap-2">
                    {!order.isConfirmed && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleConfirm(order._id)}
                      >
                        Confirmer
                      </button>
                    )}
                    <button
  className="btn btn-danger btn-sm ms-2"
  onClick={() => handleDelete(order._id)}
>
  Supprimer
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;
