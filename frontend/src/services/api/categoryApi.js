import api from "./endpoint";

export const fetchCategories = async (searchQuery) => {
  const response = await api.get("/api/categories/", {
    params: { q: searchQuery },
  });
  return response.data;
};

export const fetchCategory = async (categorySlug) => {
  const response = await api.get(`/api/categories/${categorySlug}/`);
  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post("/api/categories/", data);
  return response;
};

export const updateCategory = async (categorySlug, data) => {
  const response = await api.put(`/api/categories/${categorySlug}/`, data);
  return response;
};

export const deleteCategory = async (categorySlug) => {
  const response = await api.delete(`/api/categories/${categorySlug}/`);
  return response;
};
