import React, { useEffect, useState } from "react";
import "../css/CategoryModal.css";
import "../css/Buttons.css";

const CategoryModal = ({
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
    status: "active",
  });

  // Prefill form when editing
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
  }, [mode, category, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "sortOrder" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Category name is required");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2>{mode === "edit" ? "Edit Category" : "Add Category"}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="cm-modal-form">
          {/* Category Name */}
          <div className="cm-form-group">
            <label>Category Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter category name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Sort Order */}
          <div className="cm-form-group">
            <label>Sort Order</label>
            <input type="text" value="Auto-generated" disabled />
            {mode === "create" && (
              <small className="input-hint">Auto-generated when creating</small>
            )}
          </div>

          {/* Status */}
          <div className="cm-form-group">
            <label>Status</label>
            <div className="cm-custom-select">
              <div className="cm-selected">
                {formData.status === "active" ? "Active" : "Disabled"}
                <span className="cm-arrow">▾</span>
              </div>

              <div className="cm-options">
                <div
                  className="cm-option"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: "active" }))
                  }>
                  Active
                </div>

                <div
                  className="cm-option"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: "disabled" }))
                  }>
                  Disabled
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="cm-modal-footer">
            <button
              type="button"
              className="cancel"
              onClick={onClose}
              disabled={loading}>
              Cancel
            </button>

            <button type="submit" className="button" disabled={loading}>
              {loading ? "Saving..." : mode === "edit" ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
