import api from "./endpoint";

export const fetchReviews = async () => {
  const response = await api.get("/api/reviews/");
  return response.data;
};

export const fetchReview = async (reviewId) => {
  const response = await api.get(`/api/reviews/${reviewId}/`);
  return response.data;
};

export const createReview = async (data) => {
  const response = await api.post("/api/reviews/", data);
  return response;
};

export const updateReview = async (reviewId, data) => {
  const response = await api.put(`/api/reviews/${reviewId}/`, data);
  return response;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/api/reviews/${reviewId}/`);
  return response;
};
