import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import AuthProvider from "./contexts/AuthContext";
import MainLayout from "./components/layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/accounts/Profile";
import ProfileUpdate from "./pages/accounts/ProfileUpdate";
import Settings from "./pages/accounts/Settings";
import UserForm from "./pages/accounts/UserForm";
import UserList from "./pages/accounts/UserList";
import UserReviewList from "./pages/accounts/UserReviewList";
import ChangePassword from "./pages/accounts/auth/ChangePassword";
import Login from "./pages/accounts/auth/Login";
import Register from "./pages/accounts/auth/Register";
import Cart from "./pages/carts/Cart";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import VendorDashboard from "./pages/dashboard/VendorDashboard";
import CategoryList from "./pages/products/CategoryList";
import ProductDetail from "./pages/products/ProductDetail";
import ProductList from "./pages/products/ProductList";
import ReviewList from "./pages/products/ReviewList";
import VendorList from "./pages/vendors/VendorList";
import CartProvider from "./contexts/CartContext";
import ChoicesProvider from "./contexts/ChoicesContext";
import CartList from "./pages/carts/CartList";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer hideProgressBar={true} transition={Slide} />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="auth">
              <Route
                path="register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="change-password"
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />
            </Route>
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
            <Route path="/users/reviews/" element={<UserReviewList />} />
            <Route
              path="/cart"
              element={
                <CartProvider>
                  <Cart />
                </CartProvider>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:productSlug"
              element={
                <CartProvider>
                  <ProductDetail />
                </CartProvider>
              }
            />
            <Route path="/notFound" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/dashboard" element={<VendorDashboard />} />
          <Route path="admin">
            <Route index element={<AdminDashboard />} />
            {/* user routes */}
            <Route path="users">
              <Route index element={<UserList />} />
              <Route path="add" element={<UserForm />} />
            </Route>
            {/* category routes */}
            <Route path="categories">
              <Route index element={<CategoryList />} />
            </Route>
            {/* product routes */}
            <Route path="products">
              <Route
                index
                element={
                  <ChoicesProvider>
                    <ProductList />
                  </ChoicesProvider>
                }
              />
            </Route>
            {/* review routes */}
            <Route path="reviews">
              <Route index element={<ReviewList />} />
            </Route>
            {/* vendor routes */}
            <Route path="vendors">
              <Route
                index
                element={
                  <ChoicesProvider>
                    <VendorList />
                  </ChoicesProvider>
                }
              />
            </Route>
            {/* cart routes */}
            <Route path="carts">
              <Route index element={<CartList />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
