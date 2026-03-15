import React from "react";

type ButtonProps = {
  text: string;
  icon?: React.ReactNode;
  bgColor?: string;
  hoverColor?: string;
  textColor?: string;
  border?: string;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  text,
  icon,
  bgColor = "bg-blue-600",
  hoverColor = "hover:bg-blue-700",
  textColor = "text-zinc-200",
  border = "",
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ease-in ${bgColor} ${hoverColor} ${textColor} ${border}`}>
      {icon && <span className="w-5 h-5 flex items-center">{icon}</span>}
      {text}
    </button>
  );
};

export default Button;
