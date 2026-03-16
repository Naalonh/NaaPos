import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ children, className = "", ...props }) => {
  return (
    <label
      {...props}
      className={`block mb-2 text-(--text-secondary) font-medium text-sm tracking-[0.3px] ${className}`}>
      {children}
    </label>
  );
};

export default Label;