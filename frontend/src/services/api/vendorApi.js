import api from "./endpoint";

export const fetchVendors = async (searchQuery, limit, offset) => {
  const response = await api.get("/api/vendors/", {
    params: { q: searchQuery, limit: limit, offset: offset },
  });
  return response.data;
};

export const fetchVendor = async (vendorId) => {
  const response = await api.get(`/api/vendors/${vendorId}/`);
  return response.data;
};

export const createVendor = async (data) => {
  const response = await api.post("/api/vendors/", data);
  return response;
};

export const updateVendor = async (vendorId, data) => {
  const response = await api.put(`/api/vendors/${vendorId}/`, data);
  return response;
};

export const deleteVendor = async (vendorId) => {
  const response = await api.delete(`/api/vendors/${vendorId}/`);
  return response;
};

export const fetchVendorStatusChoices = async () => {
  const response = await api.get("/api/vendors/status-choices/");
  return response.data;
};
