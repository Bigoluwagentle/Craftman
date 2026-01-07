import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { getArtisanById, getArtisanReviews, createReview, unlockContact, checkIfUnlocked } from "../services/api";
import Swal from 'sweetalert2';
import "../styles/publicprofile.css";
import logo from "../images/logoimage.png";
import profilepic from "../images/profilepics.png";
import hamburger from "../images/icon-hamburger.svg";
import close from "../images/icon-close.svg";
import { getProfilePictureUrl } from "../utils/imageHelper";
import Footer from "./footer";

function Publicprofile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const artisanId = searchParams.get("id");

  const [artisan, setArtisan] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  // ✅ FIX: Use state for user instead of const
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const isLoggedIn = !!localStorage.getItem("token");
  const isClient = user?.role === "client";

  const hasSubscription = user?.subscription?.status === "active" || false;

  // ✅ FIX: Add storage event listener BEFORE other useEffects
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
    };

    window.addEventListener('profilePictureUpdated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('profilePictureUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (artisanId) {
        try {
          setLoading(true);
          const [artisanData, reviewsData] = await Promise.all([
            getArtisanById(artisanId),
            getArtisanReviews(artisanId),
          ]);
          setArtisan(artisanData);
          setReviews(reviewsData);
          setError("");
        } catch (err) {
          setError(err.response?.data?.message || "Failed to load artisan profile");
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setError("No artisan ID provided");
        setLoading(false);
      }
    };

    fetchData();
  }, [artisanId]);

  useEffect(() => {
    const checkUnlockStatus = async () => {
      if (isClient && artisanId && isLoggedIn) {
        try {
          const result = await checkIfUnlocked(artisanId);
          setIsUnlocked(result.isUnlocked);
        } catch (err) {
          console.error("Error checking unlock status:", err);
        }
      }
    };

    if (artisan) {
      checkUnlockStatus();
    }
  }, [isClient, artisanId, artisan, isLoggedIn]);

  const handleSubscribe = () => {
    if (!isLoggedIn) {
      navigate("/Login");
    } else {
      navigate("/Subcription");
    }
  };

  const handleUnlockContact = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to unlock contacts',
        confirmButtonColor: '#3b82f6'
      });
      navigate("/Login");
      return;
    }

    if (!isClient) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Only clients can unlock contacts',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    if (!hasSubscription) {
      Swal.fire({
        icon: 'info',
        title: 'Subscription Required',
        text: 'Please subscribe to unlock contacts',
        confirmButtonColor: '#3b82f6',
        showCancelButton: true,
        confirmButtonText: 'Subscribe Now',
        cancelButtonText: 'Maybe Later'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/Subcription");
        }
      });
      return;
    }

    try {
      setUnlocking(true);
      const response = await unlockContact(artisan._id);
      
      Swal.fire({
        icon: 'success',
        title: 'Contact Unlocked!',
        text: `${response.message} (${response.remainingContacts} contacts remaining)`,
        confirmButtonColor: '#3b82f6',
        timer: 3000
      });
      
      setIsUnlocked(true);

      const updatedUser = JSON.parse(localStorage.getItem("user"));
      updatedUser.subscription.unlockedContacts = response.remainingContacts;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // ✅ Update local user state as well
      setUser(updatedUser);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Unlock',
        text: err.response?.data?.message || 'Failed to unlock contact',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setUnlocking(false);
    }
  };

  const handleReviewChange = (e) => {
    setReviewForm({
      ...reviewForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to submit a review',
        confirmButtonColor: '#3b82f6'
      });
      navigate("/Login");
      return;
    }

    if (!isClient) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Only clients can submit reviews',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    if (!reviewForm.comment.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Review Required',
        text: 'Please enter a review comment',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    try {
      setSubmittingReview(true);

      await createReview({
        artisanId: artisan._id,
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment,
      });

      Swal.fire({
        icon: 'success',
        title: 'Review Submitted!',
        text: 'Your review has been posted successfully',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      });

      const reviewsData = await getArtisanReviews(artisanId);
      setReviews(reviewsData);

      const artisanData = await getArtisanById(artisanId);
      setArtisan(artisanData);

      setReviewForm({ rating: 5, comment: "" });
      setShowReviewForm(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.response?.data?.message || 'Failed to submit review',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setSubmittingReview(false);
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/Login");
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fa-solid fa-star" style={{ color: "#ffc107" }}></i>);
      } else {
        stars.push(<i key={i} className="fa-regular fa-star" style={{ color: "#ffc107" }}></i>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="publicprofile">
        <p style={{ textAlign: "center", marginTop: "50px" }}>Loading artisan profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="publicprofile">
        <p style={{ textAlign: "center", color: "red", marginTop: "50px" }}>{error}</p>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={() => navigate("/Browsecraft")}>Back to Browse</button>
        </div>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="publicprofile">
        <p style={{ textAlign: "center", marginTop: "50px" }}>Artisan not found</p>
      </div>
    );
  }

  const hasReviewed = reviews.some((review) => review.clientId?._id === user?._id);

  return (
    <div className="publicprofile">
      <header>
        <section>
          <div>
            <aside>
              <i className="fa-solid fa-hammer"></i>
              <img src={logo} alt="logoimg" />
            </aside>

            <nav>
              <Link to={isLoggedIn ? "/Browsecraft" : "/Browsecraftsmen"}>Browse Craftsmen</Link>
            </nav>
          </div>
          <section>
            {isLoggedIn ? (
              <>
                <span style={{ marginRight: "10px" }}>Welcome, {user?.name}</span>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/Login"><button>Login</button></Link>
                <Link to="/Registernow"><button>Register</button></Link>
              </>
            )}
            <img src={hamburger} id="hamburger" onClick={Hamburger} alt="hamburgerimg" />
          </section>
          <summary id="summary">
            <img src={close} alt="closeimg" id="close" />
            <Link to="/Userdashboard">Dashboard</Link>
            <Link to={isLoggedIn ? "/Browsecraft" : "/Browsecraftsmen"}>Browse Craftsmen</Link>
            {isLoggedIn ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Link to="/Login"><button>Login</button></Link>
                <Link to="/Registernow"><button>Register</button></Link>
              </>
            )}
          </summary>
        </section>
      </header>

      <main>
        <div>
          <div>
            <img src={getProfilePictureUrl(artisan.userId?.profilePicture, profilepic)} alt="profilepicimg" style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }} />
            <nav>
              <h3>{artisan.userId?.name}</h3>
              <p>Expert {artisan.craftType}</p>
              <p><i className="fa-solid fa-location-dot"></i>{artisan.location}</p>
              <p><i className="fa-regular fa-star" id="fastar"></i>{artisan.rating.toFixed(1)} rating ({artisan.numberOfReviews} reviews)</p>
              <h6>{artisan.experience}+ Years Experience</h6>
            </nav>
          </div>

          <aside>
            <h2>About {artisan.userId?.name?.split(" ")[0]}</h2>
            <p>{artisan.bio || `With over ${artisan.experience} years of experience in ${artisan.craftType.toLowerCase()}, I specialize in providing quality services. I pride myself on communication, timely project completion, and exceeding client expectations.`}</p>

            {artisan.skills && artisan.skills.length > 0 && (
              <div>
                <h3>Skills</h3>
                <div>
                  {artisan.skills.map((skill, index) => (
                    <span key={index}>{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <nav>
            <h2>Contact Details</h2>
            {isUnlocked ? (
              <nav>
                <p><i className="fa-solid fa-envelope"></i> Email: {artisan.userId?.email}</p>
                <p><i className="fa-solid fa-phone"></i> Phone: {artisan.userId?.phone}</p>
                <p style={{ color: "#28a745", marginTop: "10px", fontWeight: "bold" }}>✓ Contact unlocked</p>
              </nav>
            ) : (
              <nav>
                <i className="fa-solid fa-lock" style={{ fontSize: "40px", color: "#856404" }}></i>
                <p style={{ marginTop: "10px", fontWeight: "bold" }}>Contact details are locked</p>
                <p style={{ marginBottom: "15px" }}>
                  {hasSubscription
                    ? "Use your subscription to unlock this contact"
                    : "Subscribe to unlock contact information"}
                </p>
                {hasSubscription ? (
                  <>
                    <p style={{ marginBottom: "10px", color: "#666" }}>
                      Available unlocks: {user?.subscription?.unlockedContacts || 0}
                    </p>
                    <button onClick={handleUnlockContact} disabled={unlocking || (user?.subscription?.unlockedContacts || 0) === 0} style={{ padding: "10px 30px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: unlocking || (user?.subscription?.unlockedContacts || 0) === 0 ? "not-allowed" : "pointer", fontSize: "16px", opacity: unlocking || (user?.subscription?.unlockedContacts || 0) === 0 ? 0.6 : 1 }}>{unlocking ? "Unlocking..." : "Unlock Contact (1 credit)"}</button>
                    {(user?.subscription?.unlockedContacts || 0) === 0 && (
                      <p style={{ marginTop: "10px", color: "#dc3545", fontSize: "14px" }}>No unlocks remaining. <Link to="/Subcription" style={{ color: "#007bff" }}>Upgrade plan</Link> </p>
                    )}
                  </>
                ) : (
                  <button onClick={handleSubscribe} style={{ padding: "10px 30px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" }}>Subscribe Now</button>
                )}
              </nav>
            )}
          </nav>

          {artisan.portfolioImages && artisan.portfolioImages.length > 0 && (
            <section style={{ marginTop: "30px" }}>
              <h2>Portfolio</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px", marginTop: "20px" }}>
                {artisan.portfolioImages.map((image, index) => (
                  <img key={index} src={image} alt={`Portfolio ${index + 1}`} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }} />
                ))}
              </div>
            </section>
          )}

          <section style={{ marginTop: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>Reviews ({reviews.length})</h2>
              {isClient && !hasReviewed && (
                <button onClick={() => setShowReviewForm(!showReviewForm)} style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>{showReviewForm ? "Cancel" : "Write a Review"}</button>
              )}
            </div>

            {showReviewForm && isClient && (
              <form onSubmit={handleSubmitReview} style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
                <h3>Submit Your Review</h3>
                <div style={{ marginTop: "15px" }}>
                  <label htmlFor="rating" style={{ display: "block", marginBottom: "5px" }}> Rating</label>
                  <select name="rating" value={reviewForm.rating} onChange={handleReviewChange} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}>
                    <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 stars)</option>
                    <option value="3">⭐⭐⭐ (3 stars)</option>
                    <option value="2">⭐⭐ (2 stars)</option>
                    <option value="1">⭐ (1 star)</option>
                  </select>
                </div>
                <div style={{ marginTop: "15px" }}>
                  <label htmlFor="comment" style={{ display: "block", marginBottom: "5px" }}>Your Review</label>
                  <textarea name="comment" placeholder="Describe your experience with this artisan..." value={reviewForm.comment} onChange={handleReviewChange} required rows="4" style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
                </div>
                <button type="submit" disabled={submittingReview} style={{ marginTop: "15px", padding: "10px 30px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: submittingReview ? "not-allowed" : "pointer" }}>{submittingReview ? "Submitting..." : "Submit Review"}</button>
              </form>
            )}

            {hasReviewed && isClient && (
              <p style={{ color: "#28a745", marginTop: "10px" }}>✓ You have already reviewed this artisan</p>
            )}

            {reviews.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666", marginTop: "20px" }}>No reviews yet. Be the first to review this artisan!</p>
            ) : (
              <div style={{ marginTop: "20px" }}>
                {reviews.map((review) => (
                  <section key={review._id} style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                    <nav style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                      <img src={getProfilePictureUrl(review.clientId?.profilePicture, profilepic)} alt="profilepicimg" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} />
                      <nav style={{ marginLeft: "10px" }}>
                        <h5 style={{ margin: 0 }}>{review.clientId?.name || "Anonymous"}</h5>
                        <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>{new Date(review.createdAt).toLocaleDateString()}</p>
                      </nav>
                    </nav>
                    <div style={{ marginBottom: "10px" }}>{renderStars(review.rating)}</div>
                    <p>{review.comment}</p>
                  </section>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <nav>
        <aside>
          <nav>
            <aside>
              <i className="fa-solid fa-hammer"></i>
              <img src={logo} alt="logoimg" />
            </aside>
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
            <p>
              <i className="fa-solid fa-location-dot"></i>123 artisan ave, Craftsville, CA 90210
            </p>
          </aside>
        </aside>
      </nav>
      <Footer />
    </div>
  );
}

export default Publicprofile;