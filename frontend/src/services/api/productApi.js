import api from "./endpoint";

export const fetchProducts = async (searchQuery, limit, offset) => {
  const response = await api.get("/api/products/", {
    params: { q: searchQuery, limit: limit, offset: offset },
  });
  return response.data;
};

export const fetchProduct = async (productSlug) => {
  const response = await api.get(`/api/products/${productSlug}/`);
  return response.data;
};

export const createProduct = async (data) => {
  const response = await api.post("/api/products/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const updateProduct = async (productSlug, data) => {
  const response = await api.put(`/api/products/${productSlug}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const deleteProduct = async (productSlug) => {
  const response = await api.delete(`/api/products/${productSlug}/`);
  return response;
};

export const fetchProductStatusChoices = async () => {
  const response = await api.get("/api/products/status-choices/");
  return response.data;
};

export const fetchProductReviews = async (productSlug, rating) => {
  const response = await api.get(`/api/products/${productSlug}/reviews/`, {
    params: { rating: rating },
  });
  return response.data;
};
