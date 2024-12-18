import api from "./endpoint";

export const fetchVendors = async () => {
  try {
    const response = await api.get("/api/vendors/");
    return response.data;
  } catch (error) {
    console.error("Error fetching vendors:", error);
  }
};

export const fetchVendor = async (vendorId) => {
  try {
    const response = await api.get(`/api/vendors/${vendorId}`);
    return {
      name: response.data.name || "",
      description: response.data.description || "",
      email: response.data.email || "",
      address: response.data.address || "",
      phoneNumber: response.data.phone_number || "",
      status: response.data.status ? response.data.status.toUpperCase() : "",
    };
  } catch (error) {
    console.error("Error fetching vendor:", error);
  }
};

export const createVendor = async (data) => {
  try {
    const response = await api.post("/api/vendors/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating vendor:", error);
  }
};

export const updateVendor = async (vendorId, data) => {
  try {
    const response = await api.put(`/api/vendors/${vendorId}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating vendor:", error);
  }
};

export const deleteVendor = async (vendorId) => {
  try {
    const response = await api.delete(`/api/vendors/${vendorId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting vendor:", error);
  }
};

export const fetchVendorStatusChoices = async (vendorId) => {
  try {
    const url = vendorId ? `/api/vendors/${vendorId}` : "/api/vendors/";
    const response = await api.options(url);
    const optionStatusData = vendorId
      ? response.data.actions?.PUT?.status?.choices || []
      : response.data.actions?.POST?.status?.choices || [];
    return optionStatusData;
  } catch (error) {
    console.error("Error fetching vendor status choices:", error);
  }
};
