import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import AuthProvider from "./contexts/AuthContext";
import MainLayout from "./layouts/MainLayout";
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
import CategoryCreate from "./pages/products/CategoryCreate";
import CategoryList from "./pages/products/CategoryList";
import CategoryUpdate from "./pages/products/CategoryUpdate";
import ProductCreate from "./pages/products/ProductCreate";
import ProductDetail from "./pages/products/ProductDetail";
import ProductUpdate from "./pages/products/ProductUpdate";
import ProductList from "./pages/products/ProductList";
import ReviewList from "./pages/products/ReviewList";
import VendorCreate from "./pages/vendors/VendorCreate";
import VendorList from "./pages/vendors/VendorList";
import VendorUpdate from "./pages/vendors/VendorUpdate";
import CartProvider from "./contexts/CartContext";
import ChoicesProvider from "./contexts/ChoicesContext";

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
            <Route path="/cart" element={<Cart />} />
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
              <Route path="add" element={<CategoryCreate />} />
              <Route path=":categorySlug/edit" element={<CategoryUpdate />} />
            </Route>
            {/* product routes */}
            <Route path="products">
              <Route index element={<ProductList />} />
              <Route
                path="add"
                element={
                  <ChoicesProvider>
                    <ProductCreate />
                  </ChoicesProvider>
                }
              />
              <Route
                path=":productSlug/edit"
                element={
                  <ChoicesProvider>
                    <ProductUpdate />
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
              <Route index element={<VendorList />} />
              <Route
                path="add"
                element={
                  <ChoicesProvider>
                    <VendorCreate />
                  </ChoicesProvider>
                }
              />
              <Route
                path=":vendorId/edit"
                element={
                  <ChoicesProvider>
                    <VendorUpdate />
                  </ChoicesProvider>
                }
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
