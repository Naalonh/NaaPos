import React from "react";

const Input = ({ error, className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-lg border outline-none transition placeholder:text-[var(--text-light)] placeholder:font-normal placeholder:text-sm focus:outline-none placeholder:border-[var(--primary-500)] focus:bg-[var(--bg-main)] focus:shadow-[0_0_0_4px_var(--primary-50)]
      ${
        error
          ? "border-[var(--danger-500)]"
          : "border-[var(--border-color)] focus:border-[var(--primary-500)]"
      }
      ${className}`}
    />
  );
};

export default Input;
