import axios from "axios";
import humps from "humps";
import { ACCESS_TOKEN } from "../../utils/constants";

const BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

/*
Add a request interceptor
outgoing data
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data) {
      // convert camelCase to snake_case (python naming conventions)
      config.data = humps.decamelizeKeys(config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
/*
Add a response interceptor
incoming data
*/
api.interceptors.response.use(
  (response) => {
    if (response.data) {
      // convert the response data (snake_case) into camelCase (JS naming conventions)
      response.data = humps.camelizeKeys(response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
