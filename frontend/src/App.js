import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";

import AppNavbar from "./components/AppNavbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
