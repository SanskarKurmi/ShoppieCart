import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <Link className="nav-brand" to="/" style={{ marginBottom: 6 }}>
            <span className="nav-brand-icon" style={{ width: 28, height: 28, fontSize: 14 }}>🛍</span>
            ShoppieCart
          </Link>
          <p className="footer-tagline">
            A clean, minimal shopping experience built with React.
          </p>
        </div>

        {/* Quick links */}
        <div className="footer-links">
          <span className="footer-links-title">Navigate</span>
          <Link to="/" className="footer-link">Products</Link>
          <Link to="/cart" className="footer-link">Cart</Link>
          <Link to="/orders" className="footer-link">Orders</Link>
          <Link to="/login" className="footer-link">Sign in</Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span>© {year} ShoppieCart. All rights reserved.</span>
        <span className="footer-bottom-right">Made with ♥ in React</span>
      </div>
    </footer>
  );
}
