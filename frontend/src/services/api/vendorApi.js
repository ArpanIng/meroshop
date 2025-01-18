import api from "./endpoint";

export const fetchVendors = async () => {
  try {
    const response = await api.get("/api/vendors/");
    return response.data;
  } catch (error) {
    console.error("Error fetching vendors:", error.message);
    throw error;
  }
};

export const fetchVendor = async (vendorId) => {
  try {
    const response = await api.get(`/api/vendors/${vendorId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor:", error.message);
    throw error;
  }
};

export const createVendor = async (data) => {
  try {
    const response = await api.post("/api/vendors/", data);
    return response;
  } catch (error) {
    console.error("Error creating vendor:", error);
    throw error;
  }
};

export const updateVendor = async (vendorId, data) => {
  try {
    const response = await api.put(`/api/vendors/${vendorId}/`, data);
    return response;
  } catch (error) {
    console.error("Error updating vendor:", error);
    throw error;
  }
};

export const deleteVendor = async (vendorId) => {
  try {
    const response = await api.delete(`/api/vendors/${vendorId}/`);
    return response;
  } catch (error) {
    console.error("Error deleting vendor:", error);
    throw error;
  }
};

export const fetchVendorStatusChoices = async () => {
  try {
    const response = await api.get("/api/vendors/status-choices/");
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor status choices:", error.message);
    throw error;
  }
};
