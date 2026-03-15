import React from "react";

const Label = ({ children, className = "", ...props }) => {
  return (
    <label
      {...props}
      className={`block mb-2 text-[var(--text-secondary)] font-medium text-sm tracking-[0.3px] ${className}`}>
      {children}
    </label>
  );
};

export default Label;
