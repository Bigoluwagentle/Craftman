import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyUnlockedContacts } from "../services/api";
import "../styles/unlockedcontact.css";
import close from "../images/icon-close.svg";
import logo from "../images/logo.png";
import profilepic from "../images/profilepics.png";
import hamburger from "../images/icon-hamburger.svg";
import { getProfilePictureUrl } from "../utils/imageHelper";
import Footer from "./footer";

function Unlockedcontact() {
  const navigate = useNavigate();
  const [unlockedContacts, setUnlockedContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = !!localStorage.getItem("token");

    if (!isLoggedIn) {
      navigate("/Login");
      return;
    }

    if (user?.role !== "client") {
      alert("Only clients can view unlocked contacts");
      navigate("/Userdashboard");
      return;
    }

    fetchUnlockedContacts();
  }, [navigate]);

  const fetchUnlockedContacts = async () => {
    try {
      setLoading(true);
      const data = await getMyUnlockedContacts();
      setUnlockedContacts(data);
      setError("");
    } catch (err) {
      setError("Failed to load unlocked contacts");
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
        <p>Loading unlocked contacts...</p>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="unlockedcontact">
      <div>
        <section>
          <header>
            <section>
              <img src={hamburger} id="hamburger" onClick={Hamburger} alt="hamburgerimg" />
              <div>
                <img src={logo} alt="logoimg" />
                <nav>
                  {/* <Link to="/Userdashboard">Dashboard</Link> */}
                  <Link to="/Browsecraft">Browse Craftsmen</Link>
                </nav>
              </div>
              <section>
                <span>{user?.name}</span>
                <button onClick={handleLogout}>Logout</button>
                <Link><img src={getProfilePictureUrl(user?.profilePicture, profilepic)}  alt="profilepicimg" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}/></Link>
              </section>
              <summary id="summar">
                <img src={close} alt="closeimg" id="close" />
                <Link to="/Userdashboard">Dashboard</Link>
                <Link to="/Browsecraft">Browse Craftsmen</Link>
                <Link to="/Unlockedcontact"><button>My Unlocked Contact</button></Link>
                <Link to="/Subcription"><button>Subscription</button></Link>
                <Link to="/Review"><button>My Reviews</button></Link>
                <button onClick={handleLogout}>Logout</button>
              </summary>
            </section>
          </header>

          <main>
            <h1>My Unlocked Craftsmen</h1>

            {error && (
              <div
                style={{
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  padding: "15px",
                  borderRadius: "4px",
                  marginBottom: "20px",
                }}
              >
                {error}
              </div>
            )}

            {unlockedContacts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <h3>No Unlocked Contacts Yet</h3>
                <p style={{ color: "#666", marginTop: "10px" }}>
                  You haven't unlocked any craftsmen contacts yet. Browse craftsmen and unlock their
                  contact details.
                </p>
                <Link to="/Browsecraft">
                  <button
                    style={{
                      marginTop: "20px",
                      padding: "10px 30px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Browse Craftsmen
                  </button>
                </Link>
              </div>
            ) : (
              <table>
                <nav>
                  <h6>Craftsman Name</h6>
                  <h6>Craft</h6>
                  <h6>Email</h6>
                  <h6>Phone</h6>
                  <h6>Unlocked Date</h6>
                  <h6>Action</h6>
                </nav>
                {unlockedContacts.map((contact) => (
                  <aside key={contact._id}>
                    <aside>
                      <img src={getProfilePictureUrl(contact.artisanId?.userId?.profilePicture, profilepic)}  alt="profilepicimg" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}/>
                      <p>{contact.artisanId?.userId?.name || "Unknown"}</p>
                    </aside>
                    <p>{contact.artisanId?.craftType || "N/A"}</p>
                    <h6>
                      <i className="fa-regular fa-envelope"></i>
                      {contact.artisanId?.userId?.email || "N/A"}
                    </h6>
                    <h6>
                      <i className="fa-solid fa-phone"></i>
                      {contact.artisanId?.userId?.phone || "N/A"}
                    </h6>
                    <p>{new Date(contact.unlockedAt).toLocaleDateString()}</p>
                    <nav>
                      <Link to={`/Publicprofile?id=${contact.artisanId?._id}`}>View Profile</Link>
                      <Link>
                        <button
                          onClick={() => {
                            window.location.href = `mailto:${contact.artisanId?.userId?.email}`;
                          }}
                        >
                          Contact Now
                        </button>
                      </Link>
                    </nav>
                  </aside>
                ))}
              </table>
            )}
          </main>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Unlockedcontact;