import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderApi } from "../api/endpoints";
import { useAuth } from "../auth/AuthContext";

const STATUS_CLASS = {
  pending:   "badge-pending",
  paid:      "badge-confirmed",
  confirmed: "badge-confirmed",
  shipped:   "badge-shipped",
  delivered: "badge-delivered",
  cancelled: "badge-cancelled",
};

export default function OrdersPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [orders, setOrders]   = useState([]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await orderApi.myOrders({ token, page: 1, limit: 20 });
      setOrders(data || []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="main-content">
      <div className="page-header animate-fadeUp">
        <div>
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">Track your order history and status.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={load} disabled={loading}>
          ↻ Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <span className="spinner" />
          Loading orders…
        </div>
      ) : !orders.length ? (
        <div className="empty-state animate-scaleIn">
          <div className="empty-state-icon">📋</div>
          <h3>No orders yet</h3>
          <p>Your orders will appear here once you make a purchase.</p>
        </div>
      ) : (
        <div className="data-table-wrap animate-fadeUp" style={{ animationDelay: "0.1s" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ width: 80 }} />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.order_id}>
                  <td>
                    <span style={{ fontWeight: 600 }}>#{o.order_id}</span>
                  </td>
                  <td style={{ color: "var(--text-2)", fontSize: 13 }}>
                    {new Date(o.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric"
                    })}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    ₹{Number(o.total_amount).toLocaleString("en-IN")}
                  </td>
                  <td>
                    <span className={`badge ${STATUS_CLASS[o.order_status] || "badge-pending"}`}>
                      {o.order_status}
                    </span>
                  </td>
                  <td>
                    <Link
                      className="btn btn-outline btn-sm"
                      to={`/orders/${o.order_id}`}
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
