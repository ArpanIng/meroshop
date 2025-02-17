import api from "./endpoint";

export const fetchUsers = async () => {
  try {
    const response = await api.get("/api/users/");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
};

export const fetchUserProfile = async () => {
  const response = await api.get("/api/users/me/");
  return response.data;
};

/* fetch users with the role of 'Vendor' */
export const fetchVendorUsers = async () => {
  try {
    const response = await api.get("/api/users/", {
      params: {
        role: "VEN",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor users:", error);
    throw error;
  }
};

export const fetchUserReviews = async (rating) => {
  try {
    const response = await api.get("/api/users/me/reviews/", {
      params: { rating: rating },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching request user reviews:", error);
    throw error;
  }
};
