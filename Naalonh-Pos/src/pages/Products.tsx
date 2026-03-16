// Products.tsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Loader from "../components/Loaders";
import Toast from "../components/Toast";
import ProductModal from "../components/products/ProductModal";
import SearchInput from "../components/SearchInput";
import Process from "../components/Process";
import { API_BASE } from "../config";
import { getToken } from "../utils/auth";
import highlightText from "../utils/highlightText";
import Button from "../components/ui/Button";
import { Download, Plus } from "lucide-react";
import { BiEdit, BiTrash, BiSolidImage } from "react-icons/bi";
import { ProductForm, OptionGroup } from "../types/product";

// ── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number | string;
  currency: string;
  status: string;
  imageUrl: string;
  categoryId?: string | number;
  category_id?: string | number;
  createdAt: string;
  updatedAt?: string;
  optionGroups?: OptionGroup[];
}

interface ProductFormData {
  id?: string | number;
  name: string;
  category: string | number;
  price: number | string;
  currency: string;
  description: string;
  status: string;
  image?: string;
  imageFile?: File;
  optionGroups?: OptionGroup[];
}

type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

type StatusKey = "active" | "inactive" | "draft" | "archived";

interface StatusConfig {
  bg: string;
  text: string;
  label: string;
}

// ── Component ────────────────────────────────────────────────────────────────

const Products: React.FC = () => {
  const [editingProduct, setEditingProduct] = useState<ProductForm | null>(
    null,
  );

  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | number>(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [editingOptionGroup, setEditingOptionGroup] =
    useState<OptionGroup | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [processMessage, setProcessMessage] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = viewMode === "grid" ? 16 : 15;

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
    const loadData = async (): Promise<void> => {
      setLoading(true);
      await fetchCategories();
      await fetchProducts();
      setLoading(false);
    };

    loadData();
  }, []);

  const showToast = (type: ToastType, message: string): void => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchCategories = async (): Promise<void> => {
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

      const data: Category[] = await response.json();

      console.log("Categories from API:", data);

      setCategories([{ id: "all", name: "All Products" }, ...data]);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  
  const fetchProducts = async (): Promise<void> => {
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

      const data: Product[] = await response.json();

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

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );
  const getStatusBadge = (status: string): React.ReactElement => {
    const statusConfig: Record<StatusKey, StatusConfig> = {
      active: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
      inactive: { bg: "bg-gray-100", text: "text-gray-800", label: "Inactive" },
      draft: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Draft" },
      archived: { bg: "bg-red-100", text: "text-red-800", label: "Archived" },
    };

    const config = statusConfig[status as StatusKey] || statusConfig.inactive;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleSaveProduct = async (productData: ProductForm): Promise<void> => {
    try {
      const isEditing = Boolean(productData.id);

      setProcessMessage(
        isEditing ? "Updating product..." : "Saving product...",
      );

      setProcessing(true);

      const token = getToken();
      const formData = new FormData();

      formData.append("categoryId", String(productData.category));
      formData.append("name", productData.name);
      formData.append("price", String(productData.price));
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

  const toggleMenu = (productId: string | number): void => {
    setOpenMenuId((prev) => (prev === productId ? null : productId));
  };

  const handleEditProduct = async (product: Product): Promise<void> => {
    const token = getToken();

    const res = await fetch(`${API_BASE}/api/products/${product.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data: Product & { categoryId: string | number } = await res.json();

    setEditingProduct({
      id: data.id ?? null,
      name: data.name,
      category: String(data.categoryId),
      price: Number(data.price) || "",
      currency: data.currency as "USD" | "KHR",
      description: data.description,
      status: data.status as "active" | "disabled",
      image: data.imageUrl ?? null,
      imageFile: null,
      optionGroups: data.optionGroups || [],
    });

    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (
    productId: string | number,
  ): Promise<void> => {
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
    <div className="flex min-h-screen bg-gray-50 font-(--font-primary) antialiased text-gray-900">
      <ul className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
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
        initialData={editingProduct || undefined}
      />
      <Sidebar />

      <div className="flex-1 ml-20 transition-[margin-left] duration-300 ease-in ">
        <Header title="Products" />

        <main className="py-7 px-8 flex flex-col gap-7">
          <div className="flex justify-between items-center">
            <div
              className="relative w-100"
              onClick={(e) => e.stopPropagation()}>
              <SearchInput
                value={searchQuery}
                onChange={(val: string) => {
                  setSearchQuery(val);
                  setShowSuggestions(true);
                }}
                placeholder="Search products..."
              />

              {showSuggestions && searchQuery && (
                <div className="absolute w-full bg-white border border-[#e5e7eb] rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.08)] z-10">
                  {filteredProducts.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      className="py-2.5 px-3.5 cursor-pointer hover:bg-[#f3f4f6]"
                      onClick={() => {
                        setSearchQuery(product.name);
                        setShowSuggestions(false);
                      }}>
                      {highlightText(
                        product.name,
                        searchQuery,
                        "text-[#6366f1] font-semibold",
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                text="Export"
                icon={<Download size={18} />}
                bgColor="bg-white"
                textColor="text-[var(--gray-700)]"
                border="border border-gray-200"
                hoverColor="hover:bg-gray-50"
              />

              <Button
                text="Add Product"
                icon={<Plus size={18} />}
                bgColor="bg-[var(--primary-500)]"
                hoverColor="hover:bg-[var(--primary-600)]"
                textColor="text-white"
                onClick={() => setIsProductModalOpen(true)}
              />
            </div>
          </div>

          {/* filters-section */}
          <div className="flex flex-col gap-5">
            {/* category-tabs-container  */}
            <div className="w-fit">
              {/* category-tabs */}
              <div className="flex bg-white p-1.5 rounded-[999px] border border-(--gray-200) gap-1.5">
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
                        className="hidden"
                        type="radio"
                        id={`cat-${category.id}`}
                        name="category-tabs"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                      />

                      {/* category-tab */}
                      <label
                        htmlFor={`cat-${category.id}`}
                        className={`flex items-center justify-center gap-1.5 py-2 px-4.5 text-[13px] font-medium rounded-[999px] cursor-pointer whitespace-nowrap transition-colors duration-200
                        ${
                          selectedCategory === category.id
                            ? "bg-(--primary-50) text-(--primary-600)"
                            : "text-(--gray-600)"
                        }`}>
                        {category.name}
                        {/* notification */}
                        <span
                          className={`flex items-center justify-center min-w-4.5 text-[10px] font-semibold rounded-[999px] px-1.5 transition-all duration-200 ease-in ${
                            selectedCategory === category.id
                              ? "bg-(--primary-500) text-white"
                              : "bg-(--primary-50) text-(--primary-600)"
                          }`}>
                          {count}
                        </span>
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
            {/* view-options */}
            <div className="flex gap-1 bg-(--gray-100) p-1 rounded-xl self-start">
              {/* view-btn */}
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
            // products-grid
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 ">
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

              {paginatedProducts.map((product) => (
                // product-card
                <div
                  key={product.id}
                  className="bg-white border border-gray-100 p-5 shadow-sm transition-all duration-200 ease-in flex flex-col gap-4 rounded-[20px] hover:-translate-y-1 hover:shadow-lg hover:border-gray-200">
                  {/* product-card-header */}
                  <div className="flex justify-between items-start">
                    {/* product-card-header img */}
                    {product.imageUrl ? (
                      <img
                        className="w-1/2 aspect-square object-cover rounded-xl"
                        src={`${product.imageUrl}?t=${product.updatedAt || Date.now()}`}
                        alt={product.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-1/2 aspect-square flex items-center justify-center bg-gray-100 rounded-xl text-gray-400">
                        <BiSolidImage size={40} />
                      </div>
                    )}
                    {/* product-card-header menu */}
                    <div className="relative">
                      {/* product-menu-btn */}
                      <button
                        className="bg-none border-none p-1.5 rounded-lg text-(--gray-400) cursor-pointer transition-all duration-200 ease-in hover:bg-(--gray-100) hover:text-(--gray-700)"
                        onClick={(e: React.MouseEvent) => {
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
                        // product-dropdown
                        <div
                          className="absolute right-0 top-8.75 bg-white rounded-lg border border-[#eee] shadow-[0_6px_20px_rgba(0,0,0,0.08)] w-35 overflow-hidden z-10"
                          onClick={(e: React.MouseEvent) =>
                            e.stopPropagation()
                          }>
                          {/* dropdown-item edit */}
                          <button
                            className="w-full flex items-center gap-2 px-3 py-2.5 border-none bg-transparent cursor-pointer text-sm hover:bg-[#f6f6f6]"
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
                          {/* dropdown-item delete */}
                          <button
                            className="w-full flex items-center gap-2 px-3 py-2.5 border-none bg-transparent cursor-pointer text-sm hover:bg-[#ffecec] hover:text-[#dc2626]"
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
                  {/* product-info */}
                  <div className="flex flex-col gap-2">
                    {/* product name */}
                    <h3 className="text-lg text-(--gray-900) m-0 font-display font-semibold tracking-[-0.01em]">
                      {product.name}
                    </h3>
                    {/* product description */}
                    <p className="text-sm text-(--gray-500) m-0 leading-normal line-clamp-2 overflow-hidden">
                      {product.description}
                    </p>
                    {/* product meta */}
                    <div className="flex gap-3 mt-1">
                      {/* product category */}
                      <span className="text-xs text-(--primary-600) bg-(--primary-50) px-2.5 py-1 rounded-full font-(--weight-medium) font-display">
                        {
                          categories.find(
                            (c) =>
                              String(c.id) ===
                              String(product.category_id ?? product.categoryId),
                          )?.name
                        }
                      </span>
                    </div>
                  </div>
                  {/* product details */}
                  <div className="flex justify-between items-end mt-2 pt-3 border-t border-(--gray-100)">
                    {/* price section */}
                    <div className="flex flex-col gap-1">
                      {/* price tag */}
                      <div className="text-xl font-(--weight-bold) text-(--gray-900) font-display tracking-[-0.02em]">
                        {product.currency === "USD"
                          ? `$${Number(product.price).toFixed(2)}`
                          : `៛${Number(product.price).toLocaleString()}`}
                      </div>
                    </div>
                    {/* stock section */}
                    <div className="flex flex-col gap-1.5 items-end">
                      {/* stock info */}
                      <div className="flex items-center gap-1.5">
                        {/* stock label */}
                        <span className="text-xs text-gray-500 font-medium">
                          Created At :{" "}
                        </span>
                        {/* stock value */}
                        <span className="text-sm font-(--weight-semibold) text-(--gray-900) font-display">
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
            <div className="bg-white rounded-[20px] border border-gray-100 overflow-x-auto shadow-sm">
              {/* products-table */}
              <table className="products-table w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="product-table table-th">Product</th>
                    <th className="product-table table-th">Category</th>
                    <th className="product-table table-th">Price</th>
                    <th className="product-table table-th">Created At</th>
                    <th className="product-table table-th">Status</th>
                    <th className="product-table table-th">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors">
                      {/* product-cell */}
                      <td className="product-cell px-6 py-4">
                        {/* product-cell-info */}
                        <div className="flex items-center gap-3">
                          {/* product-table-image */}
                          {product.imageUrl ? (
                            <img
                              className="w-9 h-9 bg-gray-100 rounded-[10px] border border-gray-200 object-cover"
                              src={`${product.imageUrl}?t=${product.updatedAt || Date.now()}`}
                              alt={product.name}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-9 h-9 bg-gray-100 rounded-[10px] border border-gray-200 flex items-center justify-center text-gray-400">
                              <BiSolidImage size={18} />
                            </div>
                          )}
                          <div>
                            {/* product-name-cell */}
                            <div className="font-semibold text-gray-900 font-display mb-0.5">
                              {product.name}
                            </div>
                            {/* product-desc-cell */}
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* category-cell */}
                      <td className="category-cell px-6 py-4 text-gray-600">
                        {categories.find((c) =>
                          String(c.id) ===
                          String(product.category_id ?? product.categoryId),
                        )?.name || "Uncategorized"}
                      </td>

                      {/* price-cell */}
                      <td className="price-cell px-6 py-4 font-medium text-gray-900">
                        {product.currency === "USD"
                          ? `$${Number(product.price).toFixed(2)}`
                          : `៛${Number(product.price).toLocaleString()}`}
                      </td>

                      {/* created-at-cell */}
                      <td className="created-at-cell px-6 py-4">
                        {/* stock-number */}
                        <span className="font-medium font-display px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
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

                      {/* status-cell */}
                      <td className="status-cell px-6 py-4">
                        {getStatusBadge(product.status)}
                      </td>

                      {/* actions-cell */}
                      <td className="actions-cell px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="table-action-btn edit-btn p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            onClick={() => handleEditProduct(product)}
                            title="Edit product">
                            <BiEdit size={20} />
                          </button>

                          <button
                            className="table-action-btn delete-btn p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            onClick={() => handleDeleteProduct(product.id)}
                            title="Delete product">
                            <BiTrash size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Optional: Empty state */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No products found</p>
                </div>
              )}
            </div>
          )}

          <div className="products-footer px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-center gap-2">
              {/* Previous */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50">
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
          ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}>
                      {page}
                    </button>
                  ),
                )}
              </div>

              {/* Next */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
