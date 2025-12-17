import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const verifyEmail = async (email, verificationCode) => {
  const response = await api.post("/auth/verify-email", { email, verificationCode });
  return response.data;
};

export const resendVerificationCode = async (email) => {
  const response = await api.post("/auth/resend-verification", { email });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await api.post("/auth/reset-password", { token, newPassword });
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const getArtisanProfile = async () => {
  const response = await api.get("/artisan/profile");
  return response.data;
};

export const updateArtisanProfile = async (profileData) => {
  const response = await api.put("/artisan/profile", profileData);
  return response.data;
};

export const getAllVerifiedArtisans = async () => {
  const response = await api.get("/artisan/all");
  return response.data;
};

export const getArtisanById = async (id) => {
  const response = await api.get(`/artisan/${id}`);
  return response.data;
};

export const searchArtisans = async (craftType, location) => {
  let url = "/artisan/search?";
  if (craftType) url += `craftType=${craftType}&`;
  if (location) url += `location=${location}`;
  
  const response = await api.get(url);
  return response.data;
};

export const getUnverifiedArtisans = async () => {
  const response = await api.get("/admin/artisans/unverified");
  return response.data;
};

export const getVerifiedArtisans = async () => {
  const response = await api.get("/admin/artisans/verified");
  return response.data;
};

export const verifyArtisan = async (userId) => {
  const response = await api.put(`/admin/artisan/verify/${userId}`);
  return response.data;
};

export const unverifyArtisan = async (userId) => {
  const response = await api.put(`/admin/artisan/unverify/${userId}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/user/${userId}`);
  return response.data;
};

export const subscribe = async (plan) => {
  const response = await api.post("/subscription/subscribe", { plan });
  return response.data;
};

export const getSubscriptionStatus = async () => {
  const response = await api.get("/subscription/status");
  return response.data;
};

export const cancelSubscription = async () => {
  const response = await api.put("/subscription/cancel");
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await api.post("/reviews", reviewData);
  return response.data;
};

export const getArtisanReviews = async (artisanId) => {
  const response = await api.get(`/reviews/artisan/${artisanId}`);
  return response.data;
};

export const getMyReviews = async () => {
  const response = await api.get("/reviews/my-reviews");
  return response.data;
};

export const updateReview = async (reviewId, reviewData) => {
  const response = await api.put(`/reviews/${reviewId}`, reviewData);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

export const unlockContact = async (artisanId) => {
  const response = await api.post("/unlocked-contacts/unlock", { artisanId });
  return response.data;
};

export const getMyUnlockedContacts = async () => {
  const response = await api.get("/unlocked-contacts/my-contacts");
  return response.data;
};

export const checkIfUnlocked = async (artisanId) => {
  const response = await api.get(`/unlocked-contacts/check/${artisanId}`);
  return response.data;
};

export const uploadProfilePicture = async (formData) => {
  const response = await api.post("/profile-picture/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProfilePicture = async () => {
  const response = await api.delete("/profile-picture/delete");
  return response.data;
};

export default api;