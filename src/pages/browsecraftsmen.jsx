import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllVerifiedArtisans } from "../services/api";
import "../styles/browsecraftsmen.css";
import logo from "../images/logo.png";
import profilepic from "../images/profilepics.png";
import hamburger from "../images/icon-hamburger.svg";
import close from "../images/icon-close.svg";
import { getProfilePictureUrl } from "../utils/imageHelper";
import Footer from "./footer";

function Browsecraftsmen() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArtisans();
  }, []);

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

  function Hamburger() {
    document.querySelector("#hamburger").style.display = "none";
    document.querySelector("#summary").style.display = "flex";
    const closeBtn = document.querySelector("#close");

    closeBtn.onclick = function () {
      document.querySelector("#summary").style.display = "none";
      document.querySelector("#hamburger").style.display = "block";
    };
  }

  return (
    <div className="browsecraftsmen">
      <header>
        <section>
          <div>
            <img src={logo} alt="logoimg" />
            <nav>
              <Link to="/">Home</Link>
              <Link to="/Browsecraftsmen">Browse Craftsmen</Link>
            </nav>
          </div>
          <section>
            <Link to="/Login"><button>Login</button></Link>
            <Link to="/Registernow"><button>Register</button></Link>
            <img src={hamburger} onClick={Hamburger} id="hamburger" alt="hamburgerimg" />
          </section>
          <summary id="summary">
            <img src={close} alt="closeimg" id="close" />
            <Link to="/">Home</Link>
            <Link to="/Browsecraftsmen">Browse Craftsmen</Link>
            <Link to="/Login"><button>Login</button></Link>
            <Link to="/Registernow"><button>Register</button></Link>
          </summary>
        </section>
      </header>

      <main>
        <div>
          <div>
            <div>
              <p>Browse our verified artisans below</p>
              <p>
                <Link to="/Registernow"> Register</Link>{" "}
                or{" "}
                <Link to="/Login">Login</Link>{" "}
                to view full profiles and contact artisans
              </p>
            </div>

           
            {/* <nav>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="search" placeholder="Login to search for craftsmen..." disabled />
            </nav> */}

         
            {loading && (
              <p style={{ textAlign: "center", marginTop: "20px" }}>Loading artisans...</p>
            )}

            {error && (
              <p style={{ textAlign: "center", color: "red", marginTop: "20px" }}>{error}</p>
            )}

            {!loading && !error && artisans.length === 0 && (
              <p style={{ textAlign: "center", marginTop: "20px" }}>No verified artisans found. Please check back later.</p>
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
                      <p><i className="fa-solid fa-location-dot"></i>{artisan.location}</p>
                      <p><i className="fa-regular fa-star" id="fastar"></i>{artisan.rating.toFixed(1)} ({artisan.numberOfReviews} reviews)</p>
                      <p><i className="fa-solid fa-hammer"></i>{artisan.experience} Years Experience</p>
                    </aside>
    
                    <Link to="/Login"><button>Login to View Profile</button></Link>
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
            <p><i className="fa-solid fa-location-dot"></i>123 artisan ave, Craftsville, CA 90210</p>
          </aside>
        </aside>
      </nav>
      <Footer />
    </div>
  );
}

export default Browsecraftsmen;