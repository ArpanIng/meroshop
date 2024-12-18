import api from "./endpoint";

export const getProfile = async () => {
  const response = await api.get("/api/users/me/");
  return response.data;
};
