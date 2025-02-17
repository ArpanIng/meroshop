import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../services/api/endpoint";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/constants";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    auth();
  }, []);

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
      setIsLoading(false);
    }
  };

  const register = async (
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword
  ) => {
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
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/token/", {
        email,
        password,
      });
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, register, login, handleLogout }}
    >
      {!isLoading ? children : <div>Loading...</div>}{" "}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
