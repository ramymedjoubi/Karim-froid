import React, { useEffect, useState } from "react";
import axios from "../api";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: { _id: string; name: string };
  image?: string;
}

interface Category {
  _id: string;
  name: string;
}

const ProductsAdmin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      if (editId) {
        await axios.put(`/products/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setEditId(null);
      } else {
        await axios.post("/products", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setName("");
      setDescription("");
      setPrice(0);
      setCategory("");
      setImage(null);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product", err);
    }
  };

  const handleEdit = (prod: Product) => {
    setEditId(prod._id);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price);
    setCategory(prod.category._id);
    setImage(null); // Reset image (optional to keep old image)
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  return (
    <div>
      <h3>Gérer les Produits</h3>

      <form onSubmit={handleSubmit} className="row g-3 mb-4" encType="multipart/form-data">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Prix"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Catégorie</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>

        <div className="col-md-2">
          <button type="submit" className="btn btn-success w-100">
            {editId ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </form>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Image</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Prix (DA)</th>
            <th>Catégorie</th>
            <th style={{ width: "160px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id}>
              <td>
                {prod.image && (
                  <img
                    src={`http://localhost:5000${prod.image}`}
                    alt={prod.name}
                    width="60"
                    height="60"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </td>
              <td>{prod.name}</td>
              <td>{prod.description}</td>
              <td>{prod.price}</td>
              <td>{prod.category.name}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(prod)}>
                  Modifier
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(prod._id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsAdmin;
