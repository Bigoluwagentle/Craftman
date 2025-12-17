import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllVerifiedArtisans, searchArtisans } from "../services/api";
import "../styles/browsecraftsmen.css";
import logo from "../images/logo.png";
import profilepic from "../images/profilepics.png";
import { getProfilePictureUrl } from "../utils/imageHelper";
import Footer from "./footer";

function Browsecraft() {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/Login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchArtisans();
    }
  }, [isLoggedIn]);

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      const data = await getAllVerifiedArtisans();
      setArtisans(data);
      setError("");
    } catch (err) {
      setError("Failed to load artisans. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim() && !locationFilter.trim()) {
      fetchArtisans();
      return;
    }

    try {
      setLoading(true);
      const data = await searchArtisans(searchTerm, locationFilter);
      setArtisans(data);
      setError("");
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setLocationFilter("");
    fetchArtisans();
  };

  const viewProfile = (artisanId) => {
    navigate(`/Publicprofile?id=${artisanId}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/Login");
  };

  return (
    <div className="browsecraftsmen">
      <header>
        <section>
          <div>
            <img src={logo} alt="logoimg" />
            <nav>
              {user?.role === "artisan" && (
                <Link to="/Userdashboard">Dashboard</Link>
              )}
              {user?.role === "client" && (
                <Link to="/Browsecraft">Browse Craftsmen</Link>
              )}
              {user?.role === "admin" && (
                <Link to="/Admindashboard">Admin Panel</Link>
              )}
            </nav>
          </div>
          <section>
            <span>Welcome, {user?.name}</span>
            <button onClick={handleLogout} style={{ marginRight: "10px" }}>Logout</button>
            <Link to="/Userdashboard"><img src={getProfilePictureUrl(user?.profilePicture, profilepic)}  alt="profilepicimg"/></Link>
          </section>
        </section>
      </header>

      <main>
        <div>
          <div>
            <form onSubmit={handleSearch}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <nav>
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <input type="search" placeholder="Search by craft type (e.g., Electrician, Plumber)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                </nav>
                <input type="text" placeholder="Filter by location..." value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
                <button type="submit">Search</button>
                {(searchTerm || locationFilter) && (
                  <button type="button" onClick={clearSearch}>Clear</button>
                )}
              </div>
            </form>

            {!loading && artisans.length > 0 && (
              <p style={{ marginBottom: "20px", fontWeight: "bold" }}>Found {artisans.length} verified craftsmen</p>
            )}

            {loading && (
              <p style={{ textAlign: "center", marginTop: "20px" }}>Loading artisans...</p>
            )}

            {error && (
              <p style={{ textAlign: "center", color: "red", marginTop: "20px" }}>{error}</p>
            )}

            {!loading && !error && artisans.length === 0 && (
              <div style={{ textAlign: "center", marginTop: "40px" }}><p style={{ fontSize: "18px", marginBottom: "10px" }}> No craftsmen found matching your search.</p>
                <button onClick={clearSearch} style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", }}>Show All Craftsmen </button>
              </div>
            )}

            {!loading && artisans.length > 0 && (
              <section>
                {artisans.map((artisan) => (
                  <aside key={artisan._id}>
                    <nav>
                      <img src={getProfilePictureUrl(artisan.userId?.profilePicture, profilepic)} alt="profilepicimg" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}/>
                      <nav>
                        <h5>{artisan.userId?.name || "Unknown"}</h5>
                        <p>{artisan.craftType}</p>
                      </nav>
                    </nav>
                    <aside>
                      <p><i className="fa-solid fa-location-dot"></i> {artisan.location} </p>
                      <p> <i className="fa-regular fa-star" id="fastar"></i> {artisan.rating.toFixed(1)} ({artisan.numberOfReviews} reviews) </p>
                      <p><i className="fa-solid fa-hammer"></i>{artisan.experience} Years Experience </p>
                      {artisan.bio && (
                        <p style={{ fontSize: "14px", color: "#666", marginTop: "10px",}}>
                          {artisan.bio.length > 100
                            ? artisan.bio.substring(0, 100) + "..."
                            : artisan.bio}
                        </p>
                      )}
                      {artisan.skills && artisan.skills.length > 0 && (
                        <p style={{ fontSize: "12px", marginTop: "5px" }}> <strong>Skills:</strong> {artisan.skills.slice(0, 3).join(", ")} {artisan.skills.length > 3 && "..."} </p>
                      )}
                    </aside>
                    <button onClick={() => viewProfile(artisan._id)}>View Full Profile</button>
                  </aside>
                ))}
              </section>
            )}
          </div>
        </div>
      </main>

      <nav>
        <aside>
          <nav>
            <img src={logo} alt="logoimg" />
            <p>Connecting you with verified artisans for all your home and business needs</p>
            <nav>
              <i className="fa-brands fa-facebook-f"></i>
              <i className="fa-brands fa-twitter"></i>
              <i className="fa-brands fa-linkedin-in"></i>
              <i className="fa-brands fa-instagram"></i>
            </nav>
          </nav>
          <aside>
            <h4>Company</h4>
            <p>About Us</p>
            <p>Contact</p>
            <p>FAQs</p>
          </aside>
          <aside>
            <h4>Resources</h4>
            <p>Terms of Service</p>
            <p>Privacy Policy</p>
            <p>Our Service</p>
          </aside>
          <aside>
            <h4>Contact Us</h4>
            <p>Olayiwolaolabode06@gmail.com</p>
            <p>+234 706 050 3032</p>
            <p> <i className="fa-solid fa-location-dot"></i>123 artisan ave, Craftsville, CA 90210 </p>
          </aside>
        </aside>
      </nav>
      <Footer />
    </div>
  );
}

export default Browsecraft;