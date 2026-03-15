import React, { useState, useRef, useEffect } from "react";
import { BiPlus, BiTrash, BiX, BiImageAdd } from "react-icons/bi";
import CropModal from "../CropModal"; // Import your CropModal
import "./OptionModal.css";
import Switch from "../common/Switch";
import AnimatedCheckbox from "../common/AnimatedCheckbox";

type Option = {
  id?: number | string | null;
  name: string;
  price: number | "";
  image: string;
  description: string;
  status: boolean;
};

type OptionGroup = {
  id?: number | null;
  groupName: string;
  required: boolean;
  status: "ACTIVE" | "DISABLED";
  options: Option[];
};

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
    { name: "", price: 0, image: "", description: "", status: true },
  ]);

  const [status, setStatus] = useState<boolean>(true);

  const [tempImage, setTempImage] = useState<string | null>(null);

  const [currentEditingIndex, setCurrentEditingIndex] = useState<number | null>(
    null,
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    // Reset form
    setGroupName("");
    setIsRequired(false);
    setOptions([
      { name: "", price: 0, image: "", description: "", status: true },
    ]);
    setStatus(true);
  };

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

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
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

        <div className="option-modal-header">
          <h2>{editingGroup ? "Edit Option Group" : "Add Option Group"}</h2>
          <button className="close-btn" onClick={onClose}>
            <BiX size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className="group-card">
            <div className="form-group">
              <label>Group Name</label>
              <input
                type="text"
                placeholder="e.g. Select Size"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
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
          <div className="options-section">
            <div className="section-header">
              <label className="section-label">Options</label>
              <span className="input-hint">{options.length} total</span>
            </div>

            <div className="options-list">
              {options.map((opt, index) => (
                <div key={opt.id || index} className="option-card">
                  <div className="option-card-header">
                    <div
                      className={`image-preview-box ${opt.image ? "has-image" : ""}`}
                      onClick={() => handleImageClick(index)}>
                      {opt.image ? (
                        <img
                          src={opt.image}
                          alt="Preview"
                          className="preview-img"
                        />
                      ) : (
                        <>
                          <BiImageAdd size={20} /> <span>Add Image</span>
                        </>
                      )}
                    </div>
                    <button
                      className="delete-card-btn"
                      disabled={options.length === 1}
                      onClick={() => removeOption(index)}>
                      <BiTrash size={18} />
                    </button>
                  </div>

                  <div className="option-inputs">
                    <div className="row-main">
                      <input
                        type="text"
                        placeholder="Option name"
                        value={opt.name}
                        onChange={(e) =>
                          handleOptionChange(index, "name", e.target.value)
                        }
                      />
                      <div className="price-input-wrapper">
                        <span className="currency">$</span>
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
                        />
                      </div>
                    </div>
                    <textarea
                      placeholder="Short description (optional)"
                      value={opt.description}
                      onChange={(e) =>
                        handleOptionChange(index, "description", e.target.value)
                      }
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
              className="add-item-btn"
              onClick={handleAddOption}>
              <BiPlus size={18} /> Add Option
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave} disabled={isSaving}>
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
