import React, { useCallback, useEffect, useState } from "react";
import { orderApi } from "../api/endpoints";
import { useAuth } from "../auth/AuthContext";

const statuses = ["pending", "paid", "shipped", "delivered", "cancelled"];

const STATUS_CLASS = {
  pending:   "badge-pending",
  paid:      "badge-confirmed",
  shipped:   "badge-shipped",
  delivered: "badge-delivered",
  cancelled: "badge-cancelled",
};

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [result, setResult]               = useState(null);
  const [statusFilter, setStatusFilter]   = useState("");
  const [sort, setSort]                   = useState("desc");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await orderApi.adminList({
        token,
        page: 1, limit: 20,
        status: statusFilter || undefined,
        sort,
      });
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter, sort]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (order_id, nextStatus) => {
    setError("");
    try {
      await orderApi.adminUpdateStatus({ token, id: order_id, status: nextStatus });
      await load();
    } catch (err) {
      setError(err.message || "Update failed");
    }
  };

  const rows = result?.data || [];

  return (
    <div className="main-content">
      <div className="page-header animate-fadeUp">
        <div>
          <h1 className="page-title">Admin Orders</h1>
          <p className="page-subtitle">
            {result?.pagination?.total != null ? `${result.pagination.total} total orders` : "Manage and update order statuses"}
          </p>
        </div>

        <div className="filter-bar animate-fadeUp" style={{ animationDelay: "0.1s" }}>
          <select
            className="form-control form-select"
            style={{ width: 170 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            {statuses.map((s) => (
              <option value={s} key={s} style={{ textTransform: "capitalize" }}>{s}</option>
            ))}
          </select>

          <select
            className="form-control form-select"
            style={{ width: 140 }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>

          <button className="btn btn-outline btn-sm" onClick={load} disabled={loading}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <span className="spinner" />
          Loading orders…
        </div>
      ) : !rows.length ? (
        <div className="empty-state animate-scaleIn">
          <div className="empty-state-icon">📦</div>
          <h3>No orders found</h3>
          <p>Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="data-table-wrap animate-fadeUp" style={{ animationDelay: "0.1s" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ width: 200 }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.order_id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>#{o.order_id}</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                      {new Date(o.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{o.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>{o.email}</div>
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
                    <select
                      className="form-control form-select"
                      defaultValue=""
                      style={{ fontSize: 13 }}
                      onChange={(e) => {
                        const next = e.target.value;
                        if (next) updateStatus(o.order_id, next);
                        e.target.value = "";
                      }}
                    >
                      <option value="">Set status…</option>
                      {statuses.map((s) => (
                        <option value={s} key={s} style={{ textTransform: "capitalize" }}>{s}</option>
                      ))}
                    </select>
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
