import api from "./endpoint";

export const fetchCategories = async (searchQuery) => {
  try {
    const response = await api.get("/api/categories/", {
      params: { q: searchQuery },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    throw error;
  }
};

export const fetchCategory = async (categorySlug) => {
  try {
    const response = await api.get(`/api/categories/${categorySlug}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error.message);
    throw error;
  }
};

export const createCategory = async (data) => {
  try {
    const response = await api.post("/api/categories/", data);
    return response;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (categorySlug, data) => {
  try {
    const response = await api.put(`/api/categories/${categorySlug}/`, data);
    return response;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (categorySlug) => {
  try {
    const response = await api.delete(`/api/categories/${categorySlug}/`);
    return response;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
