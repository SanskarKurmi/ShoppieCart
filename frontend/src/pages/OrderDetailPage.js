import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { orderApi, paymentApi } from "../api/endpoints";
import { useAuth } from "../auth/AuthContext";

const STATUS_CLASS = {
  pending:   "badge-pending",
  paid:      "badge-confirmed",
  confirmed: "badge-confirmed",
  shipped:   "badge-shipped",
  delivered: "badge-delivered",
  cancelled: "badge-cancelled",
};

const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"];

export default function OrderDetailPage() {
  const { id }  = useParams();
  const { token, user } = useAuth();
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [order, setOrder]           = useState(null);
  const [paying, setPaying]         = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await orderApi.get({ token, id });
      setOrder(data);
    } catch (err) {
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => { load(); }, [load]);

  const cancelOrder = async () => {
    setCancelling(true);
    setError("");
    try {
      await orderApi.cancel({ token, id });
      await load();
    } catch (err) {
      setError(err.message || "Cancel failed");
    } finally {
      setCancelling(false);
    }
  };

  const payNow = async () => {
    setPaying(true);
    setError("");
    try {
      await paymentApi.create({
        token,
        order_id: Number(id),
        payment_method: "demo",
        transaction_ref: `DEMO-${Date.now()}`,
      });
      await load();
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return (
    <div className="main-content loading-state">
      <span className="spinner" /> Loading order…
    </div>
  );
  if (error) return (
    <div className="main-content">
      <div className="alert alert-danger">{error}</div>
    </div>
  );
  if (!order) return null;

  const canCancel = user?.role !== "admin" && order.order_status === "pending";
  const canPay    = order.order_status === "pending";
  const stepIndex = STATUS_STEPS.indexOf(order.order_status);

  return (
    <div className="main-content">
      {/* Back + header */}
      <div style={{ marginBottom: 24 }} className="animate-fadeUp">
        <Link className="btn btn-ghost btn-sm" to="/orders" style={{ marginBottom: 12, display: "inline-flex" }}>
          ← Back to orders
        </Link>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div>
            <h1 className="page-title">Order #{order.order_id}</h1>
            <p className="page-subtitle">
              Placed on {new Date(order.created_at).toLocaleDateString("en-IN", {
                day: "2-digit", month: "long", year: "numeric"
              })}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22, fontFamily: "'DM Serif Display', serif", letterSpacing: "-0.02em" }}>
              ₹{Number(order.total_amount).toLocaleString("en-IN")}
            </span>
            <span className={`badge ${STATUS_CLASS[order.order_status] || "badge-pending"}`} style={{ fontSize: 13, padding: "5px 14px" }}>
              {order.order_status}
            </span>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Progress tracker (non-cancelled) */}
      {order.order_status !== "cancelled" && (
        <div className="animate-fadeUp" style={{ animationDelay: "0.1s", marginBottom: 24, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20 }}>
          <div style={{ display: "flex", gap: 0 }}>
            {STATUS_STEPS.map((step, i) => (
              <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}>
                {i > 0 && (
                  <div style={{
                    position: "absolute", top: 12, right: "50%", left: "-50%",
                    height: 2, background: i <= stepIndex ? "var(--brand)" : "var(--border)",
                    transition: "background 0.4s"
                  }} />
                )}
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", zIndex: 1,
                  background: i <= stepIndex ? "var(--brand)" : "var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.4s",
                  fontSize: 11, color: i <= stepIndex ? "#fff" : "transparent"
                }}>✓</div>
                <span style={{ fontSize: 12, fontWeight: 500, color: i <= stepIndex ? "var(--brand)" : "var(--text-3)", textAlign: "center", textTransform: "capitalize" }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      {order.items?.length ? (
        <div className="data-table-wrap animate-fadeUp" style={{ animationDelay: "0.15s", marginBottom: 20 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th style={{ width: 130 }}>Unit Price</th>
                <th style={{ width: 80 }}>Qty</th>
                <th style={{ width: 130 }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((i) => (
                <tr key={i.order_item_id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{i.product_name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>Product #{i.product_id}</div>
                  </td>
                  <td>₹{Number(i.price_at_purchase).toLocaleString("en-IN")}</td>
                  <td style={{ color: "var(--text-2)" }}>{i.quantity}</td>
                  <td style={{ fontWeight: 600 }}>
                    ₹{(Number(i.price_at_purchase) * Number(i.quantity)).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "14px 16px", background: "var(--surface-2)", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
            <span style={{ fontSize: 13, color: "var(--text-2)", marginRight: 12 }}>Order Total</span>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20 }}>
              ₹{Number(order.total_amount).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      ) : (
        <div className="alert alert-info">No items found for this order.</div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, animationDelay: "0.2s" }} className="animate-fadeUp">
        {canPay && (
          <button className="btn btn-primary btn-lg" onClick={payNow} disabled={paying}>
            {paying ? (
              <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Processing…</>
            ) : (
              "💳 Pay Now (Demo)"
            )}
          </button>
        )}
        {canCancel && (
          <button className="btn btn-danger" onClick={cancelOrder} disabled={cancelling}>
            {cancelling ? "Cancelling…" : "Cancel Order"}
          </button>
        )}
      </div>
    </div>
  );
}
