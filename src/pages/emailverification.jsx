import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail, resendVerificationCode } from "../services/api";
import "../styles/registernow.css"; // Reuse register styles

function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Get email from navigation state
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email, redirect to register
      navigate("/Registernow");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyEmail(email, verificationCode);

      // Save token and user data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response));

      setSuccess("Email verified successfully! Redirecting...");

      // Redirect based on role
      setTimeout(() => {
        if (response.role === "client") {
          navigate("/Browsecraft");
        } else if (response.role === "artisan") {
          navigate("/Userdashboard");
        }
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");

    try {
      setResending(true);
      await resendVerificationCode(email);
      setSuccess("Verification code sent! Please check your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="registernow">
      <section>
        <form onSubmit={handleSubmit}>
          <h1>Verify Your Email</h1>
          <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
            We've sent a 6-digit verification code to<br />
            <strong>{email}</strong>
          </p>

          {error && (
            <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ color: "green", marginBottom: "15px", textAlign: "center" }}>
              {success}
            </div>
          )}

          <nav>
            <label htmlFor="verificationCode">Verification Code</label>
            <input
              type="text"
              name="verificationCode"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength="6"
              required
              style={{ textAlign: "center", fontSize: "24px", letterSpacing: "5px" }}
            />
          </nav>

          <input
            type="submit"
            value={loading ? "Verifying..." : "Verify Email"}
            disabled={loading}
          />

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <p style={{ color: "#666" }}>Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                textDecoration: "underline",
                cursor: resending ? "not-allowed" : "pointer",
                fontSize: "16px",
              }}
            >
              {resending ? "Sending..." : "Resend Code"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default EmailVerification;