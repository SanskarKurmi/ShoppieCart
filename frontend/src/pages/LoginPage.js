import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/endpoints";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      login(data.token);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🛍</div>
          <span className="auth-logo-text">ShoppieCart</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue shopping.</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <div className="input-wrapper">
              <span className="input-icon">✉</span>
              <input
                className="form-control"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              {/* <a href="#!" style={{ fontSize: 13, color: "var(--brand)", textDecoration: "none" }}>Forgot password?</a> */}
            </div>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                className="form-control"
                type={showPass ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPass((s) => !s)}
                tabIndex={-1}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary btn-full btn-lg"
            type="submit"
            disabled={loading}
            style={{ marginTop: 4 }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Signing in…
              </>
            ) : (
              "Sign in →"
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">Create one for free</Link>
        </div>
      </div>
    </div>
  );
}
