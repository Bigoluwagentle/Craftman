export const getProfilePictureUrl = (profilePicture, defaultImage) => {
  if (profilePicture) {
    return `http://localhost:5000${profilePicture}`;
  }
  return defaultImage;
};