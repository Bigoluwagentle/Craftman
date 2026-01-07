import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserProfile, getArtisanProfile, updateArtisanProfile, uploadProfilePicture, deleteProfilePicture } from "../services/api";
import Swal from 'sweetalert2';
import "../styles/profiledetails.css";
import close from "../images/icon-close.svg";
import hamburger from "../images/icon-hamburger.svg";
import logo from "../images/logo.png";
import profilepic from "../images/profilepics.png";
import { getProfilePictureUrl } from "../utils/imageHelper";

function Profiledetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [userProfile, setUserProfile] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [artisanProfile, setArtisanProfile] = useState(null);
  
  // ✅ FIX: Use state for user to allow updates
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [artisanFormData, setArtisanFormData] = useState({
    craftType: "",
    experience: "",
    location: "",
    bio: "",
    skills: "",
  });

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/Login");
      return;
    }
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, navigate]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const userData = await getUserProfile();
      setUserProfile(userData);
      
      // ✅ FIX: Update user state
      setUser(userData);

      setUserFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      });

      if (userData.role === "artisan") {
        const artisanData = await getArtisanProfile();
        setArtisanProfile(artisanData);

        setArtisanFormData({
          craftType: artisanData.craftType,
          experience: artisanData.experience,
          location: artisanData.location,
          bio: artisanData.bio || "",
          skills: artisanData.skills ? artisanData.skills.join(", ") : "",
        });
      }

      setError("");
    } catch (err) {
      setError("Failed to load profile data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e) => {
    setUserFormData({
      ...userFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleArtisanChange = (e) => {
    setArtisanFormData({
      ...artisanFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Only image files (JPEG, JPG, PNG, GIF) are allowed',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Image size must be less than 5MB',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await uploadProfilePicture(formData);

      localStorage.setItem("user", JSON.stringify(response.user));
      
      // ✅ FIX: Dispatch event to notify other components
      window.dispatchEvent(new Event('profilePictureUpdated'));

      await fetchProfileData();

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Profile picture uploaded successfully!',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: err.response?.data?.message || 'Failed to upload profile picture',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    const result = await Swal.fire({
      title: 'Delete Profile Picture?',
      text: "Are you sure you want to delete your profile picture?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      setUploadingImage(true);
      await deleteProfilePicture();

      const updatedUser = JSON.parse(localStorage.getItem("user"));
      updatedUser.profilePicture = "";
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // ✅ FIX: Dispatch event to notify other components
      window.dispatchEvent(new Event('profilePictureUpdated'));

      await fetchProfileData();

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Profile picture deleted successfully!',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: err.response?.data?.message || 'Failed to delete profile picture',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (userProfile?.role === "artisan") {
      try {
        setSaving(true);

        const updateData = {
          craftType: artisanFormData.craftType,
          experience: parseInt(artisanFormData.experience),
          location: artisanFormData.location,
          bio: artisanFormData.bio,
          skills: artisanFormData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        };

        await updateArtisanProfile(updateData);
        setSuccess("Profile updated successfully!");

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Profile updated successfully!',
          confirmButtonColor: '#3b82f6',
          timer: 2000
        });

        setTimeout(() => {
          fetchProfileData();
          setSuccess("");
        }, 2000);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to update profile");
      } finally {
        setSaving(false);
      }
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Coming Soon',
        text: 'User information update feature coming soon!',
        confirmButtonColor: '#3b82f6'
      });
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
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error && !userProfile) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        <p>{error}</p>
        <button onClick={fetchProfileData}>Retry</button>
      </div>
    );
  }

  const isArtisan = userProfile?.role === "artisan";

  const profilePictureUrl = getProfilePictureUrl(user?.profilePicture, profilepic);

  return (
    <div className="profiledetails">
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
                <button onClick={handleLogout} style={{ marginRight: "10px" }}>Logout</button>
                <Link to="/Userdashboard"><img src={profilePictureUrl} alt="profilepicimg" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} /></Link>
              </section>
              <summary id="summar">
                <img src={close} alt="closeimg" id="close" />
                <Link to="/Userdashboard">Dashboard</Link>
                <Link to="/Browsecraft">Browse Craftsmen</Link>
                <button onClick={handleLogout}>Logout</button>
              </summary>
            </section>
          </header>

          <main>
            <h1>My Profile</h1>
            <div>
              <img src={profilePictureUrl} alt="Profile" style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }} />
              <div>
                <input type="file" id="profilePictureInput" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                <button onClick={() => document.getElementById("profilePictureInput").click()} disabled={uploadingImage} style={{ cursor: uploadingImage ? "not-allowed" : "pointer" }}>{uploadingImage ? "Uploading..." : "Change Picture"}</button>
                {user?.profilePicture && (
                  <button onClick={handleDeleteImage} disabled={uploadingImage} style={{ backgroundColor: "#dc3545", cursor: uploadingImage ? "not-allowed" : "pointer" }}> Delete Picture</button>
                )}
              </div>
              <p>Allowed: JPG, JPEG, PNG, GIF (Max 5MB)</p>
            </div>

            {success && (
              <div style={{ backgroundColor: "#d4edda", color: "#155724", padding: "10px", borderRadius: "4px", marginBottom: "20px" }}>{success}</div>
            )}

            {error && (
              <div style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "4px", marginBottom: "20px" }}>{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <h3>Basic Information</h3>
              <p>Note: Email and phone updates coming soon. Contact support to change these details.</p>

              <nav>
                <label htmlFor="name">Full Name</label>
                <input type="text" name="name" placeholder="Enter your full name" value={userFormData.name} onChange={handleUserChange} disabled />
              </nav>
              <nav>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" placeholder="Enter your email" value={userFormData.email} onChange={handleUserChange} disabled />
              </nav>
              <nav>
                <label htmlFor="phone">Phone Number</label>
                <input type="text" name="phone" placeholder="Enter your phone number" value={userFormData.phone} onChange={handleUserChange} disabled />
              </nav>

              {isArtisan && (
                <>
                  <h3 style={{ marginTop: "30px" }}>Craftsman Information</h3>

                  {!userProfile.isVerified && (
                    <div
                      style={{
                        backgroundColor: "#fff3cd",
                        padding: "10px",
                        borderRadius: "4px",
                        marginBottom: "15px",
                      }}
                    >
                      ⏳ Your profile is pending admin verification
                    </div>
                  )}

                  <nav>
                    <label htmlFor="craftType">Craft Type</label>
                    <input type="text" name="craftType" placeholder="e.g., Electrician, Plumber" value={artisanFormData.craftType} onChange={handleArtisanChange} required />
                  </nav>

                  <nav>
                    <label htmlFor="experience">Years of Experience</label>
                    <input type="number" name="experience" placeholder="e.g., 5" value={artisanFormData.experience} onChange={handleArtisanChange} min="0" required />
                  </nav>

                  <nav>
                    <label htmlFor="location">Location</label>
                    <input type="text" name="location" placeholder="e.g., Lagos, Ibadan" value={artisanFormData.location} onChange={handleArtisanChange} required />
                  </nav>

                  <nav>
                    <label htmlFor="bio">Bio</label>
                    <textarea name="bio" placeholder="Tell clients about yourself and your services" value={artisanFormData.bio} onChange={handleArtisanChange} rows="5" />
                  </nav>

                  <nav>
                    <label htmlFor="skills">Skills (separate with commas)</label>
                    <input type="text" name="skills" placeholder="e.g., Wiring, Installation, Repairs" value={artisanFormData.skills} onChange={handleArtisanChange} />
                  </nav>
                </>
              )}

              <input type="submit" value={saving ? "Saving..." : "Save Changes"} disabled={saving || !isArtisan} style={{ cursor: saving || !isArtisan ? "not-allowed" : "pointer", opacity: saving || !isArtisan ? 0.6 : 1 }} />

              {!isArtisan && (
                <p>Profile editing for clients coming soon!</p>
              )}
            </form>
          </main>
        </section>
      </div>
    </div>
  );
}

export default Profiledetails;