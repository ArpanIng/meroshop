import React, { createContext, useContext, useEffect, useState } from "react";
import humps from "humps";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../services/api/endpoint";
import { fetchUser } from "../services/api/userApi";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/constants";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    auth();
  }, []);

  const gethUser = async () => {
    try {
      const data = await fetchUser();
      setUser(data);
    } catch (error) {
      console.error("Error fetching request user data:", error);
    }
  };

  const handleRefreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000; // seconds

    // token is expired
    if (tokenExpiration < now) {
      await handleRefreshToken();
    } else {
      setIsAuthenticated(true); // user is logged in
      await gethUser(); // Fetch user after confirming valid token
      setIsLoading(false);
    }
  };

  const register = async ({
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword,
  }) => {
    try {
      await api.post("/api/auth/register/", {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        password: password,
        password2: confirmPassword,
      });
      await login(email, password);
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        // map backend errors to formik
        const errors = {};
        Object.keys(errorData).forEach((field) => {
          // handle non-field errors
          if (field === "non_field_errors") {
            errors.nonFieldErrors = errorData[field].join("");
          } else {
            // handle field errors
            // convert the error field to match formik initialValues
            const camelCaseField = humps.camelize(field);
            errors[camelCaseField] = errorData[field].join("");
          }
        });
        throw errors; // to handle in formik onSubmit
      } else {
        console.error("An error occured. Please try again.");
      }
    }
  };

  const login = async ({ email, password }) => {
    try {
      const response = await api.post("/api/token/", {
        email,
        password,
      });
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      setIsAuthenticated(true);
      await gethUser(); // Fetch request authenticated user data
      navigate("/");
    } catch (error) {
      console.error("Error submitting user login data:", error);
      if (error.response) {
        const errorData = error.response.data;
        // map backend errors to formik
        const errors = {};
        if (errorData.detail) {
          errors.detail = errorData.detail;
        }
        throw errors; // to handle in formik onSubmit
      } else {
        console.error("An error occured. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        register,
        login,
        handleLogout,
      }}
    >
      {!isLoading ? children : <div>Loading...</div>}{" "}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
