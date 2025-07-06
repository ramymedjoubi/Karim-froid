import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data;
      login(user, token);

      // ✅ Redirect based on role
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err: any) {
      console.error("Login failed", err);
      alert("Login failed: " + err?.response?.data?.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🔐 Login</h2>
      <form onSubmit={handleSubmit} className="col-md-6">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" name="email" className="form-control" id="email" required />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" name="password" className="form-control" id="password" required />
        </div>

        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
