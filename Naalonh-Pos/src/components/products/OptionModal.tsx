import React, { useState, useRef, useEffect } from "react";
import { BiPlus, BiTrash, BiX, BiImageAdd } from "react-icons/bi";
import CropModal from "../CropModal";
import Switch from "../common/Switch";
import AnimatedCheckbox from "../common/AnimatedCheckbox";
import { Option, OptionGroup } from "../../types/product";

type OptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: OptionGroup) => void;
  editingGroup?: OptionGroup | null;
};

const OptionModal: React.FC<OptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingGroup,
}) => {
  const [groupName, setGroupName] = useState<string>("");
  const [isRequired, setIsRequired] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [options, setOptions] = useState<Option[]>([
    {
      id: null,
      name: "",
      price: 0,
      image: "",
      description: "",
      status: true,
    },
  ]);
  const [status, setStatus] = useState<boolean>(true);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingGroup) {
      setGroupName(editingGroup.groupName);
      setIsRequired(editingGroup.required);
      setStatus(editingGroup.status === "ACTIVE");
      setOptions(
        editingGroup.options?.map((opt) => ({
          id: opt.id ?? null,
          name: opt.name,
          price: opt.price ?? 0,
          image: opt.image ?? "",
          description: opt.description ?? "",
          status: opt.status,
        })) || [],
      );
    }
  }, [editingGroup]);

  if (!isOpen) return null;

  const handleAddOption = () => {
    setOptions([
      ...options,
      {
        id: `temp-${Date.now()}`,
        name: "",
        price: 0,
        image: "",
        description: "",
        status: true,
      },
    ]);
  };

  const handleOptionChange = <K extends keyof Option>(
    index: number,
    field: K,
    value: Option[K],
  ) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      if (field === "price") {
        newOptions[index].price = value === "" ? "" : Number(value);
      } else {
        newOptions[index][field] = value;
      }
      return newOptions;
    });
  };

  const handleImageClick = (index: number) => {
    setCurrentEditingIndex(index);
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setTempImage(reader.result as string),
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropSave = (croppedImage: string) => {
    if (currentEditingIndex !== null) {
      handleOptionChange(currentEditingIndex, "image", croppedImage);
    }
    setTempImage(null);
    setCurrentEditingIndex(null);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSave = (): void => {
    if (!groupName.trim()) {
      alert("Group name is required");
      return;
    }

    const cleanedOptions = options.filter((opt) => opt.name.trim() !== "");

    if (cleanedOptions.length === 0) {
      alert("At least one option is required");
      return;
    }

    const newGroup: OptionGroup = {
      id: editingGroup?.id ?? null,
      groupName: groupName.trim(),
      required: isRequired,
      status: status ? "ACTIVE" : "DISABLED",
      options: cleanedOptions.map((opt) => ({
        id: opt.id ?? null,
        name: opt.name,
        price: Number(opt.price) || 0,
        image: opt.image ?? "",
        description: opt.description ?? "",
        status: opt.status,
      })),
    };

    onSave(newGroup);
    setGroupName("");
    setIsRequired(false);
    setOptions([
      { name: "", price: 0, image: "", description: "", status: true },
    ]);
    setStatus(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-5 bg-slate-900/60 backdrop-blur-sm z-5000">
      <div className="w-full max-w-120 bg-white rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] flex flex-col">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={onFileChange}
        />

        {/* Crop Modal Trigger */}
        {tempImage && (
          <CropModal
            image={tempImage}
            onSave={handleCropSave}
            onClose={() => {
              setTempImage(null);
              setCurrentEditingIndex(null);
            }}
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4">
          <h2 className="text-xl font-bold text-slate-900 m-0">
            {editingGroup ? "Edit Option Group" : "Add Option Group"}
          </h2>
          <button
            className="bg-transparent border-none cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={onClose}>
            <BiX size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 max-h-[65vh] overflow-y-auto scrollbar-none">
          <div className="border border-slate-200 rounded-xl p-4 mb-5 bg-white">
            {/* Group Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Group Name
              </label>
              <input
                type="text"
                placeholder="e.g. Select Size"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[0.95rem] transition-all focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
              />
            </div>

            <AnimatedCheckbox
              checked={isRequired}
              onChange={setIsRequired}
              label="Required Selection"
              description="Customer must pick an option"
            />

            <Switch
              checked={status}
              onChange={setStatus}
              labelOn="Active"
              labelOff="Disabled"
            />
          </div>

          {/* Options Section */}
          <div className="options-section">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-slate-600">
                Options
              </label>
              <span className="text-xs text-slate-400">
                {options.length} total
              </span>
            </div>

            <div className="flex flex-col gap-4 my-4">
              {options.map((opt, index) => (
                <div
                  key={opt.id || index}
                  className="border border-slate-200 rounded-xl p-3 bg-white">
                  {/* Option Card Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div
                      className={`flex flex-col items-center justify-center gap-1 w-20 h-20 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer overflow-hidden transition-all hover:bg-slate-200 hover:border-indigo-500 hover:text-indigo-500 text-slate-600 text-xs shrink-0 ${
                        opt.image ? "border-solid border-slate-200" : ""
                      }`}
                      onClick={() => handleImageClick(index)}>
                      {opt.image ? (
                        <img
                          src={opt.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <BiImageAdd size={20} />
                          <span className="text-center leading-none">
                            Add Image
                          </span>
                        </>
                      )}
                    </div>
                    <button
                      className="bg-red-100 text-red-500 border-none p-1.5 rounded-lg cursor-pointer transition-colors hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                      disabled={options.length === 1}
                      onClick={() => removeOption(index)}>
                      <BiTrash size={18} />
                    </button>
                  </div>

                  {/* Option Inputs */}
                  <div className="option-inputs">
                    <div className="grid grid-cols-[1fr_100px] gap-2.5 mb-2.5">
                      <input
                        type="text"
                        placeholder="Option name"
                        value={opt.name}
                        onChange={(e) =>
                          handleOptionChange(index, "name", e.target.value)
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[0.95rem] transition-all focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                      />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={opt.price}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              "price",
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value),
                            )
                          }
                          className="w-full pl-6 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-[0.95rem] transition-all focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                        />
                      </div>
                    </div>

                    <textarea
                      placeholder="Short description (optional)"
                      value={opt.description}
                      onChange={(e) =>
                        handleOptionChange(index, "description", e.target.value)
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-inherit resize-none min-h-15 mb-2.5 focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                    />

                    <Switch
                      checked={opt.status}
                      onChange={(value) =>
                        handleOptionChange(index, "status", value)
                      }
                      labelOn="Active"
                      labelOff="Disabled"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddOption}
              className="w-full bg-transparent border border-dashed border-slate-300 text-slate-500 py-2.5 rounded-xl font-medium cursor-pointer transition-all hover:bg-slate-100 hover:border-slate-400 hover:text-slate-700 flex items-center justify-center gap-1">
              <BiPlus size={18} /> Add Option
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="bg-white border border-slate-200 text-slate-500 py-3 rounded-xl font-semibold cursor-pointer hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-500 text-white border-none py-3 rounded-xl font-semibold cursor-pointer hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving
              ? editingGroup
                ? "Updating..."
                : "Saving..."
              : editingGroup
                ? "Update Group"
                : "Save Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionModal;
