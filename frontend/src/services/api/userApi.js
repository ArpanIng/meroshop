import api from "./endpoint";

export const login_user = async (data) => {
  const response = await api.post("/api/token/", data);
  return response;
};

export const register_user = async (data) => {
  const response = await api.post("/api/auth/register/", data);
  return response;
};

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

// endpoint to retrieve the authenticated user
export const fetchUser = async () => {
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

export const fetchUserReviews = async (rating, limit, offset) => {
  try {
    const params = {};
    // check if rating is passed (not empty or null)
    if (rating) {
      params.rating = rating;
    }

    if (limit) {
      params.limit = limit;
    }

    if (offset) {
      params.offset = offset;
    }
    const response = await api.get("/api/users/me/reviews/", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching request user reviews:", error);
    throw error;
  }
};
