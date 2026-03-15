import React, { useEffect, useState } from "react";
import Button from "./ui/Button";

interface Category {
  id: string;
  name: string;
  status: "active" | "disabled";
  sortOrder?: number;
  createdAt?: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    name: string;
    status: "active" | "disabled";
  }) => Promise<void>;
  mode: "create" | "edit";
  category?: Category | null;
  nextSortOrder?: number;
  loading?: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode = "create",
  category = null,
  nextSortOrder = 1,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    sortOrder: 0,
    status: "active" as "active" | "disabled",
  });
  const [statusOpen, setStatusOpen] = useState(false);
  useEffect(() => {
    if (mode === "edit" && category) {
      setFormData({
        name: category.name || "",
        sortOrder: category.sortOrder ?? 1,
        status: category.status || "active",
      });
    } else {
      setFormData({
        name: "",
        sortOrder: nextSortOrder,
        status: "active",
      });
    }
  }, [mode, category, isOpen, nextSortOrder]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sortOrder" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Category name is required");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md h-125 overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-display text-xl font-bold text-slate-800">
            {mode === "edit" ? "Edit Category" : "Add Category"}
          </h2>
          <button
            className="text-slate-400 transition-colors hover:text-slate-600"
            onClick={onClose}>
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 px-6 pt-4 pb-2 overflow-hidden">
          {/* Category Name */}
          <div className="mb-5 flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter category name"
              className="rounded-lg border border-slate-200 p-3 font-sans transition-all focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/10"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Sort Order */}
          <div className="mb-5 flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600">
              Sort Order
            </label>
            <input
              type="text"
              value="Auto-generated"
              disabled
              className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-500"
            />
            {mode === "create" && (
              <small className="text-xs text-slate-400 italic">
                Auto-generated when creating
              </small>
            )}
          </div>

          {/* Status Select */}
          <div className="mb-5 flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600">
              Status
            </label>
            <div className="group relative w-full cursor-pointer">
              <div
                onClick={() => setStatusOpen(!statusOpen)}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 cursor-pointer hover:border-indigo-500">
                <span className="capitalize">{formData.status}</span>
                <span className="text-xs text-slate-400 group-hover:text-indigo-500">
                  ▼
                </span>
              </div>

              {/* Options Menu */}
              <div
                className={`absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-xl transition-all duration-150 ${
                  statusOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}>
                {(["active", "disabled"] as const).map((status) => (
                  <div
                    key={status}
                    onClick={() => {
                      setFormData((p) => ({ ...p, status }));
                      setStatusOpen(false);
                    }}
                    className="p-3 capitalize transition-colors hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg">
                    {status}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions - Sticky Footer */}
          <div className="sticky bottom-0 -mx-6 mt-4 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
            <Button
              type="button"
              text="Cancel"
              onClick={onClose}
              disabled={loading}
              bgColor="bg-transparent"
              hoverColor="hover:bg-slate-100"
              textColor="text-[var(--gray-700)]"
              border="border border-gray-200"
              className="px-6 py-2 rounded-lg"
            />

            <Button
              type="submit"
              text={
                loading ? "Saving..." : mode === "edit" ? "Update" : "Create"
              }
              disabled={loading}
              bgColor="bg-indigo-600"
              hoverColor="hover:bg-indigo-700"
              textColor="text-white"
              className="px-6 py-2 rounded-lg shadow-lg shadow-indigo-500/20 active:scale-95"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
