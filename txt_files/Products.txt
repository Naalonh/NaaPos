// Products.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Loader from "../components/Loaders";
import Toast from "../components/Toast";
import ProductModal from "../components/products/ProductModal";
import SearchInput from "../components/SearchInput";
import "../css/Products.css";
import "../css/SearchDropdown.css";
import Process from "../components/Process";
import { API_BASE } from "../config";
import { getToken } from "../utils/auth";
import highlightText from "../utils/highlightText";

const Products = () => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [editingOptionGroup, setEditingOptionGroup] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const shopName = localStorage.getItem("shopName") || "POS";
    document.title = `Products | ${shopName}`;
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
      setShowSuggestions(false);
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCategories();
      await fetchProducts();
      setLoading(false);
    };

    loadData();
  }, []);

  const showToast = (type, message) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchCategories = async () => {
    try {
      const token = getToken();
      const shopId = localStorage.getItem("shopId");

      if (!shopId) {
        console.error("Shop ID missing");
        return;
      }

      const response = await fetch(
        `${API_BASE}/api/categories/shop/${shopId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed request");
      }

      const data = await response.json();

      setCategories([{ id: "all", name: "All Products" }, ...data]);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = getToken();

      const response = await fetch(`${API_BASE}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();

      console.log("Products from API:", data); // 👈 Debug here

      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      String(product.category_id ?? product.categoryId) ===
        String(selectedCategory);

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <span className="product-status active">Active</span>;
      case "disabled":
        return <span className="product-status disabled">Disabled</span>;
      default:
        return null;
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      const isEditing = Boolean(productData.id);

      setProcessMessage(
        isEditing ? "Updating product..." : "Saving product...",
      );

      setProcessing(true);

      const token = getToken();
      const formData = new FormData();

      formData.append("categoryId", productData.category);
      formData.append("name", productData.name);
      formData.append("price", productData.price);
      formData.append("currency", productData.currency);
      formData.append("description", productData.description);
      formData.append("status", productData.status);
      formData.append(
        "optionGroups",
        JSON.stringify(productData.optionGroups || []),
      );

      if (productData.imageFile) {
        formData.append("image", productData.imageFile);
      }

      const response = await fetch(
        isEditing
          ? `${API_BASE}/api/products/${productData.id}`
          : `${API_BASE}/api/products`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      await response.json();

      await fetchProducts();

      showToast(
        "success",
        isEditing
          ? "Product updated successfully"
          : "Product created successfully",
      );
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to save product");
    } finally {
      setProcessing(false);
    }
  };

  const toggleMenu = (productId) => {
    setOpenMenuId((prev) => (prev === productId ? null : productId));
  };

  const handleEditProduct = async (product) => {
    const token = getToken();

    const res = await fetch(`${API_BASE}/api/products/${product.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setEditingProduct({
      id: data.id,
      name: data.name,
      category: data.categoryId,
      price: data.price,
      currency: data.currency,
      description: data.description,
      status: data.status,
      image: data.imageUrl,
      optionGroups: data.optionGroups || [],
    });

    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setProcessMessage("Deleting product...");
      setProcessing(true);

      const token = getToken();

      const response = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      await fetchProducts();
      showToast("success", "Product deleted successfully");
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to delete product");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--gray-50)] font-[var(--font-primary)] antialiased text-[var(--gray-900)]">
      
      <ul className="notification-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
          />
        ))}
      </ul>
      {loading && <Loader />}
      {processing && <Process message={processMessage} />}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        categories={categories}
        initialData={editingProduct}
      />
      <Sidebar />

      <div className="product-main-container">
        <Header title="Products" />

        <main className="products-content">
          <div className="products-header">
            <div
              className="search-wrapper"
              onClick={(e) => e.stopPropagation()}>
              <SearchInput
                value={searchQuery}
                onChange={(val) => {
                  setSearchQuery(val);
                  setShowSuggestions(true);
                }}
                placeholder="Search products..."
              />

              {showSuggestions && searchQuery && (
                <div className="search-dropdown">
                  {filteredProducts.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      className="search-item"
                      onClick={() => {
                        setSearchQuery(product.name);
                        setShowSuggestions(false);
                      }}>
                      {highlightText(
                        product.name,
                        searchQuery,
                        "search-highlight",
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="header-actions">
              <button className="export-btn">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export
              </button>
              <button
                className="add-product-btn"
                onClick={() => setIsProductModalOpen(true)}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Product
              </button>
            </div>
          </div>

          <div className="filters-section">
            <div className="category-tabs-container">
              <div className="category-tabs">
                {categories?.map((category) => {
                  const count =
                    category.id === "all"
                      ? products.length
                      : products.filter(
                          (p) =>
                            String(p.category_id ?? p.categoryId) ===
                            String(category.id),
                        ).length;

                  return (
                    <React.Fragment key={category.id}>
                      <input
                        type="radio"
                        id={`cat-${category.id}`}
                        name="category-tabs"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                      />

                      <label
                        className="category-tab"
                        htmlFor={`cat-${category.id}`}>
                        {category.name}

                        <span className="notification">{count}</span>
                      </label>
                    </React.Fragment>
                  );
                })}

                <span
                  className="category-glider"
                  style={{
                    transform: `translateX(${
                      categories.findIndex((c) => c.id === selectedCategory) *
                      100
                    }%)`,
                  }}
                />
              </div>
            </div>

            <div className="view-options">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="products-grid">
              {filteredProducts.length === 0 && (
                <div
                  style={{
                    padding: 40,
                    textAlign: "center",
                    gridColumn: "1 / -1",
                  }}>
                  No products found
                </div>
              )}

              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-card-header">
                    <img
                      src={`${product.imageUrl}?t=${product.updatedAt || Date.now()}`}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                    <div className="product-menu-wrapper">
                      <button
                        className="product-menu-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(product.id);
                        }}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2">
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </button>

                      {openMenuId === product.id && (
                        <div
                          className="product-dropdown"
                          onClick={(e) => e.stopPropagation()}>
                          <button
                            className="dropdown-item edit"
                            onClick={() => handleEditProduct(product)}>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2">
                              <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
                              <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
                            </svg>
                            Edit
                          </button>

                          <button
                            className="dropdown-item delete"
                            onClick={() => handleDeleteProduct(product.id)}>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2">
                              <path d="M3 6h18" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-meta">
                      <span className="product-category">
                        {
                          categories.find(
                            (c) =>
                              c.id ===
                              (product.category_id ?? product.categoryId),
                          )?.name
                        }
                      </span>
                    </div>
                  </div>
                  <div className="product-details">
                    <div className="price-section">
                      <div className="price-tag">
                        {product.currency === "USD"
                          ? `$${Number(product.price).toFixed(2)}`
                          : `៛${Number(product.price).toLocaleString()}`}
                      </div>
                    </div>
                    <div className="stock-section">
                      <div className="stock-info">
                        <span className="stock-label">Created At : </span>
                        <span className="stock-value">
                          {new Date(product.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      {getStatusBadge(product.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Created At</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="product-cell">
                        <div className="product-cell-info">
                          <img
                            className="product-table-image"
                            src={`${product.imageUrl}?t=${product.updatedAt || Date.now()}`}
                            alt={product.name}
                          />
                          <div>
                            <div className="product-name-cell">
                              {product.name}
                            </div>
                            <div className="product-desc-cell">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="category-cell">
                        {
                          categories.find(
                            (c) =>
                              c.id ===
                              (product.category_id ?? product.categoryId),
                          )?.name
                        }
                      </td>
                      <td className="price-cell">
                        {product.currency === "USD"
                          ? `$${Number(product.price).toFixed(2)}`
                          : `៛${Number(product.price).toLocaleString()}`}
                      </td>
                      <td className="stock-cell">
                        <span className="stock-number">
                          {new Date(product.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </td>
                      <td className="status-cell">
                        {getStatusBadge(product.status)}
                      </td>
                      <td className="actions-cell">
                        <button
                          className="table-action-btn edit-btn"
                          onClick={() => handleEditProduct(product)}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2">
                            <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
                            <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
                          </svg>
                        </button>

                        <button
                          className="table-action-btn delete-btn"
                          onClick={() => handleDeleteProduct(product.id)}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2">
                            <path d="M3 6h18" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="products-footer">
            <div className="pagination">
              <button className="pagination-btn">Previous</button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">2</button>
              <button className="pagination-btn">3</button>
              <button className="pagination-btn">4</button>
              <button className="pagination-btn">Next</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
