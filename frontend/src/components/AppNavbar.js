import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AppNavbar() {
  const { isAuthed, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  const navLinkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <nav className="app-nav">
      {/* Single row — brand | links | actions */}
      <div className="nav-inner">

        {/* Brand */}
        <Link className="nav-brand" to="/" onClick={() => setMobileOpen(false)}>
          <span className="nav-brand-icon">🛍</span>
          ShoppieCart
        </Link>

        {/* Centre links — hidden on mobile via CSS */}
        <ul className="nav-links">
          <li><NavLink className={navLinkClass} to="/">Products</NavLink></li>
          {isAuthed && (
            <>
              <li><NavLink className={navLinkClass} to="/cart">🛒 Cart</NavLink></li>
              <li><NavLink className={navLinkClass} to="/orders">Orders</NavLink></li>
            </>
          )}
          {isAuthed && user?.role === "admin" && (
            <li><NavLink className={navLinkClass} to="/admin/orders">Admin</NavLink></li>
          )}
        </ul>

        {/* Right actions — hidden on mobile via CSS */}
        <div className="nav-end">
          {isAuthed ? (
            <>
              <div className="nav-user">
                <div className="nav-user-avatar">{initials}</div>
                <div className="nav-user-info">
                  <div className="nav-user-name">{user?.name || user?.email?.split("@")[0]}</div>
                  <div className="nav-user-role">{user?.role}</div>
                </div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={onLogout}>Sign out</button>
            </>
          ) : (
            <>
              <NavLink className="btn btn-ghost btn-sm" to="/login">Sign in</NavLink>
              <NavLink className="btn btn-primary btn-sm" to="/register">Get started</NavLink>
            </>
          )}
        </div>

        {/* Hamburger — visible on mobile only */}
        <button
          className="nav-toggle"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile drawer — conditionally rendered */}
      {mobileOpen && (
        <div className="nav-mobile-drawer">
          <ul className="nav-links-mobile">
            <li><NavLink className={navLinkClass} to="/" onClick={() => setMobileOpen(false)}>Products</NavLink></li>
            {isAuthed && (
              <>
                <li><NavLink className={navLinkClass} to="/cart" onClick={() => setMobileOpen(false)}>🛒 Cart</NavLink></li>
                <li><NavLink className={navLinkClass} to="/orders" onClick={() => setMobileOpen(false)}>Orders</NavLink></li>
              </>
            )}
            {isAuthed && user?.role === "admin" && (
              <li><NavLink className={navLinkClass} to="/admin/orders" onClick={() => setMobileOpen(false)}>Admin</NavLink></li>
            )}
          </ul>
          <div className="nav-mobile-actions">
            {isAuthed ? (
              <>
                <span className="nav-mobile-email">{user?.email}</span>
                <button className="btn btn-outline btn-sm btn-full" onClick={onLogout}>Sign out</button>
              </>
            ) : (
              <>
                <NavLink className="btn btn-ghost btn-sm btn-full" to="/login" onClick={() => setMobileOpen(false)}>Sign in</NavLink>
                <NavLink className="btn btn-primary btn-sm btn-full" to="/register" onClick={() => setMobileOpen(false)}>Get started</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
