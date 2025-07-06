import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { items } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">❄️ KARIM-FROID</Link>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav ms-auto align-items-center">

          {/* ✅ Lien vers tous les produits */}
          <li className="nav-item">
            <Link className="nav-link" to="/products">Produits</Link>
          </li>

          {!user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}

          {user && (
            <>
              <li className="nav-item">
                <span className="nav-link">👋 Hello, {user.name}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </li>

              {!user.isAdmin && (
                <li className="nav-item ms-3">
                  <Link to="/cart" className="btn btn-light">
                    🛒 Cart <span className="badge bg-secondary">{items.length}</span>
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
