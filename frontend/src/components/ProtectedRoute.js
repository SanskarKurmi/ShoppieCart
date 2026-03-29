import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({ adminOnly = false }) {
  const { isAuthed, user } = useAuth();

  if (!isAuthed) return <Navigate to="/login" replace />;

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
