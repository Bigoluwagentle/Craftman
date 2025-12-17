import '../styles/home.css';
import logo from "../images/logo.png";
import carpenter from "../images/carpenter.jpg";
import electrician from "../images/electrician.jpg";
import interiorpainter from "../images/interiorpainter.jpg";
import potterypainting from "../images/potterypainting.jpg";
import plumber from "../images/plumber.jpg";
import skillmason from "../images/skillmason.jpg";
import { Link } from 'react-router-dom';
import Footer from './footer';
import hamburger from "../images/icon-hamburger.svg";
import close from "../images/icon-close.svg";

function Homepage() {

  function Hamburger() {
    document.querySelector("#hamburger").style.display = "none";
    document.querySelector("#summary").style.display = "flex";
    const close = document.querySelector("#close");

    close.onclick = function(){
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
          <nav>
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="search" placeholder='Search for artisans, craft or location'/>
          </nav>
          <aside>
            <Link to="/Browsecraftsmen"><button>Browse Craftsmen</button></Link>
            <Link to="Registernow"><button>Register Now</button></Link>
          </aside>
        </div>
      </section>

      <aside>
        <h1>Top Service Categories</h1>
        <aside>
          <nav>
            <i class="fa-solid fa-hammer"></i>
            <p>Carpentry</p>
          </nav>
          <nav>
            <i class="fa-solid fa-wrench"></i>
            <p>Plumbing</p>
          </nav>
          <nav>
            <i class="fa-solid fa-fire"></i>
            <p>Electrician</p>
          </nav>
          <nav>
            <i class="fa-solid fa-paint-roller"></i>
            <p>Painting</p>
          </nav>
        </aside>
        <aside>
          <nav>
            <i class="fa-solid fa-car-burst"></i>
            <p>Mechanic</p>
          </nav>
          <nav>
            <i class="fa-solid fa-utensils"></i>
            <p>Cooking</p>
          </nav>
          <nav>
            <i class="fa-solid fa-gem"></i>
            <p>Jewelry</p>
          </nav>
          <nav>
            <i class="fa-solid fa-shield-halved"></i>
            <p>Security</p>
          </nav>
        </aside>
      </aside>

      <main>
        <h1>Meet Our Featured Craftsmen</h1>
        <aside>
          <nav>
            <img src={carpenter} alt="carpenterimg" />
            <nav>
              <h3>John Hammer</h3>
              <h6>Master Carpenter</h6>
              <p><i class="fa-solid fa-location-dot"></i>San Francisco, CA</p>
              <h5><i class="fa-regular fa-star"></i>4.9 Rating</h5>
            </nav>
            <Link to="/Login"><button>View Profile</button></Link>
          </nav>
          <nav>
            <img src={plumber} alt="plumberimg" />
            <nav>
              <h3>Matia Wren</h3>
              <h6>Certified Plumber</h6>
              <p><i class="fa-solid fa-location-dot"></i>Los Angeles, CA</p>
              <h5><i class="fa-regular fa-star"></i>4.8 Rating</h5>
            </nav>
            <Link to="/Login"><button>View Profile</button></Link>
          </nav>
          <nav>
            <img src={electrician} alt="electricianimg" />
            <nav>
              <h3>David Spark</h3>
              <h6>Expert Electrician</h6>
              <p><i class="fa-solid fa-location-dot"></i>Seattle, WA</p>
              <h5><i class="fa-regular fa-star"></i>4.7 Rating</h5>
            </nav>
            <Link to="/Login"><button>View Profile</button></Link>
          </nav>
        </aside>
        <aside>
          <nav>
            <img src={interiorpainter} alt="interiorpaintingimg" />
            <nav>
              <h3>Sophia Brush</h3>
              <h6>Interior Painter</h6>
              <p><i class="fa-solid fa-location-dot"></i>Portland, OR</p>
              <h5><i class="fa-regular fa-star"></i>4.9 Rating</h5>
            </nav>
            <Link to="/Login"><button>View Profile</button></Link>
          </nav>
          <nav>
            <img src={skillmason} alt="skillmasonimg" />
            <nav>
              <h3>Robert Stone</h3>
              <h6>Skilled Mason</h6>
              <p><i class="fa-solid fa-location-dot"></i>Denver, CO</p>
              <h5><i class="fa-regular fa-star"></i>4.6 Rating</h5>
            </nav>
            <Link to="/Login"><button>View Profile</button></Link>
          </nav>
          <nav>
            <img src={potterypainting} alt="potteryoaintingimg" />
            <nav>
              <h3>Emily Clay</h3>
              <h6>Pottery Artist</h6>
              <p><i class="fa-solid fa-location-dot"></i>Austin, TX</p>
              <h5><i class="fa-regular fa-star"></i>4.9 Rating</h5>
            </nav>
            <Link to="/Login"><button>View Profile</button></Link>
          </nav>
        </aside>
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
              <i class="fa-brands fa-facebook-f"></i>
              <i class="fa-brands fa-twitter"></i>
              <i class="fa-brands fa-linkedin-in"></i>
              <i class="fa-brands fa-instagram"></i>
            </nav>
          </nav>
          <aside>
            <h4>Company</h4>
            <p>About Us</p>
            <p>Contact</p>
            <p>FAQs</p>
          </aside>
          <aside>
            <h4>Resourses</h4>
            <p>Terms of Service</p>
            <p>Privacy Policy</p>
            <p>Our Service</p>
          </aside>
          <aside>
            <h4>Contact Us</h4>
            <p>Olayiwolaolabode06@gmail.com</p>
            <p>+234 706 050 3032</p>
            <p><i class="fa-solid fa-location-dot"></i>123 artisan ave, Craftsville, CA 90210</p>
          </aside>
        </aside>
      </nav>
      <Footer/>
    </div>
  );
}

export default Homepage;