import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllVerifiedArtisans } from '../services/api';
import '../styles/home.css';
import logo from "../images/logo.png";
import profilepic from "../images/profilepics.png";
import { getProfilePictureUrl } from "../utils/imageHelper";
import { Link } from 'react-router-dom';
import Footer from './footer';
import hamburger from "../images/icon-hamburger.svg";
import close from "../images/icon-close.svg";

function Homepage() {
  const navigate = useNavigate();
  const [featuredArtisans, setFeaturedArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFeaturedArtisans();
  }, []);

  const fetchFeaturedArtisans = async () => {
    try {
      setLoading(true);
      const data = await getAllVerifiedArtisans();
      setFeaturedArtisans(data.slice(0, 6));
    } catch (error) {
      console.error("Error fetching artisans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/Browsecraftsmen?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/Browsecraftsmen');
    }
  };

  function Hamburger() {
    document.querySelector("#hamburger").style.display = "none";
    document.querySelector("#summary").style.display = "flex";
    const closeBtn = document.querySelector("#close");

    closeBtn.onclick = function(){
        document.querySelector("#summary").style.display = "none";
        document.querySelector("#hamburger").style.display = "block";
    }
  }

  return (
    <div className="Home">
      <header>
        <section>
          <div>
            <img src={logo} alt="logoimg" />
            <nav>
                <Link to="/" id='home'>Home</Link>
                <Link to="/Browsecraftsmen">Browse Craftsmen</Link>
            </nav>
          </div>
          <section>
            <Link to="/Login" ><button>Login</button></Link>
            <Link to="/Registernow"><button>Register</button></Link>
            <img src={hamburger} onClick={Hamburger} id='hamburger' alt="hamburgerimg" />
          </section>
          <summary id='summary'>
            <img src={close} alt="closeimg" id='close' />
            <Link to="/">Home</Link>
            <Link to="/Browsecraftsmen">Browse Craftsmen</Link>
            <Link to="/Login"><button>Login</button></Link>
            <Link to="/Registernow"><button>Register</button></Link>
          </summary>
        </section>
      </header>

      <section>
        <div>
          <h1>Find Your Skilled Artisan Today</h1>
          <p>Connect with verified carpenter, electricians, plumbers, and more for all your home and business needs.</p>
          <form onSubmit={handleSearch}>
            <nav>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input 
                type="search" 
                placeholder='Search for artisans'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" style={{ display: 'none' }}>Search</button>
            </nav>
          </form>
          <aside>
            <Link to="/Browsecraftsmen"><button>Browse Craftsmen</button></Link>
            <Link to="/Registernow"><button>Register Now</button></Link>
          </aside>
        </div>
      </section>

      <aside>
        <h1>Top Service Categories</h1>
        <aside>
          <nav>
            <i className="fa-solid fa-hammer"></i>
            <p>Carpentry</p>
          </nav>
          <nav>
            <i className="fa-solid fa-wrench"></i>
            <p>Plumbing</p>
          </nav>
          <nav>
            <i className="fa-solid fa-fire"></i>
            <p>Electrician</p>
          </nav>
          <nav>
            <i className="fa-solid fa-paint-roller"></i>
            <p>Painting</p>
          </nav>
        </aside>
        <aside>
          <nav>
            <i className="fa-solid fa-car-burst"></i>
            <p>Mechanic</p>
          </nav>
          <nav>
            <i className="fa-solid fa-utensils"></i>
            <p>Cooking</p>
          </nav>
          <nav>
            <i className="fa-solid fa-gem"></i>
            <p>Jewelry</p>
          </nav>
          <nav>
            <i className="fa-solid fa-shield-halved"></i>
            <p>Security</p>
          </nav>
        </aside>
      </aside>

      <main>
        <h1>Meet Our Featured Craftsmen</h1>
        
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading featured craftsmen...
          </p>
        ) : featuredArtisans.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No craftsmen available yet. Check back soon!
          </p>
        ) : (
          <>
            <aside>
              {featuredArtisans.slice(0, 3).map((artisan) => (
                <nav key={artisan._id}>
                  <img 
                    src={getProfilePictureUrl(artisan.userId?.profilePicture, profilepic)} 
                    alt={artisan.userId?.name}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  />
                  <nav>
                    <h3>{artisan.userId?.name || "Unknown"}</h3>
                    <h6>{artisan.craftType}</h6>
                    <p>
                      <i className="fa-solid fa-location-dot"></i>
                      {artisan.location}
                    </p>
                    <h5>
                      <i className="fa-regular fa-star"></i>
                      {artisan.rating.toFixed(1)} Rating ({artisan.numberOfReviews} reviews)
                    </h5>
                  </nav>
                  <Link to="/Login"><button>View Profile</button></Link>
                </nav>
              ))}
            </aside>

            {featuredArtisans.length > 3 && (
              <aside>
                {featuredArtisans.slice(3, 6).map((artisan) => (
                  <nav key={artisan._id}>
                    <img 
                      src={getProfilePictureUrl(artisan.userId?.profilePicture, profilepic)} 
                      alt={artisan.userId?.name}
                      style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    />
                    <nav>
                      <h3>{artisan.userId?.name || "Unknown"}</h3>
                      <h6>{artisan.craftType}</h6>
                      <p>
                        <i className="fa-solid fa-location-dot"></i>
                        {artisan.location}
                      </p>
                      <h5>
                        <i className="fa-regular fa-star"></i>
                        {artisan.rating.toFixed(1)} Rating ({artisan.numberOfReviews} reviews)
                      </h5>
                    </nav>
                    <Link to="/Login"><button>View Profile</button></Link>
                  </nav>
                ))}
              </aside>
            )}
          </>
        )}
      </main>

      <summary>
        <aside>
          <h1>Ready to find the perfect craftsman?</h1>
          <p>Explore a wide range of services or join our platform to offer your unique skills to a thriving community</p>
          <nav>
            <Link to="/Browsecraftsmen"><button>Browse All Craftsman</button></Link>
            <Link to="/Registernow"><button>Join CraftsmanGig</button></Link>
          </nav>
        </aside>
      </summary>

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
      <Footer/>
    </div>
  );
}

export default Homepage;