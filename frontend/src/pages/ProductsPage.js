import React, { useEffect, useMemo, useState } from "react";
import { productApi, cartApi } from "../api/endpoints";
import { useAuth } from "../auth/AuthContext";

/* Curated product image map using Unsplash */
const PRODUCT_IMAGES = {
  // Electronics
  "laptop":       "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
  "phone":        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
  "headphones":   "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
  "watch":        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  "camera":       "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
  "tablet":       "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&q=80",
  "keyboard":     "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80",
  "mouse":        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80",
  // Clothing
  "shirt":        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80",
  "sneakers":     "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  "shoes":        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  "jacket":       "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
  "bag":          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
  "sunglasses":   "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
  // Home & kitchen
  "coffee":       "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
  "mug":          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
  "lamp":         "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80",
  "chair":        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
  "book":         "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
  "plant":        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80",
  "candle":       "https://images.unsplash.com/photo-1602607144165-8d9e09fbed39?w=400&q=80",
  "towel":        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  // Sports
  "yoga":         "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
  "dumbbell":     "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  "bottle":       "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80",
};

/* Fallback category images */
const CATEGORY_IMAGES = {
  "electronics":  "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80",
  "clothing":     "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80",
  "fashion":      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80",
  "home":         "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
  "kitchen":      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
  "sports":       "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
  "books":        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
  "beauty":       "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=80",
  "toys":         "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
};

/* Default fallback */
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
];

function getProductImage(product) {
  if (product.image_url) return product.image_url;

  const name = (product.product_name || "").toLowerCase();
  const cat  = (product.category_name || "").toLowerCase();

  // Try keyword match in product name
  for (const [kw, url] of Object.entries(PRODUCT_IMAGES)) {
    if (name.includes(kw)) return url;
  }
  // Try category
  for (const [kw, url] of Object.entries(CATEGORY_IMAGES)) {
    if (cat.includes(kw)) return url;
  }
  // Stable fallback by id
  return DEFAULT_IMAGES[product.product_id % DEFAULT_IMAGES.length];
}

function getStars(price) {
  // Fake rating: stable 3.5–5 based on product_id
  const r = 3.5 + ((price * 7) % 1.5);
  return Math.round(r * 2) / 2;
}

function StarDisplay({ rating }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span className="product-stars" aria-label={`${rating} stars`}>
      {"★".repeat(full)}{"½".repeat(half)}{"☆".repeat(empty)}
    </span>
  );
}

/*Skeleton card*/
function SkeletonCard() {
  return (
    <div className="product-card" style={{ pointerEvents: "none" }}>
      <div className="skeleton" style={{ height: 200 }} />
      <div className="product-body" style={{ gap: 10 }}>
        <div className="skeleton" style={{ height: 12, width: "50%" }} />
        <div className="skeleton" style={{ height: 16, width: "80%" }} />
        <div className="skeleton" style={{ height: 12, width: "65%" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <div className="skeleton" style={{ height: 22, width: 70 }} />
          <div className="skeleton" style={{ height: 34, width: 80, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}

/*Product Card*/
function ProductCard({ product, onAdd, adding }) {
  const img    = getProductImage(product);
  const rating = getStars(product.price);

  return (
    <div className="product-card animate-fadeUp">
      <div className="product-img-wrap">
        <img src={img} alt={product.product_name} loading="lazy" />
        <div className="product-badge">{product.category_name || "Product"}</div>
        <div className="product-quick-add">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onAdd(product.product_id)}
            disabled={adding === product.product_id}
            style={{ boxShadow: "var(--shadow-lg)" }}
          >
            {adding === product.product_id ? "Adding…" : "+ Add"}
          </button>
        </div>
      </div>

      <div className="product-body">
        <div className="product-category">{product.category_name}</div>
        <div className="product-name">{product.product_name}</div>

        {product.description && (
          <div className="product-desc">{product.description}</div>
        )}

        <div className="product-rating">
          <StarDisplay rating={rating} />
          <span style={{ color: "var(--text-3)" }}>({Math.floor(rating * 13 + 5)})</span>
        </div>

        <div className="product-footer">
          <div className="product-price">
            ₹{Number(product.price).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onAdd(product.product_id)}
            disabled={adding === product.product_id}
          >
            {adding === product.product_id ? "…" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

/*Toast*/
function Toast({ message, type }) {
  if (!message) return null;
  return <div className={`toast-bar ${type}`}>{message}</div>;
}

/*Main Page*/
export default function ProductsPage() {
  const { token, isAuthed } = useAuth();
  const [page, setPage]       = useState(1);
  const [limit]               = useState(12);
  const [sort, setSort]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [items, setItems]     = useState([]);
  const [pagination, setPagination] = useState(null);
  const [toast, setToast]     = useState({ msg: "", type: "" });
  const [adding, setAdding]   = useState(null);

  const canGoPrev = page > 1;
  const canGoNext = useMemo(() => Boolean(pagination?.hasMore), [pagination]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 2000);
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await productApi.list({ page, limit, sort: sort || undefined });
      setItems(data.data || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]);

  const addToCart = async (product_id) => {
    if (!isAuthed) {
      showToast("Sign in to add items to cart.", "error");
      return;
    }
    setAdding(product_id);
    try {
      await cartApi.addItem({ token, product_id, quantity: 1 });
      showToast("Added to cart ✓", "success");
    } catch (err) {
      showToast(err.message || "Failed to add", "error");
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="main-content">
      {/* Header */}
      <div className="page-header">
        <div className="animate-fadeUp">
          <h1 className="page-title">All Products</h1>
          <p className="page-subtitle">
            {pagination?.total != null
              ? `${pagination.total} items available`
              : "Browse our curated collection"}
          </p>
        </div>

        <div className="filter-bar animate-fadeUp" style={{ animationDelay: "0.1s" }}>
          <select
            className="form-control form-select"
            style={{ width: 200 }}
            value={sort}
            onChange={(e) => { setPage(1); setSort(e.target.value); }}
          >
            <option value="">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <button
            className="btn btn-outline btn-sm"
            onClick={load}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Grid */}
      <div className="products-grid stagger">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : items.length
            ? items.map((p) => (
                <ProductCard
                  key={p.product_id}
                  product={p}
                  onAdd={addToCart}
                  adding={adding}
                />
              ))
            : (
              <div style={{ gridColumn: "1/-1" }}>
                <div className="empty-state">
                  <div className="empty-state-icon">📦</div>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or check back later.</p>
                </div>
              </div>
            )
        }
      </div>

      {/* Pagination */}
      {!loading && items.length > 0 && (
        <div className="pagination animate-fadeUp" style={{ animationDelay: "0.3s" }}>
          <button
            className="btn btn-outline btn-sm"
            disabled={!canGoPrev || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Previous
          </button>
          <span className="pagination-info">
            Page {page}
            {pagination?.total != null ? ` of ${Math.ceil(pagination.total / limit)}` : ""}
          </span>
          <button
            className="btn btn-outline btn-sm"
            disabled={!canGoNext || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}

      <Toast message={toast.msg} type={toast.type} />
    </div>
  );
}
