import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "../styles/registernow.css";

function Registernow() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client",
    phone: "",
    craftType: "",
    experience: "",
    location: "",
    bio: "",
    skills: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
    };

    if (formData.role === "artisan") {
      if (!formData.craftType || !formData.experience || !formData.location) {
        setError("Please fill all craftsman fields");
        return;
      }

      userData.craftType = formData.craftType;
      userData.experience = parseInt(formData.experience);
      userData.location = formData.location;
      userData.bio = formData.bio;
      
      if (formData.skills) {
        userData.skills = formData.skills.split(",").map(skill => skill.trim());
      }
    }

    try {
      setLoading(true);
      const response = await registerUser(userData);

      navigate("/EmailVerification", { state: { email: userData.email } });
      
      alert(response.message);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registernow">
      <section>
        <form onSubmit={handleSubmit}>
          <h1>Create Account</h1>

          {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

          <nav>
            <label htmlFor="name">Full Name</label>
            <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required/>
          </nav>

          <nav>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder="ogo@gmail.com" value={formData.email} onChange={handleChange} required />
          </nav>

          <nav>
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" name="phone" placeholder="08012345678" value={formData.phone} onChange={handleChange} required />
          </nav>

          <nav>
            <label htmlFor="role">User Type</label>
            <select name="role" value={formData.role} onChange={handleChange} >
              <option value="client">Client</option>
              <option value="artisan">Craftsman</option>
            </select>
          </nav>

          {formData.role === "artisan" && (
            <>
              <nav>
                <label htmlFor="craftType">Craft Type</label>
                <input type="text" name="craftType" placeholder="e.g., Electrician, Plumber, Carpenter" value={formData.craftType} onChange={handleChange} required />
              </nav>

              <nav>
                <label htmlFor="experience">Years of Experience</label>
                <input type="number" name="experience" placeholder="e.g., 5" value={formData.experience} onChange={handleChange} min="0" required />
              </nav>

              <nav>
                <label htmlFor="location">Location</label>
                <input type="text" name="location" placeholder="e.g., Lagos, Ibadan" value={formData.location} onChange={handleChange} required />
              </nav>

              <nav>
                <label htmlFor="bio">Bio (Optional)</label>
                <textarea name="bio" placeholder="Tell us about yourself and your services" value={formData.bio} onChange={handleChange} rows="3" />
              </nav>

              <nav>
                <label htmlFor="skills">Skills (Optional - Separate with commas)</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="e.g., Wiring, Installation, Repairs"
                  value={formData.skills} onChange={handleChange}
                />
              </nav>
            </>
          )}

          <nav>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
          </nav>

          <nav>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required />
          </nav>

          <input 
            type="submit" value={loading ? "Creating Account..." : "Create Account"} disabled={loading} />
          
          <p>Already have an account? <Link to="/Login">Login Here</Link> </p>
        </form>
      </section>
    </div>
  );
}

export default Registernow;