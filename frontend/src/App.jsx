import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AuthProvider from "./contexts/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/accounts/Profile";
import ProfileUpdate from "./pages/accounts/ProfileUpdate";
import Settings from "./pages/accounts/Settings";
import Register from "./pages/accounts/auth/Register";
import Login from "./pages/accounts/auth/Login";
import ChangePassword from "./pages/accounts/auth/ChangePassword";
import Cart from "./pages/carts/Cart";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import VendorDashboard from "./pages/dashboard/VendorDashboard";
import CategoryForm from "./pages/products/CategoryForm";
import CategoryList from "./pages/products/CategoryList";
import ProductForm from "./pages/products/ProductForm";
import ProductList from "./pages/products/ProductList";
import ProductDetail from "./pages/products/ProductDetail";
import VendorForm from "./pages/vendors/VendorForm";
import VendorList from "./pages/vendors/VendorList";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/me/"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/me/update"
              element={
                <ProtectedRoute>
                  <ProfileUpdate />
                </ProtectedRoute>
              }
            />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="/products-detail" element={<ProductDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/dashboard" element={<VendorDashboard />} />
          <Route path="admin">
            <Route index element={<AdminDashboard />} />
            {/* category routes */}
            <Route path="categories">
              <Route index element={<CategoryList />} />
              <Route path="add" element={<CategoryForm mode="ADD" />} />
              <Route
                path=":categorySlug/edit"
                element={<CategoryForm mode="EDIT" />}
              />
            </Route>
            {/* product routes */}
            <Route path="products">
              <Route index element={<ProductList />} />
              <Route path="add" element={<ProductForm mode="ADD" />} />
              <Route
                path=":productSlug/edit"
                element={<ProductForm mode="EDIT" />}
              />
            </Route>
            {/* vendor routes */}
            <Route path="vendors">
              <Route index element={<VendorList />} />
              <Route path="add" element={<VendorForm mode="ADD" />} />
              <Route
                path=":vendorId/edit"
                element={<VendorForm mode="EDIT" />}
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
