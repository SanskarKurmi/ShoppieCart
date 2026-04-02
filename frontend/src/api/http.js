const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function apiFetch(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok) {
    const message =
      payload?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  if (payload && payload.success === false) {
    const err = new Error(payload.message || "Request failed");
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  // Backend standard
  return payload?.data ?? payload;
}

