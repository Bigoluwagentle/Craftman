import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/api";
import "../styles/registernow.css"; 

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPassword(email);
      setSuccess(response.message);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registernow">
      <section>
        <form onSubmit={handleSubmit}>
          <h1>Forgot Password</h1>
          <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {error && (
            <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                color: "green",
                marginBottom: "15px",
                textAlign: "center",
                backgroundColor: "#d4edda",
                padding: "15px",
                borderRadius: "4px",
              }}
            >
              {success}
              <br />
              <small>Please check your email inbox (and spam folder).</small>
            </div>
          )}

          <nav>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </nav>

          <input
            type="submit"
            value={loading ? "Sending..." : "Send Reset Link"}
            disabled={loading}
          />

          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Remember your password?{" "}
            <Link to="/Login" style={{ color: "#007bff" }}>
              Back to Login
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default ForgotPassword;