import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/endpoints";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [done, setDone]         = useState("");

  const strength = password.length === 0 ? 0
    : password.length < 6  ? 1
    : password.length < 10 ? 2
    : 3;
  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthColor = ["", "var(--danger)", "var(--warning)", "var(--success)"];

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setDone("");
    setLoading(true);
    try {
      await authApi.register({ name, email, password });
      setDone("Account created successfully!");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join thousands of shoppers. It's free.</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {done  && <div className="alert alert-success">✓ {done}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                className="form-control"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          </div>

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
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                className="form-control"
                type={showPass ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
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
            {/* Strength bar */}
            {password.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  {[1,2,3].map((i) => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 999,
                      background: i <= strength ? strengthColor[strength] : "var(--border)",
                      transition: "background 0.3s"
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: strengthColor[strength], fontWeight: 500 }}>
                  {strengthLabel[strength]}
                </span>
              </div>
            )}
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
                Creating account…
              </>
            ) : (
              "Create account →"
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
