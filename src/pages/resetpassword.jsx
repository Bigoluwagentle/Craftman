import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/api";
import "../styles/registernow.css"; // Reuse register styles

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword(token, newPassword);
      setSuccess(response.message);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/Login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registernow">
      <section>
        <form onSubmit={handleSubmit}>
          <h1>Reset Password</h1>
          <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
            Enter your new password below.
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
              <small>Redirecting to login...</small>
            </div>
          )}

          <nav>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="6"
            />
          </nav>

          <nav>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </nav>

          <input
            type="submit"
            value={loading ? "Resetting..." : "Reset Password"}
            disabled={loading || success}
          />
        </form>
      </section>
    </div>
  );
}

export default ResetPassword;