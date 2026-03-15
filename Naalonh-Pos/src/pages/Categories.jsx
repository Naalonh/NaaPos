// Categories.jsx
import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";
import supabase from "../lib/supabase";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CategoryModal from "../components/CategoryModal";
import Process from "../components/Process";
import "../css/Categories.css";
import Toast from "../components/Toast";
import Warning from "../components/Warning";
import SearchInput from "../components/SearchInput";
import "../css/SearchDropdown.css";
import highlightText from "../utils/highlightText";

import {
  HiOutlineDotsVertical,
  HiOutlineFolder,
  HiOutlineTag,
  HiOutlinePlus,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineCalendar,
  HiOutlineSortAscending,
} from "react-icons/hi";

const Categories = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [toast, setToast] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [shopId, setShopId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState("Processing...");
  const [warning, setWarning] = useState({
    open: false,
    title: "",
    description: "",
  });

  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  const activeCategories = categories.filter(
    (c) => c.status === "active",
  ).length;

  const getStatusBadge = (status) => {
    return status === "active" ? (
      <span className="status-badge active">
        <HiOutlineCheckCircle className="status-icon" />
        Active
      </span>
    ) : (
      <span className="status-badge inactive">
        <HiOutlineXCircle className="status-icon" />
        Inactive
      </span>
    );
  };

  const handleDelete = async (id) => {
    setProcessMessage("Deleting category...");
    setProcessing(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("No session found");

      const response = await fetch(`${API_BASE}/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      await fetchCategories();
      setToast({
        type: "success",
        message: "Category deleted successfully",
      });
      setOpenMenu(null);
    } catch (error) {
      setWarning({
        open: true,
        title: "Delete Category",
        description:
          "Please remove or move the products before deleting this category.",
      });
      console.error("Failed to delete category:", error);
      setToast({
        type: "error",
        message: "Failed to delete category",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getNextSortOrder = () => {
    const orders = categories
      .map((c) => c.sortOrder)
      .filter(Boolean)
      .sort((a, b) => a - b);

    let expected = 1;

    for (let order of orders) {
      if (order !== expected) {
        return expected;
      }
      expected++;
    }

    return expected;
  };

  const handleSubmit = async (formData) => {
    const isUpdate = !!selectedCategory;

    setProcessMessage(
      isUpdate ? "Updating category..." : "Creating category...",
    );
    setProcessing(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("No session found");

      const url = isUpdate
        ? `${API_BASE}/api/categories/${selectedCategory.id}`
        : `${API_BASE}/api/categories`;

      const method = isUpdate ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          status: formData.status,
          shopId: shopId,
        }),
      });

      if (!response.ok) {
        setWarning({
          open: true,
          title: "Create Category",
          description: "This category already exists.",
        });

        throw new Error("Failed to save category");
      }

      await fetchCategories();

      setToast({
        type: "success",
        message: isUpdate
          ? "Category updated successfully"
          : "Category created successfully",
      });

      setIsModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Failed to save category:", error);

      setToast({
        type: "error",
        message: isUpdate
          ? "Failed to update category"
          : "Failed to create category",
      });
    } finally {
      setProcessing(false);
    }
  };

  const fetchCategories = async () => {
    if (!shopId) return;

    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("No active session");

      const response = await fetch(
        `${API_BASE}/api/categories/shop/${shopId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      // ✅ Check 401 AFTER request
      if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadShop = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("No session");

      localStorage.setItem("token", session.access_token);

      const response = await fetch(`${API_BASE}/api/shops/me`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load shop");
      }

      const shop = await response.json();
      setShopId(shop.id);
    } catch (error) {
      console.error("Error loading shop:", error);
    }
  };

  useEffect(() => {
    document.title = "Categories | Naalonh POS";
    loadShop();
  }, []);

  useEffect(() => {
    if (shopId) {
      fetchCategories();
    }
  }, [shopId]);

  useEffect(() => {
    const shopName = localStorage.getItem("shopName") || "POS";
    document.title = `Dashboard | ${shopName}`;
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="categories-layout">
      <Sidebar />

      <Warning
        isOpen={warning.open}
        title={warning.title}
        description={warning.description}
        onClose={() => setWarning({ ...warning, open: false })}
      />

      {toast && (
        <ul className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </ul>
      )}

      <div className="main-container">
        <Header title="Categories" />
        {processing && <Process message={processMessage} />}
        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          }}
          mode={selectedCategory ? "edit" : "create"}
          category={selectedCategory}
          nextSortOrder={getNextSortOrder()}
          loading={loading}
          onSubmit={handleSubmit}
        />

        <main className="categories-content">
          {/* Page Header */}
          <div className="page-header">
            <div className="header-left">
              <div className="relative w-[400px]">
                <SearchInput
                  value={searchQuery}
                  onChange={(val) => {
                    setSearchQuery(val);
                    setShowSuggestions(true);
                  }}
                  placeholder="Search categories..."
                />

                {showSuggestions && searchQuery && (
                  <div className="absolute w-full bg-white border border-[#e5e7eb] rounded-[8px] shadow-[0_6px_20px_rgba(0,0,0,0.08)] z-10">
                    {filteredCategories.map((cat) => (
                      <div
                        key={cat.id}
                        className="py-[10px] px-[14px] cursor-pointer hover:bg-[#f3f4f6]"
                        onClick={() => {
                          setSearchQuery(cat.name);
                          setShowSuggestions(false);
                        }}>
                        {highlightText(
                          cat.name,
                          searchQuery,
                          "text-[#6366f1] font-semibold",
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              className="primary-btn"
              onClick={() => {
                setSelectedCategory(null);
                setIsModalOpen(true);
              }}>
              <HiOutlinePlus className="btn-icon" />
              Add Category
            </button>
          </div>

          {/* Summary Cards */}
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-icon-wrapper total">
                <HiOutlineTag className="summary-icon" />
              </div>
              <div className="summary-content">
                <span className="summary-label">Total Categories</span>
                <span className="summary-value">{categories.length}</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon-wrapper active">
                <HiOutlineCheckCircle className="summary-icon" />
              </div>
              <div className="summary-content">
                <span className="summary-label">Active Categories</span>
                <span className="summary-value">{activeCategories}</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}

          {/* Categories Table */}
          <div className="table-wrapper">
            {loading && categories.length === 0 ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading categories...</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="empty-state">
                <HiOutlineFolder className="empty-icon" />
                <h3>No categories found</h3>
                <p>
                  {searchQuery
                    ? "No categories match your search criteria"
                    : "Get started by creating your first category"}
                </p>
                {!searchQuery && (
                  <button
                    className="primary-btn"
                    onClick={() => setIsModalOpen(true)}>
                    <HiOutlinePlus className="btn-icon" />
                    Create Category
                  </button>
                )}
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category Name</th>
                    <th>
                      <div className="sortable-header">
                        <HiOutlineSortAscending className="sort-icon" />
                        Sort Order
                      </div>
                    </th>
                    <th>Status</th>
                    <th>
                      <div className="sortable-header">
                        <HiOutlineCalendar className="sort-icon" />
                        Created
                      </div>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category, index) => (
                    <tr key={category.id}>
                      <td>
                        <span className="row-number">{index + 1}</span>
                      </td>
                      <td>
                        <div className="category-name-cell">
                          <div className="category-avatar">
                            {category.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="category-name">{category.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="sort-order-badge">
                          #{category.sortOrder || index + 1}
                        </span>
                      </td>
                      <td>{getStatusBadge(category.status)}</td>
                      <td>
                        <span className="date-cell">
                          {formatDate(category.createdAt)}
                        </span>
                      </td>
                      <td>
                        <div className="action-menu">
                          <button
                            className="icon-btn"
                            onClick={() => toggleMenu(category.id)}
                            aria-label="Actions">
                            <HiOutlineDotsVertical />
                          </button>

                          {openMenu === category.id && (
                            <div className="dropdown-menu">
                              <button
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setIsModalOpen(true);
                                  setOpenMenu(null);
                                }}
                                className="dropdown-item">
                                Edit Category
                              </button>

                              <button
                                className="dropdown-item danger"
                                onClick={() => handleDelete(category.id)}>
                                Delete Category
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Footer */}
          {filteredCategories.length > 0 && (
            <div className="table-footer">
              <span className="table-info">
                Showing {filteredCategories.length} of {categories.length}{" "}
                categories
              </span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Categories;
