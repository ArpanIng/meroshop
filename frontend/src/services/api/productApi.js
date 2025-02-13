import api from "./endpoint";

export const fetchProducts = async (searchQuery, limit, offset) => {
  try {
    const response = await api.get("/api/products/", {
      params: { q: searchQuery, limit: limit, offset: offset },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error.message);
    throw error;
  }
};

export const fetchProduct = async (productSlug) => {
  try {
    const response = await api.get(`/api/products/${productSlug}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error.message);
    throw error;
  }
};

export const createProduct = async (data) => {
  try {
    const response = await api.post("/api/products/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (productSlug, data) => {
  try {
    const response = await api.put(`/api/products/${productSlug}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (productSlug) => {
  try {
    const response = await api.delete(`/api/products/${productSlug}/`);
    return response;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const fetchProductStatusChoices = async () => {
  try {
    const response = await api.get("/api/products/status-choices/");
    return response.data;
  } catch (error) {
    console.error("Error fetching product status choices:", error.message);
    throw error;
  }
};
