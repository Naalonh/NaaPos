import React, { useState, useEffect, useRef } from "react";
import { OptionGroup, ProductForm } from "../../types/product";
import CropModal from "../CropModal";
import OptionModal from "./OptionModal";
import { BiSolidImage, BiPlus, BiTrash, BiEditAlt } from "react-icons/bi";

type SelectedImage = {
  preview: string;
  file: File;
};

type Category = {
  id: string;
  name: string;
};

type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductForm) => Promise<void>;
  initialData?: Partial<ProductForm>;
  categories: Category[];
};

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null,
  );
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [editingOptionGroup, setEditingOptionGroup] =
    useState<OptionGroup | null>(null);
  const defaultForm: ProductForm = {
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

  const [formData, setFormData] = useState<ProductForm>(defaultForm);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultForm,
        ...initialData,
        optionGroups: (initialData.optionGroups || []).map((g) => ({
          ...g,
          id: g.id,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setSelectedImage({
          preview: reader.result as string,
          file: file,
        });

        setIsCropModalOpen(true);
      };

      reader.readAsDataURL(file);

      e.target.value = "";
    }
  };

  const handleCropSave = async (croppedImageUrl: string) => {
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

  const handleAddOptionGroup = (newGroup: OptionGroup) => {
    setFormData((prev) => ({
      ...prev,
      optionGroups: [
        ...prev.optionGroups,
        {
          ...newGroup,
          id: newGroup.id || `temp-${Date.now()}`,
        },
      ],
    }));
  };

  const removeOptionGroup = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      optionGroups: prev.optionGroups.filter((g) => g.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-3000 animate-fadeIn">
        <div className="bg-white w-full max-w-125 max-h-[90vh] rounded-2xl flex flex-col overflow-hidden">
          <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200 bg-white sticky top-0 z-10 mb-1">
            <h2 className="font-outfit text-2xl text-slate-800 m-0">
              {initialData ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              className="bg-none border-none text-2xl text-slate-500 cursor-pointer"
              onClick={() => {
                setFormData(defaultForm);
                onClose();
              }}>
              &times;
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="overflow-y-auto flex-1 px-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col items-center gap-3 mb-6 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <div className="w-25 h-25 rounded-[20px] bg-white flex items-center justify-center overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-200">
                {formData.image ? (
                  <img
                    src={
                      formData.image?.startsWith("http")
                        ? `${formData.image}?t=${Date.now()}`
                        : formData.image
                    }
                    alt="Preview"
                    className="w-full h-full object-cover block"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-100 rounded-lg">
                    <BiSolidImage size={48} />
                  </div>
                )}
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-indigo-500 text-white border-none rounded-lg text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => fileInputRef.current?.click()}>
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

            <div className="mb-5 flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600">
                Product Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Grilled Salmon"
                className="p-2.75 border border-slate-200 rounded-md font-inter transition-all focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
              />
            </div>

            <div className="mb-5 flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600">
                Category
              </label>
              <div className="relative w-full cursor-pointer font-inter group">
                <div className="p-2.25 border border-slate-200 rounded-md bg-white flex justify-between items-center hover:border-indigo-400">
                  {categories?.find((c) => c.id === formData.category)?.name ||
                    "Select Category"}
                  <span className="text-xs text-slate-500">▾</span>
                </div>

                <div
                  className="absolute w-full bg-white border border-slate-200 rounded-md mt-px shadow-lg opacity-0 pointer-events-none -translate-y-1 transition-all
      group-hover:opacity-100
      group-hover:pointer-events-auto
      group-hover:translate-y-0
      z-100">
                  {categories
                    ?.filter((c) => c.id !== "all")
                    .map((category) => (
                      <div
                        key={category.id}
                        className="p-2.5 hover:bg-slate-100 cursor-pointer"
                        onClick={() =>
                          setFormData({ ...formData, category: category.id })
                        }>
                        {category.name}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="mb-5 flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600">
                  Currency
                </label>
                <div className="relative w-full cursor-pointer font-inter group">
                  <div className="p-2.25 border border-slate-200 rounded-md bg-white flex justify-between items-center transition-all hover:border-indigo-400">
                    {formData.currency === "USD" ? "USD ($)" : "KHR (៛)"}
                    <span className="text-xs text-slate-500">▾</span>
                  </div>

                  <div
                    className="absolute w-full bg-white border border-slate-200 rounded-md mt-px shadow-[0_10px_20px_rgba(0,0,0,0.05)] opacity-0 pointer-events-none -translate-y-1 transition-all
group-hover:opacity-100
group-hover:pointer-events-auto
group-hover:translate-y-0 z-100">
                    <div
                      className="p-2.5 rounded-[10px] transition-colors hover:bg-slate-100"
                      onClick={() =>
                        setFormData({ ...formData, currency: "USD" })
                      }>
                      USD ($)
                    </div>

                    <div
                      className="p-2.5 rounded-[10px] transition-colors hover:bg-slate-100"
                      onClick={() =>
                        setFormData({ ...formData, currency: "KHR" })
                      }>
                      KHR (៛)
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-5 flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600">
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
                  className="p-2.75 border border-slate-200 rounded-md font-inter transition-all focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                />
              </div>
            </div>

            <div className="mb-5 flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600">
                Description
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="p-2.75 border border-slate-200 rounded-md font-inter transition-all focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
              />
            </div>

            <div className="mb-5 flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600">
                Status
              </label>

              <div className="w-full">
                <div className="flex relative items-center w-full bg-white shadow-[0_0_1px_rgba(24,94,224,0.15),0_6px_12px_rgba(24,94,224,0.15)] p-1 rounded-xl">
                  <input
                    type="radio"
                    id="status-active"
                    name="status"
                    checked={formData.status === "active"}
                    onChange={() =>
                      setFormData({ ...formData, status: "active" })
                    }
                    className="hidden"
                  />
                  <label
                    htmlFor="status-active"
                    className="flex-1 flex items-center justify-center text-center h-9 leading-11.5 text-sm text-slate-700 font-bold rounded-[10px] cursor-pointer transition-colors relative z-2 peer-checked:text-blue-600">
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
                    className="hidden"
                  />
                  <label
                    htmlFor="status-disabled"
                    className="flex-1 flex items-center justify-center text-center h-9 leading-11.5 text-sm text-slate-700 font-bold rounded-[10px] cursor-pointer transition-colors relative z-2 peer-checked:text-blue-600">
                    Disabled
                  </label>

                  <span
                    className={`absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-blue-50 rounded-[10px] transition-transform duration-250 z-1 ${
                      formData.status === "disabled"
                        ? "translate-x-full"
                        : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="mb-5 flex flex-col gap-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-600 m-0">
                  Option Groups
                </label>
                <button
                  type="button"
                  className="add-option-btn flex items-center gap-1 px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-indigo-500 cursor-pointer"
                  onClick={() => setIsOptionModalOpen(true)}>
                  <BiPlus size={16} /> Add Option Group
                </button>
              </div>

              {/* List of Added Groups */}
              <div className="flex flex-col gap-2">
                {formData.optionGroups?.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => {
                      setEditingOptionGroup(group);
                      setIsOptionModalOpen(true);
                    }}
                    className="flex justify-between items-center p-3.5 bg-slate-50 rounded-[10px] border border-slate-200 cursor-pointer hover:bg-slate-100 hover:border-indigo-400 transition-colors">
                    <div>
                      <span className="font-semibold text-slate-800 text-sm">
                        {group.groupName}
                      </span>

                      <span className="ml-2 text-xs text-slate-500">
                        ({group.options.length} options)
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <BiEditAlt size={18} color="#6366f1" />

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (group.id != null) {
                            removeOptionGroup(String(group.id));
                          }
                        }}
                        className="bg-none border-none text-red-500 cursor-pointer">
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
                              groupName: groupData.groupName,
                              required: groupData.required,
                              status: groupData.status,
                              options: groupData.options,
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

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-200 bg-white sticky bottom-0 z-3">
              <button
                type="button"
                className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-semibold cursor-pointer"
                onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-500 text-white border-none rounded-xl font-semibold cursor-pointer shadow-[0_4px_6px_-1px_rgba(99,102,241,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSaving}>
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

      {/* Render CropModal when triggered */}
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
