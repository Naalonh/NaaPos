import React, { useState } from "react";

interface CheckBoxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  className = "",
  labelClassName = "",
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <label
      className={`flex items-center ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer group"}`}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className={`
          w-4 h-4 
          rounded 
          border-gray-300 
          text-blue-600 
          focus:ring-blue-500
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
          ${className}
        `}
      />
      {label && (
        <span
          className={`
          ml-2 
          text-sm 
          text-gray-700 
          ${!disabled && "group-hover:text-gray-900"}
          ${labelClassName}
        `}>
          {label}
        </span>
      )}
    </label>
  );
};

export default CheckBox;
