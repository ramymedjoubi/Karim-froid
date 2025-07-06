import { useEffect, useState } from "react";
import axios from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: { name: string };
}

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});


const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/products?limit=6");
        setProducts(res.data);
      } catch (err) {
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div
        className="text-white d-flex align-items-center justify-content-center"
        style={{
          background: `url("http://localhost:5000/uploads/bg-froid.jpg") center/cover no-repeat`,
          height: "60vh",
        }}
      >
        <div className="text-center">
          <h1 className="display-4 fw-bold">Solutions de Réfrigération Professionnelles</h1>
          <p className="lead">Matériel performant pour vos chambres froides</p>
          <a href="/products" className="btn btn-primary btn-lg mt-3">Voir nos produits</a>
        </div>
      </div>

      {/* Latest Products */}
      <div id="products" className="container mt-5">
        <h2 className="mb-4 text-center">Nos derniers Produits</h2>
        {loading && <p>Chargement...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          {products.map((product) => (
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
                  <p className="card-text"><strong>Prix:</strong> {product.price} DA</p>
                  <p><span className="badge bg-info">{product.category?.name}</span></p>
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
        <a href="/products" className="btn btn-primary btn-lg mt-3" style={{textAlign:"center"}}>Voir tous les produits</a>
      </div>

      {/* Services Section */}
      <div className="container py-5">
        <h2 className="mb-4 text-center">Nos Services</h2>
        <div className="row g-4">
          {[
            {
              icon: "bi-gear",
              title: "Assistance Technique",
              desc: "Conseils personnalisés pour chaque moteur et installation.",
            },
            {
              icon: "bi-truck",
              title: "Livraison Rapide",
              desc: "Expédition express dans toutes les wilayas d'Algérie.",
            },
            {
              icon: "bi-award",
              title: "Qualité Garantie",
              desc: "Des produits originaux et garantis 12 mois.",
            },
          ].map((s, i) => (
            <div key={i} className="col-md-4">
              <div className="card text-center h-100 shadow-sm">
                <div className="card-body">
                  <i className={`bi ${s.icon} fs-1 mb-3`}></i>
                  <h5 className="card-title">{s.title}</h5>
                  <p className="card-text">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="container my-5">
        <h2 className="mb-4 text-center">Notre Localisation</h2>
        <div style={{ height: "400px", width: "100%" }}>
          <MapContainer
            center={[36.030406, 4.811580]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[36.030406, 4.811580]}>
              <Popup>
                Magasin de réfrigération de mon ami<br /> Sétif, Algérie.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Home;
