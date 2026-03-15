import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelOn?: string;
  labelOff?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  labelOn = "Active",
  labelOff = "Disabled",
}) => {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer mt-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
      <span
        className={`
          w-9 h-4.5 rounded-full relative transition-colors duration-200
          ${checked ? "bg-green-500" : "bg-gray-200"}
        `}>
        <span
          className={`
            absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full 
            transition-transform duration-200
            ${checked ? "translate-x-4.5" : "translate-x-0"}
          `}
        />
      </span>

      <span className="text-sm font-medium text-gray-700">
        {checked ? labelOn : labelOff}
      </span>
    </label>
  );
};

export default Switch;
