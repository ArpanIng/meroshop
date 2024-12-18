import api from "./endpoint";

export const fetchCategories = async (searchQuery) => {
  try {
    const response = await api.get("/api/categories/", {
      params: { q: searchQuery },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

export const fetchCategory = async (categoryId) => {
  try {
    const response = await api.get(`/api/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
  }
};

export const createCategory = async (data) => {
  try {
    const response = await api.post("/api/categories/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
  }
};

export const updateCategory = async (categoryId, data) => {
  try {
    const response = await api.put(`/api/categories/${categoryId}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/api/categories/${categoryId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};
