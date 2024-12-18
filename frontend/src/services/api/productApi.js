import api from "./endpoint";

export const fetchProducts = async () => {
  try {
    const response = await api.get("/api/products/");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

export const fetchProduct = async (productId) => {
  try {
    const response = await api.get(`/api/products/${productId}`);
    return {
      name: response.data.name || "",
      description: response.data.description || "",
      email: response.data.email || "",
      address: response.data.address || "",
      phoneNumber: response.data.phone_number || "",
      status: response.data.status ? response.data.status.toUpperCase() : "",
    };
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

export const createProduct = async (data) => {
  try {
    const response = await api.post("/api/products/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
  }
};

export const updateProduct = async (productId, data) => {
  try {
    const response = await api.put(`/api/products/${productId}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/api/products/${productId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

export const fetchProductStatusChoices = async (productId) => {
  try {
    const url = productId ? `/api/products/${productId}` : "/api/products/";
    const response = await api.options(url);
    const optionStatusData = productId
      ? response.data.actions?.PUT?.status?.choices || []
      : response.data.actions?.POST?.status?.choices || [];
    return optionStatusData;
  } catch (error) {
    console.error("Error fetching product status choices:", error);
  }
};
