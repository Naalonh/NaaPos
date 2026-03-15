// AnimatedCheckbox.tsx
import React from "react";

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  checked,
  onChange,
  label,
  description,
}) => {
  return (
    <div className="block mb-6 select-none bg-slate-50 rounded-xl w-full">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
        id="animated-checkbox"
      />
      <label
        htmlFor="animated-checkbox"
        className="flex items-center cursor-pointer p-3.5 rounded-xl w-full box-border hover:bg-emerald-50/5">
        <div className="relative w-5.5 h-5.5 border-2 border-slate-300 rounded-md mr-3 transition-all duration-300 bg-white flex items-center justify-center shrink-0">
          <div
            className={`absolute inset-0 bg-linear-to-r from-indigo-400 to-indigo-500 transition-all duration-500 rounded-sm ${
              checked ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          />
          <svg
            className={`relative z-10 w-3.5 h-3.5 fill-white transition-all duration-500 ${
              checked
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-30 rotate-20"
            }`}
            viewBox="0 0 24 24">
            <path
              d="M20 6L9 17L4 12"
              stroke="white"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            className={`absolute top-1/2 left-1/2 w-0 h-0 bg-indigo-400/40 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none ${
              checked ? "animate-ripple" : ""
            }`}
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-sm text-slate-700">{label}</span>
          {description && (
            <span className="text-xs text-slate-400">{description}</span>
          )}
        </div>
      </label>
    </div>
  );
};

export default AnimatedCheckbox;
