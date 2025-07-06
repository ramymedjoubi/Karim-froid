import React, { useState } from "react";
import ProductsAdmin from "./ProductsAdmin";
import CategoriesAdmin from "./CategoriesAdmin";
import OrdersAdmin from "./OrdersAdmin";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <ProductsAdmin />;
      case "categories":
        return <CategoriesAdmin />;
      case "orders":
        return <OrdersAdmin />;
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row vh-100">
        {/* Sidebar */}
        <div className="col-md-2 bg-dark text-white p-3">
          <h4 className="text-center mb-4">Admin</h4>
          <ul className="nav flex-column">
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-start text-white ${
                  activeTab === "products" ? "fw-bold" : ""
                }`}
                onClick={() => setActiveTab("products")}
              >
                Products
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-start text-white ${
                  activeTab === "categories" ? "fw-bold" : ""
                }`}
                onClick={() => setActiveTab("categories")}
              >
                Categories
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-start text-white ${
                  activeTab === "orders" ? "fw-bold" : ""
                }`}
                onClick={() => setActiveTab("orders")}
              >
                Orders
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-10 p-4 bg-light overflow-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
