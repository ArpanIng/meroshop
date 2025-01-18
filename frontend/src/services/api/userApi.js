import api from "./endpoint";

export const getProfile = async () => {
  const response = await api.get("/api/users/me/");
  return response.data;
};

/* fetch users with the role of 'Vendor' */
export const fetchVendorUsers = async () => {
  try {
    const response = await api.get("/api/users/", {
      params: {
        role: "VEN",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor users:", error);
    throw error;
  }
};
