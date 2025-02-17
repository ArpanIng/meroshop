export const fetchReviews = async () => {
  try {
    const response = await api.get("/api/reviews/");
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    throw error;
  }
};

export const fetchReview = async () => {
  try {
    const response = await api.get(`/api/reviews/${reviewId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching review:", error.message);
    throw error;
  }
};

export const createReview = async (data) => {
  try {
    const response = await api.post("/api/reviews/", data);
    return response;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const updateReview = async (reviewId, data) => {
  try {
    const response = await api.put(`/api/reviews/${reviewId}/`, data);
    return response;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/api/reviews/${reviewId}/`);
    return response;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};
