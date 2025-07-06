import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import axios from "../api";

const wilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M’Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
  "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M’Ghair", "El Menia"
];

const Cart = () => {
  const { items, removeFromCart, confirmOrder } = useCart();
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");

  const handleOrder = () => {
    if (!phone || !wilaya) {
      alert("Veuillez saisir le numéro de téléphone et la wilaya");
      return;
    }
    confirmOrder(phone, wilaya);
  };

  return (
    <div className="container mt-5">
      <h2>Votre Panier</h2>
      {items.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <>
          <ul className="list-group mb-4">
            {items.map((item, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                {typeof item.product !== "string" && item.product.name} - {item.quantity}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFromCart(typeof item.product !== "string" ? item.product._id : "")}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>

          <div className="mb-3">
            <label>Téléphone:</label>
            <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="mb-3">
            <label>Wilaya:</label>
            <select className="form-select" value={wilaya} onChange={(e) => setWilaya(e.target.value)}>
              <option value="">-- Sélectionnez une wilaya --</option>
              {wilayas.map((w, i) => (
                <option key={i} value={w}>{w}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-success" onClick={handleOrder}>Confirmer la commande</button>
        </>
      )}
    </div>
  );
};

export default Cart;
