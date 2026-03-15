import React, { useState, useEffect, useRef } from "react";
import "./ProductModal.css";
import CropModal from "../CropModal"; // 1. Uncomment this import
import OptionModal from "./OptionModal";
import { BiSolidImage, BiPlus, BiTrash, BiEditAlt } from "react-icons/bi";

const ProductModal = ({ isOpen, onClose, onSave, initialData, categories }) => {
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [editingOptionGroup, setEditingOptionGroup] = useState(null);

  const defaultForm = {
    name: "",
    category: "",
    currency: "USD",
    price: "",
    description: "",
    status: "active",
    image: null,
    imageFile: null,
    optionGroups: [],
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultForm,
        ...initialData,
        optionGroups: (initialData.optionGroups || []).map((g) => ({
          ...g,
          id: g.id, // preserve database id
        })),
      });
    } else {
      setFormData({
        ...defaultForm,
        category: categories?.[1]?.id || "",
      });
    }
  }, [initialData, isOpen, categories]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setSelectedImage({
          preview: reader.result,
          file: file,
        });

        setIsCropModalOpen(true);
      };

      reader.readAsDataURL(file);

      e.target.value = "";
    }
  };

  const handleCropSave = async (croppedImageUrl) => {
    const response = await fetch(croppedImageUrl);
    const blob = await response.blob();

    const croppedFile = new File([blob], "product.jpg", { type: "image/jpeg" });

    setFormData((prev) => ({
      ...prev,
      image: croppedImageUrl,
      imageFile: croppedFile,
    }));

    setIsCropModalOpen(false);
  };

  const handleAddOptionGroup = (newGroup) => {
    setFormData((prev) => ({
      ...prev,
      optionGroups: [
        ...(prev.optionGroups || []),
        {
          ...newGroup,
          id: newGroup.id || `temp-${Date.now()}`, // keep DB id if exists
        },
      ],
    }));
  };

  const removeOptionGroup = (id) => {
    setFormData((prev) => ({
      ...prev,
      optionGroups: prev.optionGroups.filter((g) => g.id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaving) return;

    setIsSaving(true);

    try {
      await onSave(formData);
      setFormData(defaultForm);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>{initialData ? "Edit Product" : "Add New Product"}</h2>
            <button
              className="close-btn"
              onClick={() => {
                setFormData(defaultForm);
                onClose();
              }}>
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="product-form">
            <div className="image-upload-section">
              <div className="image-preview-container">
                {/* 2. Logic check: If image is a dataURL (longer than an emoji) */}
                {formData.image ? (
                  <img
                    src={
                      formData.image?.startsWith("http")
                        ? `${formData.image}?t=${Date.now()}`
                        : formData.image
                    }
                    alt="Preview"
                    className="img-preview"
                  />
                ) : (
                  <div className="icon-placeholder">
                    <BiSolidImage size={48} />
                  </div>
                )}
              </div>
              <button
                type="button"
                className="upload-trigger-btn"
                onClick={() => fileInputRef.current.click()}>
                Upload Image
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                hidden
              />
            </div>

            <div className="pm-form-group">
              <label>Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Grilled Salmon"
              />
            </div>

            <div className="pm-form-group">
              <label>Category</label>
              <div className="custom-select">
                <div className="selected">
                  {categories?.find((c) => c.id === formData.category)?.name ||
                    "Select Category"}
                  <span className="arrow">▾</span>
                </div>

                <div className="options">
                  {categories
                    ?.filter((c) => c.id !== "all")
                    .map((category) => (
                      <div
                        key={category.id}
                        className="option"
                        onClick={() =>
                          setFormData({ ...formData, category: category.id })
                        }>
                        {category.name}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="pm-form-group">
                <label>Currency</label>
                <div className="custom-select">
                  <div className="selected">
                    {formData.currency === "usd" ? "USD ($)" : "KHR (៛)"}
                    <span className="arrow">▾</span>
                  </div>

                  <div className="options">
                    <div
                      className="option"
                      onClick={() =>
                        setFormData({ ...formData, currency: "USD" })
                      }>
                      USD ($)
                    </div>

                    <div
                      className="option"
                      onClick={() =>
                        setFormData({ ...formData, currency: "KHR" })
                      }>
                      KHR (៛)
                    </div>
                  </div>
                </div>
              </div>
              <div className="pm-form-group">
                <label>
                  Price {formData.currency === "USD" ? "($)" : "(៛)"}
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price:
                        e.target.value === "" ? "" : parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="pm-form-group">
              <label>Description</label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }></textarea>
            </div>

            <div className="pm-form-group">
              <label>Status</label>

              <div className="status-tabs">
                <div className="tabs">
                  <input
                    type="radio"
                    id="status-active"
                    name="status"
                    checked={formData.status === "active"}
                    onChange={() =>
                      setFormData({ ...formData, status: "active" })
                    }
                  />
                  <label htmlFor="status-active" className="tab">
                    Active
                  </label>

                  <input
                    type="radio"
                    id="status-disabled"
                    name="status"
                    checked={formData.status === "disabled"}
                    onChange={() =>
                      setFormData({ ...formData, status: "disabled" })
                    }
                  />
                  <label htmlFor="status-disabled" className="tab">
                    Disabled
                  </label>

                  <span className="glider"></span>
                </div>
              </div>
            </div>

            <div className="pm-form-group">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}>
                <label style={{ margin: 0 }}>Option Groups</label>
                <button
                  type="button"
                  className="add-option-btn"
                  onClick={() => setIsOptionModalOpen(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 8px",
                    background: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: "#6366f1",
                    cursor: "pointer",
                  }}>
                  <BiPlus size={16} /> Add Option Group
                </button>
              </div>

              {/* List of Added Groups */}
              <div
                className="option-groups-list"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}>
                {formData.optionGroups?.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => {
                      setEditingOptionGroup(group);
                      setIsOptionModalOpen(true);
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      background: "#f8fafc",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      cursor: "pointer",
                    }}>
                    <div>
                      <span
                        style={{
                          fontWeight: "600",
                          color: "#1e293b",
                          fontSize: "0.9rem",
                        }}>
                        {group.groupName}
                      </span>

                      <span
                        style={{
                          marginLeft: "8px",
                          fontSize: "0.75rem",
                          color: "#64748b",
                        }}>
                        ({group.options.length} options)
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <BiEditAlt size={18} color="#6366f1" />

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOptionGroup(group.id);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                        }}>
                        <BiTrash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Render the OptionModal */}
            {isOptionModalOpen && (
              <OptionModal
                isOpen={isOptionModalOpen}
                editingGroup={editingOptionGroup}
                onClose={() => {
                  setIsOptionModalOpen(false);
                  setEditingOptionGroup(null);
                }}
                onSave={(groupData) => {
                  if (editingOptionGroup) {
                    setFormData((prev) => ({
                      ...prev,
                      optionGroups: prev.optionGroups.map((g) =>
                        g.id === editingOptionGroup.id
                          ? {
                              ...g,
                              ...groupData,
                              id: g.id,
                            }
                          : g,
                      ),
                    }));
                  } else {
                    handleAddOptionGroup(groupData);
                  }

                  setEditingOptionGroup(null);
                  setIsOptionModalOpen(false);
                }}
              />
            )}

            <div className="pmodal-modal-footer">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-btn" disabled={isSaving}>
                {isSaving
                  ? initialData
                    ? "Updating..."
                    : "Saving..."
                  : initialData
                    ? "Update Product"
                    : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. Render CropModal when triggered */}
      {isCropModalOpen && selectedImage?.preview && (
        <CropModal
          image={selectedImage.preview}
          onSave={handleCropSave}
          onClose={() => setIsCropModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProductModal;
