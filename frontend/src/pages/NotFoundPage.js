import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 200px)" }}>
      <div className="empty-state animate-scaleIn">
        <div className="empty-state-icon" style={{ fontSize: 72 }}>🗺</div>
        <h3 style={{ fontSize: 28 }}>404 — Page Not Found</h3>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link className="btn btn-primary" to="/" style={{ marginTop: 20 }}>
          ← Back to Products
        </Link>
      </div>
    </div>
  );
}
