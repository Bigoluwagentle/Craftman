import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUnverifiedArtisans, getVerifiedArtisans, verifyArtisan, unverifyArtisan, getAllUsers } from "../services/api";
import Swal from 'sweetalert2';
import "../styles/admindashboard.css";
import close from "../images/icon-close.svg";
import logoimg from "../images/logoimage.png";
import hamburger from "../images/icon-hamburger.svg";
import logo from "../images/logo.png";
import profilepic from "../images/profilepics.png";
import { getProfilePictureUrl } from "../utils/imageHelper";

function Admindashboard() {
  const navigate = useNavigate();
  const [unverifiedArtisans, setUnverifiedArtisans] = useState([]);
  const [verifiedArtisans, setVerifiedArtisans] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("unverified");
  const [processingId, setProcessingId] = useState(null);

  // ✅ FIX: Use state for user instead of const
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/Login");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser || currentUser.role !== "admin") {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Admin access only',
        confirmButtonColor: '#3b82f6'
      });
      navigate("/");
      return;
    }

    fetchData();
  }, [isLoggedIn, navigate]);

  // ✅ FIX: Add storage event listener to update when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
    };

    // Listen for custom event when profile picture is updated
    window.addEventListener('profilePictureUpdated', handleStorageChange);
    
    // Also listen for storage changes (works across tabs)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('profilePictureUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [unverified, verified, users] = await Promise.all([
        getUnverifiedArtisans(),
        getVerifiedArtisans(),
        getAllUsers(),
      ]);

      setUnverifiedArtisans(unverified);
      setVerifiedArtisans(verified);
      setAllUsers(users);
      setError("");
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    const result = await Swal.fire({
      title: 'Verify Artisan?',
      text: "Are you sure you want to verify this artisan?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, verify!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      setProcessingId(userId);
      await verifyArtisan(userId);
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Artisan verified successfully!',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      });
      
      fetchData();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.message || err.message,
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnverify = async (userId) => {
    const result = await Swal.fire({
      title: 'Unverify Artisan?',
      text: "Are you sure you want to unverify this artisan?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, unverify!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      setProcessingId(userId);
      await unverifyArtisan(userId);
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Artisan unverified successfully!',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      });
      
      fetchData();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.message || err.message,
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/Login");
  };

  function Hamburger() {
    document.querySelector("#hamburger").style.display = "none";
    document.querySelector("#summar").style.display = "flex";
    const closeBtn = document.querySelector("#close");

    closeBtn.onclick = function () {
      document.querySelector("#summar").style.display = "none";
      document.querySelector("#hamburger").style.display = "block";
    };
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        <p>{error}</p>
        <p style={{ color: "#666", marginTop: "10px" }}>Error details: Check console for more information</p>
        <button onClick={() => { setError(""); fetchData(); }} style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "10px" }}>Retry</button>
        <button onClick={handleLogout} style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "10px", marginLeft: "10px" }}>Logout</button>
      </div>
    );
  }

  return (
    <div className="admindashboard">
      <div>
        <div>
          <nav>
            <img src={logoimg} alt="logoimg" />
          </nav>
          <section>
            <h3>Admin Panel</h3>
            <Link onClick={() => setActiveTab("unverified")} style={{ color: activeTab === "unverified" ? "#3498db" : "white" }}><i className="fa-solid fa-clock"></i> Pending Verification ({unverifiedArtisans.length})</Link>
            <Link onClick={() => setActiveTab("verified")} style={{ color: activeTab === "verified" ? "#3498db" : "white" }}><i className="fa-solid fa-check-circle"></i> Verified Artisans ({verifiedArtisans.length})</Link>
            <Link onClick={() => setActiveTab("users")} style={{ color: activeTab === "users" ? "#3498db" : "white" }}> <i className="fa-solid fa-users"></i> All Users ({allUsers.length})</Link>
            <Link to="/Browsecraft"><i className="fa-solid fa-search"></i> Browse Craftsmen</Link>
            <button onClick={handleLogout}>Logout</button>
          </section>
        </div>

        <section>
          <header>
            <section>
              <img src={hamburger} id="hamburger" onClick={Hamburger} alt="hamburgerimg" />
              <div>
                <img src={logo} alt="logoimg" />
                <nav>
                  <Link to="/Browsecraft">Browse Craftsmen</Link>
                </nav>
              </div>
              <section>
                <span>Admin: {user?.name}</span>
                <Link><img src={getProfilePictureUrl(user?.profilePicture, profilepic)} alt="profilepicimg" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} /></Link>
              </section>
              <summary id="summar">
                <img src={close} alt="closeimg" id="close" />
                <Link to="/">Home</Link>
                <Link to="/Browsecraft">Browse Craftsmen</Link>
                <button onClick={handleLogout}>Logout</button>
              </summary>
            </section>
          </header>

          <div>
            <div>
              <h2>{unverifiedArtisans.length}</h2>
              <p>Pending Verification</p>
            </div>
            <div>
              <h2>{verifiedArtisans.length}</h2>
              <p>Verified Artisans</p>
            </div>
            <div>
              <h2>{allUsers.length}</h2>
              <p>Total Users</p>
            </div>
          </div>

          {activeTab === "unverified" && (
            <div>
              <h2>Pending Verification ({unverifiedArtisans.length})</h2>
              {unverifiedArtisans.length === 0 ? (
                <p>No artisans pending verification</p>
              ) : (
                <div>
                  {unverifiedArtisans.map((artisan) => (
                    <div key={artisan._id} style={{ backgroundColor: "#f8f9fa", padding: "20px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #dee2e6" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div style={{ flex: 1 }}>
                          <h4>{artisan.userId?.name}</h4>
                          <p><strong>Email:</strong> {artisan.userId?.email}</p>
                          <p><strong>Phone:</strong> {artisan.userId?.phone}</p>
                          <p><strong>Craft Type:</strong> {artisan.craftType}</p>
                          <p><strong>Location:</strong> {artisan.location}</p>
                          <p><strong>Experience:</strong> {artisan.experience} years</p>
                          <p><strong>Registered:</strong> {new Date(artisan.userId?.createdAt).toLocaleDateString()}</p>
                          {artisan.bio && <p><strong>Bio:</strong> {artisan.bio}</p>}
                          {artisan.skills && artisan.skills.length > 0 && (
                            <p><strong>Skills:</strong> {artisan.skills.join(", ")}</p>
                          )}
                        </div>
                        <div>
                          <button
                            onClick={() => handleVerify(artisan.userId._id)}
                            disabled={processingId === artisan.userId._id}
                            style={{
                              padding: "10px 20px",
                              backgroundColor: "#28a745",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: processingId === artisan.userId._id ? "not-allowed" : "pointer",
                            }}
                          >
                            {processingId === artisan.userId._id ? "Processing..." : "✓ Verify"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "verified" && (
            <div>
              <h2>Verified Artisans ({verifiedArtisans.length})</h2>
              {verifiedArtisans.length === 0 ? (
                <p style={{ textAlign: "center", marginTop: "30px", color: "#666" }}>
                  No verified artisans yet
                </p>
              ) : (
                <div style={{ marginTop: "20px" }}>
                  {verifiedArtisans.map((artisan) => (
                    <div
                      key={artisan._id}
                      style={{
                        backgroundColor: "#d4edda",
                        padding: "20px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        border: "1px solid #c3e6cb",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div style={{ flex: 1 }}>
                          <h4>{artisan.userId?.name} ✓</h4>
                          <p><strong>Email:</strong> {artisan.userId?.email}</p>
                          <p><strong>Craft Type:</strong> {artisan.craftType}</p>
                          <p><strong>Location:</strong> {artisan.location}</p>
                          <p><strong>Rating:</strong> {artisan.rating.toFixed(1)} ⭐ ({artisan.numberOfReviews} reviews)</p>
                        </div>
                        <div>
                          <Link
                            to={`/Publicprofile?id=${artisan._id}`}
                            style={{
                              padding: "10px 20px",
                              backgroundColor: "#007bff",
                              color: "white",
                              textDecoration: "none",
                              borderRadius: "4px",
                              marginRight: "10px",
                              display: "inline-block",
                            }}
                          >
                            View Profile
                          </Link>
                          <button
                            onClick={() => handleUnverify(artisan.userId._id)}
                            disabled={processingId === artisan.userId._id}
                            style={{
                              padding: "10px 20px",
                              backgroundColor: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: processingId === artisan.userId._id ? "not-allowed" : "pointer",
                            }}
                          >
                            {processingId === artisan.userId._id ? "Processing..." : "✗ Unverify"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h2>All Users ({allUsers.length})</h2>
              <div style={{ marginTop: "20px" }}>
                {allUsers.map((user) => (
                  <div
                    key={user._id}
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "15px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h5>{user.name}</h5>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p>
                          <strong>Status:</strong>{" "}
                          {user.isVerified ? (
                            <span style={{ color: "#28a745" }}>Verified ✓</span>
                          ) : (
                            <span style={{ color: "#ffc107" }}>Pending</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <span style={{ padding: "5px 15px", backgroundColor: user.role === "admin" ? "#dc3545" : user.role === "artisan" ? "#007bff" : "#28a745",color: "white",borderRadius: "20px",fontSize: "14px",}}>{user.role.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Admindashboard;