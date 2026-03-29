import { apiFetch } from "./http";

export const authApi = {
  register: (body) =>
    apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body) =>
    apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export const productApi = {
  list: ({ page = 1, limit = 12, category_id, sort } = {}) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (category_id) params.set("category_id", String(category_id));
    if (sort) params.set("sort", sort);
    return apiFetch(`/api/products?${params.toString()}`);
  },
  get: (id) => apiFetch(`/api/products/${id}`),
};

export const cartApi = {
  get: (token) => apiFetch("/api/cart", { token }),
  addItem: ({ token, product_id, quantity }) =>
    apiFetch("/api/cart/items", {
      method: "POST",
      token,
      body: JSON.stringify({ product_id, quantity }),
    }),
  updateQty: ({ token, product_id, quantity }) =>
    apiFetch(`/api/cart/items/${product_id}`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ quantity }),
    }),
  removeItem: ({ token, product_id }) =>
    apiFetch(`/api/cart/items/${product_id}`, {
      method: "DELETE",
      token,
    }),
};

export const orderApi = {
  createFromCart: (token) =>
    apiFetch("/api/orders", { method: "POST", token }),
  myOrders: ({ token, page = 1, limit = 10 }) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    return apiFetch(`/api/orders/my?${params.toString()}`, { token });
  },
  get: ({ token, id }) => apiFetch(`/api/orders/${id}`, { token }),
  cancel: ({ token, id }) =>
    apiFetch(`/api/orders/${id}/cancel`, { method: "PATCH", token }),
  adminList: ({ token, page = 1, limit = 10, status, sort } = {}) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (status) params.set("status", status);
    if (sort) params.set("sort", sort);
    return apiFetch(`/api/orders?${params.toString()}`, { token });
  },
  adminUpdateStatus: ({ token, id, status }) =>
    apiFetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ status }),
    }),
};

export const paymentApi = {
  create: ({ token, order_id, payment_method, transaction_ref }) =>
    apiFetch("/api/payments", {
      method: "POST",
      token,
      body: JSON.stringify({ order_id, payment_method, transaction_ref }),
    }),
};

