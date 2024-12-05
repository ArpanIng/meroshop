import api from "./endpoint";

export const getProfile = async () => {
  const response = await api.get("/api/users/me/");
  return response.data;
};

export const getUserProfileDetail = async (username) => {
  const response = await api.get(`/api/users/profile/${username}`);
  return response.data;
};
