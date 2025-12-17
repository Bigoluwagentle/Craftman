import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "../styles/registernow.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser(formData);

      // Check if email is verified
      if (!response.isVerified) {
        alert("Please verify your email first. Check your inbox for the verification code.");
        navigate("/EmailVerification", { state: { email: formData.email } });
        return;
      }

      // Save token and user data to localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response));

      // Redirect based on role
      if (response.role === "client") {
        navigate("/Browsecraft");
      } else if (response.role === "artisan") {
        navigate("/Userdashboard");
      } else if (response.role === "admin") {
        navigate("/Admindashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registernow">
      <section>
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>

          {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

          <nav>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder="ogo@gmail.com" value={formData.email} onChange={handleChange} required />
          </nav>

          <nav>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
          </nav>

          <input type="submit" value={loading ? "Logging in..." : "Login"} disabled={loading} />

          <p style={{ textAlign: "center", marginTop: "15px" }}><Link to="/ForgotPassword" style={{ color: "#007bff" }}>Forgot Password?</Link></p>

          <p>Don't have an account? <Link to="/Registernow">Register Now</Link></p>
        </form>
      </section>
    </div>
  );
}

export default Login;