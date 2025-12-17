import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { subscribe, getSubscriptionStatus } from "../services/api";
import "../styles/subscription.css";
import close from "../images/icon-close.svg";
import profilepic from "../images/profilepics.png";
import logo from "../images/logo.png";
import hamburger from "../images/icon-hamburger.svg";
import { getProfilePictureUrl } from "../utils/imageHelper";

function Subcription() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!isLoggedIn) {
      navigate("/Login");
      return;
    }

    if (user?.role !== "client") {
      alert("Only clients can subscribe");
      navigate("/Userdashboard");
      return;
    }

    fetchSubscriptionData();
  }, [isLoggedIn, navigate]);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const subData = await getSubscriptionStatus();
      setSubscription(subData);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: "basic-monthly",
      name: "Basic (Monthly)",
      price: "$19/month",
      description: "Ideal for casual users.",
      features: [
        "Access to 5 unlocked contacts per month",
        "Standard email support",
        "Basic craftsman profiles",
      ],
    },
    {
      id: "basic-yearly",
      name: "Premium (Yearly)",
      price: "$199/year",
      description: "Best value for frequent users. Save 12%!",
      features: [
        "Access to 50 unlocked contacts per year",
        "Priority email support",
        "Early access to new features",
        "Enhanced craftsman profiles",
      ],
    },
    {
      id: "pay-per-contact",
      name: "Pay-per-Contact",
      price: "$5/contact",
      description: "Flexible, no monthly fees.",
      features: [
        "Unlock contacts as needed",
        "Access to all craftsman profiles",
        "Standard email support",
        "No recurring charges",
      ],
    },
  ];

  const handleChoosePlan = (planId) => {
    setSelectedPlan(planId);
    setShowPaymentForm(true);
    setTimeout(() => {
      document.querySelector(".subscription form")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handlePaymentChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();

    if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvc) {
      alert("Please fill in all payment details");
      return;
    }

    if (!selectedPlan) {
      alert("Please select a plan first");
      return;
    }

    try {
      setProcessing(true);

      const response = await subscribe(selectedPlan);

      localStorage.setItem("user", JSON.stringify(response.user));

      setShowSuccessModal(true);
      setShowPaymentForm(false);

      await fetchSubscriptionData();

      setPaymentDetails({ cardNumber: "", expiryDate: "", cvc: "" });
      setSelectedPlan("");
    } catch (error) {
      alert("Subscription failed: " + (error.response?.data?.message || error.message));
    } finally {
      setProcessing(false);
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
        <p>Loading subscription plans...</p>
      </div>
    );
  }

  const currentPlan = subscription?.plan || "free";
  const isActive = subscription?.status === "active";
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="subscription">
      <summary id="summary" style={{ display: showSuccessModal ? "flex" : "none" }}>
        <nav>
          <nav>
            <i className="fa-regular fa-square-check"></i>
          </nav>
          <h3>Payment Successful!</h3>
          <p>Congratulations! You've successfully subscribed to the{" "}{plans.find((p) => p.id === selectedPlan)?.name || "Premium"} plan.</p>
          <aside>
            <Link to="/Userdashboard">Go to dashboard</Link>
          </aside>
        </nav>
      </summary>

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
                <span>{user?.name}</span>
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

          {isActive && (
            <div>
              <h3>Current Subscription:{" "}{plans.find((p) => p.id === currentPlan)?.name || currentPlan}</h3>
              <p>Status: Active</p>
              <p>Unlocked Contacts Available: {subscription.unlockedContacts}</p>
              {subscription.endDate && (
                <p>Renews on: {new Date(subscription.endDate).toLocaleDateString()}</p>
              )}
            </div>
          )}

          <section>
            <h1>Choose Your Subscription Plan</h1>
            <p>Select the plan that best fits your needs and unlock your premium features.</p>
            <nav>
              {plans.map((plan, index) => (
                <nav key={plan.id} id={currentPlan === plan.id && isActive ? "current" : ""}>
                  <h4>{plan.name}</h4>
                  <h3>{plan.price}</h3>
                  <p>{plan.description}</p>
                  {plan.features.map((feature, idx) => (
                    <h6 key={idx}><i className="fa-regular fa-square-check"></i>{feature}</h6>
                  ))}
                  {currentPlan === plan.id && isActive ? (
                    <button disabled style={{ backgroundColor: "#6c757d", cursor: "not-allowed" }}>Current Plan</button>
                  ) : (
                    <button onClick={() => handleChoosePlan(plan.id)}>Choose Plan</button>
                  )}
                </nav>
              ))}
            </nav>
          </section>

          {showPaymentForm && (
            <div>
              <h2>Enter your payment details</h2>
              <p>Securely process your subscription payment.</p>
              <p>Selected Plan: {plans.find((p) => p.id === selectedPlan)?.name}</p>
              <form onSubmit={handleConfirmPayment}>
                <nav>
                  <label htmlFor="cardNumber">Card number</label>
                  <nav>
                    <i className="fa-solid fa-credit-card"></i>
                    <input type="text" name="cardNumber" placeholder="4242 4242 4242 4242" value={paymentDetails.cardNumber} onChange={handlePaymentChange} required/>
                  </nav>
                </nav>
                <nav>
                  <label htmlFor="expiryDate">Expiry date</label>
                  <nav>
                    <i className="fa-regular fa-calendar"></i>
                    <input type="text" name="expiryDate" placeholder="MM/YY" value={paymentDetails.expiryDate} onChange={handlePaymentChange} required/>
                  </nav>
                </nav>
                <nav>
                  <label htmlFor="cvc">CVC</label>
                  <nav>
                    <i className="fa-solid fa-lock"></i>
                    <input type="text" name="cvc" placeholder="123" value={paymentDetails.cvc} onChange={handlePaymentChange} maxLength="3" required/>
                  </nav>
                </nav>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="button" onClick={() => {setShowPaymentForm(false); setSelectedPlan(""); setPaymentDetails({ cardNumber: "", expiryDate: "", cvc: "" });}}>Cancel</button>
                  <input type="submit" value={processing ? "Processing..." : "Confirm Payment"} disabled={processing} style={{cursor: processing ? "not-allowed" : "pointer",}}/>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Subcription;