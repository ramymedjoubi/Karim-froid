import React, { useEffect, useState } from "react";
import axios from "../api";

interface Category {
  _id: string;
  name: string;
}

const CategoriesAdmin = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `/categories/${editId}`,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditId(null);
      } else {
        await axios.post(
          "/categories",
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setName("");
      fetchCategories();
    } catch (err) {
      console.error("Error saving category", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category", err);
    }
  };

  const handleEdit = (category: Category) => {
    setEditId(category._id);
    setName(category.name);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h3>Manage Categories</h3>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-success w-100">
            {editId ? "Update" : "Add"}
          </button>
        </div>
      </form>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th style={{ width: "150px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.name}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(cat)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(cat._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesAdmin;
