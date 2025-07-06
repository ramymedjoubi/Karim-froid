import { useEffect, useState } from "react";
import axios from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: Category;
}

const AllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          axios.get("/products"),
          axios.get("/categories"),
        ]);
        setProducts(productRes.data);
        setCategories(categoryRes.data);
      } catch (err) {
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category?._id === selectedCategory);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Tous les Produits</h2>

      {/* Filter */}
      <div className="mb-4 text-center">
        <select
          className="form-select w-50 mx-auto"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {filteredProducts.map((product) => (
          <div className="col-md-4 mb-4" key={product._id}>
            <div className="card h-100 shadow-sm">
              {product.image && (
                <img
                  src={`http://localhost:5000${product.image}`}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">
                  <strong>Prix:</strong> {product.price} DA
                </p>
                <p>
                  <span className="badge bg-info">{product.category?.name}</span>
                </p>
                {user && !user.isAdmin && (
                  <button
                    className="btn btn-primary"
                    onClick={() => addToCart(product._id, 1)}
                  >
                    Ajouter au panier
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
