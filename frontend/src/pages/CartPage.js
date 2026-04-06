import React, { useCallback, useEffect, useMemo, useState } from "react";
import { cartApi, orderApi } from "../api/endpoints";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { token } = useAuth();
  const navigate  = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [placing, setPlacing]   = useState(false);
  const [error, setError]       = useState("");
  const [cart, setCart]         = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await cartApi.get(token);
      setCart(data);
    } catch (err) {
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const total = useMemo(() => {
    const items = cart?.items || [];
    return items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);
  }, [cart]);

  const itemCount = useMemo(() => {
    return (cart?.items || []).reduce((sum, i) => sum + Number(i.quantity), 0);
  }, [cart]);

  const updateQty = async (product_id, quantity) => {
    if (quantity < 1) return;
    try {
      await cartApi.updateQty({ token, product_id, quantity });
      await load();
    } catch (err) {
      setError(err.message || "Failed to update");
    }
  };

  const removeItem = async (product_id) => {
    try {
      await cartApi.removeItem({ token, product_id });
      await load();
    } catch (err) {
      setError(err.message || "Failed to remove");
    }
  };

  const placeOrder = async () => {
    setPlacing(true);
    setError("");
    try {
      const order = await orderApi.createFromCart(token);
      navigate(`/orders/${order.order_id}`);
    } catch (err) {
      setError(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  const items = cart?.items || [];

  return (
    <div className="main-content">
      {/* Header */}
      <div className="page-header animate-fadeUp">
        <div>
          <h1 className="page-title">Your Cart</h1>
          <p className="page-subtitle">
            {itemCount > 0 ? `${itemCount} item${itemCount !== 1 ? "s" : ""} ready for checkout` : "Review your items before checkout"}
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={load} disabled={loading}>
          ↻ Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <span className="spinner" />
          Loading your cart…
        </div>
      ) : !items.length ? (
        <div className="empty-state animate-scaleIn">
          <div className="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started.</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate("/")}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="animate-fadeUp" style={{ animationDelay: "0.1s" }}>
          <div className="cart-table-wrap">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style={{ width: 120 }}>Price</th>
                  <th style={{ width: 110 }}>Quantity</th>
                  <th style={{ width: 120 }}>Subtotal</th>
                  <th style={{ width: 60 }} />
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.cart_item_id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text)" }}>{i.product_name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>ID #{i.product_id}</div>
                    </td>
                    <td style={{ color: "var(--text-2)", fontWeight: 500 }}>
                      ₹{Number(i.price).toLocaleString("en-IN")}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: "4px 8px", minWidth: 28 }}
                          onClick={() => updateQty(i.product_id, i.quantity - 1)}
                        >−</button>
                        <input
                          type="number"
                          className="qty-input"
                          min={1}
                          value={i.quantity}
                          onChange={(e) => updateQty(i.product_id, Number(e.target.value))}
                        />
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: "4px 8px", minWidth: 28 }}
                          onClick={() => updateQty(i.product_id, i.quantity + 1)}
                        >+</button>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--text)" }}>
                      ₹{(Number(i.price) * Number(i.quantity)).toLocaleString("en-IN")}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeItem(i.product_id)}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-summary">
              <div>
                <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 2 }}>Order total</div>
                <div className="cart-total">₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <button
                className="btn btn-primary btn-lg"
                onClick={placeOrder}
                disabled={placing}
              >
                {placing ? (
                  <>
                    <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    Placing order…
                  </>
                ) : (
                  "Place Order →"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
