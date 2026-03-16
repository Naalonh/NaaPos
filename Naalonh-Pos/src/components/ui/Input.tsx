import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

const Input: React.FC<InputProps> = ({ error, className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`w-full px-4 py-2 rounded-lg border outline-none transition
      placeholder:text-(--text-light) placeholder:font-normal placeholder:text-sm
      focus:outline-none placeholder:border-(--primary-500)
      focus:bg-(--bg-main) focus:shadow-[0_0_0_4px_var(--primary-50)]
      ${
        error
          ? "border-(--danger-500)"
          : "border-(--border-color) focus:border-(--primary-500)"
      }
      ${className}`}
    />
  );
};

export default Input;
