const API_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const getProfilePictureUrl = (profilePicture, defaultImage) => {
  if (!profilePicture) {
    return defaultImage;
  }
  
  if (profilePicture.startsWith('http://') || profilePicture.startsWith('https://')) {
    return profilePicture;
  }
  
  return `${API_BASE_URL}${profilePicture}`;
};