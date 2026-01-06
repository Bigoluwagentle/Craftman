import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyReviews, deleteReview } from "../services/api";
import Swal from 'sweetalert2';
import "../styles/review.css";
import close from "../images/icon-close.svg";
import hamburger from "../images/icon-hamburger.svg";
import logo from "../images/logo.png";
import profilepic from "../images/profilepics.png";
import { getProfilePictureUrl } from "../utils/imageHelper";
import Footer from "./footer.jsx";

function Review() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = !!localStorage.getItem("token");

    if (!isLoggedIn) {
      navigate("/Login");
      return;
    }

    if (user?.role !== "client") {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'Only clients can view reviews',
        confirmButtonColor: '#3b82f6'
      }).then(() => {
        navigate("/Userdashboard");
      });
      return;
    }

    fetchMyReviews();
  }, [navigate]);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const data = await getMyReviews();
      setReviews(data);
      setError("");
    } catch (err) {
      setError("Failed to load reviews");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const result = await Swal.fire({
      title: 'Delete Review?',
      text: "Are you sure you want to delete this review? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(reviewId);
      await deleteReview(reviewId);
      
      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Review deleted successfully',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      });
      
      fetchMyReviews();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: err.response?.data?.message || err.message,
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setDeletingId(null);
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
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Loading your reviews...</p>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="review">
      <div>
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
                <span style={{ marginRight: "10px", fontWeight: "bold" }}>{user?.name}</span>
                <button onClick={handleLogout}>Logout</button>
                <Link to="/Userdashboard"><img src={getProfilePictureUrl(user?.profilePicture, profilepic)}  alt="profilepicimg" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}/></Link>
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
            <h1>My Reviews</h1>

            {error && (
              <div style={{backgroundColor: "#f8d7da",color: "#721c24",padding: "15px",borderRadius: "4px",marginBottom: "20px"}}>
                {error}
              </div>
            )}

            {reviews.length === 0 ? (
              <section>
                <nav>
                  <nav style={{ textAlign: "center", padding: "40px" }}>
                    <h3>No Reviews Yet</h3>
                    <p style={{ color: "#666", marginTop: "10px" }}>You haven't submitted any reviews yet. Browse craftsmen and leave reviews after using their services.</p>
                    <Link to="/Browsecraft"><button style={{ marginTop: "20px", padding: "10px 30px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer"}}>Browse Craftsmen</button></Link>
                  </nav>
                </nav>
              </section>
            ) : (
              <section style={{ marginTop: "20px" }}>
                {reviews.map((review) => (
                  <div key={review._id} style={{ backgroundColor: "#f8f9fa", padding: "20px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #dee2e6"}}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start"}}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ marginBottom: "10px" }}>
                          {review.artisanId?.userId?.name || "Unknown Artisan"}
                        </h3>
                        <div style={{ marginBottom: "10px" }}>{renderStars(review.rating)}</div>
                        <p style={{ color: "#666", marginBottom: "10px" }}>{review.comment}</p>
                        <p style={{ fontSize: "14px", color: "#999" }}>Submitted on: {new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div style={{ display: "flex", gap: "10px", marginLeft: "20px" }}>
                        <Link to={`/Publicprofile?id=${review.artisanId?._id}`} style={{ padding: "8px 15px", backgroundColor: "#007bff", color: "white", textDecoration: "none", borderRadius: "4px", fontSize: "14px"}}>View Profile</Link>
                        <button onClick={() => handleDeleteReview(review._id)} disabled={deletingId === review._id} style={{ padding: "8px 15px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px",cursor: deletingId === review._id ? "not-allowed" : "pointer", fontSize: "14px",}}>{deletingId === review._id ? "Deleting..." : "Delete"}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            <section style={{ marginTop: "40px" }}>
              <nav>
                <nav>
                  <h3>Want to Leave a Review?</h3>
                  <p>Visit a craftsman's profile page to submit a review after using their services.</p>
                  <Link to="/Browsecraft"><button style={{ marginTop: "15px", padding: "10px 30px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer"}}>Browse Craftsmen</button></Link>
                </nav>
              </nav>
            </section>
          </main>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Review;