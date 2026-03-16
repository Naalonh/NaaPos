// Categories.tsx
import React, { useState, useEffect, useCallback } from "react";
import { API_BASE } from "../config";
import supabase from "../lib/supabase";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CategoryModal from "../components/CategoryModal";
import Process from "../components/Process";
import Toast from "../components/Toast";
import Warning from "../components/Warning";
import SearchInput from "../components/SearchInput";
import highlightText from "../utils/highlightText";
import { Category } from "../types/category";

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


interface ToastState {
  type: "success" | "error";
  message: string;
}

interface WarningState {
  open: boolean;
  title: string;
  description: string;
}

interface FormData {
  name: string;
  status: "active" | "disabled";
}

const Categories: React.FC = () => {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [shopId, setShopId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [processMessage, setProcessMessage] = useState<string>("Processing...");
  const [warning, setWarning] = useState<WarningState>({
    open: false,
    title: "",
    description: "",
  });

  const toggleMenu = (id: string): void => {
    setOpenMenu(openMenu === id ? null : id);
  };

  const activeCategories = categories.filter(
    (c) => c.status === "active",
  ).length;

  const getStatusBadge = (status: string): React.ReactNode => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <HiOutlineCheckCircle className="w-3.5 h-3.5" />
            Active
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
            <HiOutlineXCircle className="w-3.5 h-3.5" />
            Inactive
          </span>
        );
      case "disabled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
            <HiOutlineXCircle className="w-3.5 h-3.5" />
            Disabled
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
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

  const getNextSortOrder = (): number => {
    const orders = categories
      .map((c) => c.sortOrder)
      .filter((order): order is number => order !== undefined)
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

  const handleSubmit = async (formData: FormData): Promise<void> => {
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
        ? `${API_BASE}/api/categories/${selectedCategory?.id}`
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
          title: isUpdate ? "Update Category" : "Create Category",
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

  const fetchCategories = useCallback(async (): Promise<void> => {
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
  }, [shopId]);

  const loadShop = useCallback(async (): Promise<void> => {
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
  }, []);

  useEffect(() => {
    document.title = "Categories | Naalonh POS";
    loadShop();
  }, [loadShop]);

  useEffect(() => {
    if (shopId) {
      fetchCategories();
    }
  }, [shopId, fetchCategories]);

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

  const formatDate = (dateString?: string): string => {
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
    <div className="flex-1 ml-20 transition-[margin-left] duration-300 ease-in">
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

      <div className="flex-1">
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

        <main className="py-7 px-8 flex flex-col gap-7">
          {/* Page Header */}
          <div className="flex justify-between items-center flex-wrap gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-[18px] flex items-center justify-center shadow-[0_10px_20px_-5px_rgba(99,102,241,0.3)]">
                <HiOutlineTag className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-display tracking-tight m-0">
                  Categories
                </h1>
                <p className="text-sm text-gray-500 mt-1 font-normal">
                  Manage your product categories
                </p>
              </div>
            </div>

            <button
              className="bg-indigo-500 text-white border-none px-6 py-3 rounded-[14px] text-sm font-medium font-display cursor-pointer transition-all duration-200 flex items-center gap-2 shadow-[0_4px_10px_rgba(99,102,241,0.2)] hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(99,102,241,0.3)]"
              onClick={() => {
                setSelectedCategory(null);
                setIsModalOpen(true);
              }}>
              <HiOutlinePlus className="w-4.5 h-4.5" />
              Add Category
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 flex items-center gap-4 border border-gray-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-lg">
              <div className="w-13 h-13 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HiOutlineTag className="w-6.5 h-6.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium mb-1">
                  Total Categories
                </span>
                <span className="text-2xl font-bold text-gray-900 font-display tracking-tight leading-tight">
                  {categories.length}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 flex items-center gap-4 border border-gray-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-lg">
              <div className="w-13 h-13 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                <HiOutlineCheckCircle className="w-6.5 h-6.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium mb-1">
                  Active Categories
                </span>
                <span className="text-2xl font-bold text-gray-900 font-display tracking-tight leading-tight">
                  {activeCategories}
                </span>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-100">
            <SearchInput
              value={searchQuery}
              onChange={(val: string) => {
                setSearchQuery(val);
                setShowSuggestions(true);
              }}
              placeholder="Search categories..."
            />

            {showSuggestions && searchQuery && (
              <div className="absolute w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="py-2.5 px-3.5 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSearchQuery(cat.name);
                      setShowSuggestions(false);
                    }}>
                    {highlightText(
                      cat.name,
                      searchQuery,
                      "text-indigo-500 font-semibold",
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-auto">
            {loading && categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-15 px-5 text-center">
                <div className="w-10 h-10 border-3 border-gray-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p className="text-sm text-gray-500">Loading categories...</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-15 px-5 text-center">
                <HiOutlineFolder className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 font-display mb-2">
                  No categories found
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-75">
                  {searchQuery
                    ? "No categories match your search criteria"
                    : "Get started by creating your first category"}
                </p>
                {!searchQuery && (
                  <button
                    className="bg-indigo-500 text-white border-none px-6 py-3 rounded-[14px] text-sm font-medium font-display cursor-pointer transition-all duration-200 flex items-center gap-2 shadow-[0_4px_10px_rgba(99,102,241,0.2)] hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(99,102,241,0.3)]"
                    onClick={() => setIsModalOpen(true)}>
                    <HiOutlinePlus className="w-4.5 h-4.5" />
                    Create Category
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full border-collapse text-sm min-w-200">
                <thead>
                  <tr>
                    <th className="text-left px-5 py-4.5 text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100 font-display whitespace-nowrap">
                      #
                    </th>
                    <th className="text-left px-5 py-4.5 text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100 font-display whitespace-nowrap">
                      Category Name
                    </th>
                    <th className="text-left px-5 py-4.5 text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100 font-display whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <HiOutlineSortAscending className="w-3.5 h-3.5 text-gray-400" />
                        Sort Order
                      </div>
                    </th>
                    <th className="text-left px-5 py-4.5 text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100 font-display whitespace-nowrap">
                      Status
                    </th>
                    <th className="text-left px-5 py-4.5 text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100 font-display whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <HiOutlineCalendar className="w-3.5 h-3.5 text-gray-400" />
                        Created
                      </div>
                    </th>
                    <th className="text-left px-5 py-4.5 text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100 font-display whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category, index) => (
                    <tr
                      key={category.id}
                      className="transition-all duration-200 hover:bg-gray-50">
                      <td className="px-5 py-4 text-gray-700 border-b border-gray-100">
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 rounded-[10px] text-xs font-medium text-gray-600">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-700 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm font-display shadow-[0_4px_8px_rgba(99,102,241,0.2)]">
                            {category.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-700 border-b border-gray-100">
                        <span className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 border border-gray-200">
                          #{category.sortOrder || index + 1}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-700 border-b border-gray-100">
                        {getStatusBadge(category.status)}
                      </td>
                      <td className="px-5 py-4 text-gray-700 border-b border-gray-100">
                        <span className="flex items-center text-gray-600 text-xs whitespace-nowrap">
                          {formatDate(category.createdAt)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-700 border-b border-gray-100">
                        <div className="relative flex justify-end">
                          <button
                            className="bg-transparent border-none cursor-pointer p-2 rounded-[10px] text-gray-500 flex items-center justify-center transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                            onClick={() => toggleMenu(category.id)}
                            aria-label="Actions">
                            <HiOutlineDotsVertical />
                          </button>

                          {openMenu === category.id && (
                            <div className="absolute right-0 top-11 bg-white min-w-40 border border-gray-200 rounded-2xl p-1.5 shadow-xl z-50 animate-[slideDown_0.2s_ease]">
                              <button
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setIsModalOpen(true);
                                  setOpenMenu(null);
                                }}
                                className="flex items-center w-full px-3.5 py-3 border-none bg-none text-left cursor-pointer text-sm font-medium text-gray-700 rounded-xl transition-all duration-200 hover:bg-gray-50 hover:text-indigo-600">
                                Edit Category
                              </button>

                              <button
                                className="flex items-center w-full px-3.5 py-3 border-none bg-none text-left cursor-pointer text-sm font-medium text-red-500 rounded-xl transition-all duration-200 hover:bg-red-50 hover:text-red-700"
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
            <div className="flex justify-end pt-4">
              <span className="text-xs text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-100">
                Showing {filteredCategories.length} of {categories.length}{" "}
                categories
              </span>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        * {
          scroll-behavior: smooth;
        }
        
        button:focus-visible {
          outline: 2px solid #6366f1;
          outline-offset: 2px;
        }
        
        ::selection {
          background: #6366f1;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Categories;
