import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserProfile, getArtisanProfile } from "../services/api";
import "../styles/userdashboard.css";
import close from "../images/icon-close.svg";
import profilepic from "../images/profilepics.png";
import logo from "../images/logo.png";
import hamburger from "../images/icon-hamburger.svg";
import { getProfilePictureUrl } from "../utils/imageHelper";
import Footer from "./footer";

function Userdashboard() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [artisanProfile, setArtisanProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/Login");
      return;
    }
    fetchUserData();
  }, [isLoggedIn, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
  
      const userData = await getUserProfile();
      setUserProfile(userData);

      if (userData.role === "artisan") {
        const artisanData = await getArtisanProfile();
        setArtisanProfile(artisanData);
      }

      setError("");
    } catch (err) {
      setError("Failed to load profile data");
      console.error(err);
    } finally {
      setLoading(false);
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
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        <p>{error}</p>
        <button onClick={fetchUserData}>Retry</button>
      </div>
    );
  }

  const isArtisan = userProfile?.role === "artisan";
  const isClient = userProfile?.role === "client";

  return (
    <div>
      <div className="userdashboard">
        <section>
          <header>
            <section>
              <img src={hamburger} id="hamburger" onClick={Hamburger} alt="hamburgerimg" />
              <div>
                <img src={logo} alt="logoimg" />
                <nav>
                  {/* <Link to="/Userdashboard">Dashboard</Link> */}
                  {isClient && <Link to="/Browsecraft">Browse Craftsmen</Link>}
                  {isArtisan && <Link to="/Browsecraft">Browse Craftsmen</Link>}
                </nav>
              </div>
              <section>
                <button onClick={handleLogout} style={{ marginRight: "10px" }}>Logout</button>
                <Link to="/Profiledetails"><img src={getProfilePictureUrl(user?.profilePicture, profilepic)}  alt="profilepicimg" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}/></Link>
              </section>
              <summary id="summar">
                <img src={close} alt="closeimg" id="close" />
                <Link to="/">Home</Link>
                <Link to="/Browsecraft">Browse Craftsmen</Link>
                <Link to="/Userdashboard"><button>Dashboard</button></Link>
                {isClient && (
                  <>
                    <Link to="/Unlockedcontact"><button>My Unlocked Contact</button></Link>
                    <Link to="/Subcription"><button>Subscription</button></Link>
                    <Link to="/Review"><button>My Reviews</button></Link>
                  </>
                )}
                <button onClick={handleLogout}>Logout</button>
              </summary>
            </section>
          </header>

          <div>
            <h1>Hi {userProfile?.name}</h1>
            <p>
              {isArtisan
                ? "Manage your craftsman profile and view your performance"
                : "Welcome back to your personalized dashboard"}
            </p>
          </div>

          {/* Client Dashboard */}
          {isClient && (
            <>
              <aside>
                <nav>
                  <h5>Subscription Status</h5>
                  <p style={{ color: "#28a745", fontWeight: "bold" }}>
                    {/* TODO: Get actual subscription status from backend */}
                    Free Plan
                  </p>
                </nav>
                <aside>
                  <p>Current Plan:</p>
                  <h6>Basic</h6>
                </aside>
                <aside>
                  <p>Unlocked Contacts:</p>
                  <h6>0</h6> {/* TODO: Get from backend */}
                </aside>
                <Link to="/Subcription">
                  <button>Upgrade Subscription</button>
                </Link>
              </aside>

              <nav>
                <h3>Quick Links</h3>
                <nav>
                  <nav>
                    <Link to="/Unlockedcontact">
                      <i className="fa-regular fa-address-book"></i>My Unlocked Contacts
                    </Link>
                    <h6>View contact of craftsmen you've unlocked</h6>
                  </nav>
                  <nav>
                    <Link to="/Subcription">
                      <i className="fa-solid fa-subscript"></i>Manage Subscription
                    </Link>
                    <h6>Update your plan, view invoices, or cancel.</h6>
                  </nav>
                  <nav>
                    <Link to="/Review">
                      <i className="fa-regular fa-star" id="fastar"></i>My Reviews
                    </Link>
                    <h6>See and manage reviews you've submitted.</h6>
                  </nav>
                  <nav>
                    <Link to="/Browsecraft">
                      <i className="fa-solid fa-search"></i>Find Craftsmen
                    </Link>
                    <h6>Browse and search for verified artisans.</h6>
                  </nav>
                  <nav>
                    <Link to="/Profiledetails">
                      <i className="fa-solid fa-search"></i>Edit details
                    </Link>
                    <h6>You can edit your profile details here.</h6>
                  </nav>
                </nav>
              </nav>
            </>
          )}

        
          {isArtisan && artisanProfile && (
            <>
              <aside>
                <nav>
                  <h5>Verification Status</h5>
                  <p
                    style={{
                      color: userProfile.isVerified ? "#28a745" : "#ffc107",
                      fontWeight: "bold",
                    }}
                  >
                    {userProfile.isVerified ? "Verified" : "Pending Verification"}
                  </p>
                </nav>
                <aside>
                  <p>Craft Type:</p>
                  <h6>{artisanProfile.craftType}</h6>
                </aside>
                <aside>
                  <p>Rating:</p>
                  <h6>
                    {artisanProfile.rating.toFixed(1)} ⭐ ({artisanProfile.numberOfReviews} reviews)
                  </h6>
                </aside>
                <Link to="/Profiledetails">
                  <button>Edit Profile</button>
                </Link>
              </aside>

              {!userProfile.isVerified && (
                <div
                  style={{
                    backgroundColor: "#fff3cd",
                    padding: "20px",
                    borderRadius: "8px",
                    margin: "20px 0",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                     Your profile is pending admin verification
                  </p>
                  <p>
                    Once verified, your profile will be visible to clients searching for craftsmen.
                  </p>
                </div>
              )}

              <nav>
                <h3>Profile Summary</h3>
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                >
                  <p>
                    <strong>Location:</strong> {artisanProfile.location}
                  </p>
                  <p>
                    <strong>Experience:</strong> {artisanProfile.experience} years
                  </p>
                  <p>
                    <strong>Skills:</strong>{" "}
                    {artisanProfile.skills && artisanProfile.skills.length > 0
                      ? artisanProfile.skills.join(", ")
                      : "No skills listed"}
                  </p>
                  <p>
                    <strong>Bio:</strong>{" "}
                    {artisanProfile.bio || "No bio added yet"}
                  </p>
                </div>
              </nav>

              <nav>
                <h3>Quick Actions</h3>
                <nav>
                  <nav>
                    <Link to="/Profiledetails">
                      <i className="fa-regular fa-user"></i>Edit Profile
                    </Link>
                    <h6>Update your information, skills, and portfolio</h6>
                  </nav>
                  <nav>
                    <Link to="/Browsecraft">
                      <i className="fa-solid fa-users"></i>View Other Craftsmen
                    </Link>
                    <h6>See other verified artisans in the platform</h6>
                  </nav>
                  <nav>
                    <Link to={`/Publicprofile?id=${artisanProfile._id}`}>
                      <i className="fa-solid fa-eye"></i>View My Public Profile
                    </Link>
                    <h6>See how clients view your profile</h6>
                  </nav>
                </nav>
              </nav>
            </>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Userdashboard;