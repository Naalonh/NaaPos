import React from "react";
import { BiErrorCircle } from "react-icons/bi";

interface WarningProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

const Warning: React.FC<WarningProps> = ({
  isOpen,
  onClose,
  title,
  description,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-10000">
      <div className="w-full max-w-[320px] p-4 bg-white rounded-[10px] shadow-[20px_20px_30px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-1 pb-2.5 border-b border-slate-400">
          <BiErrorCircle className="text-amber-500 text-xl" />
          <span className="text-base font-semibold text-gray-800">
            {title || "Warning"}
          </span>
        </div>
        <p className="mt-4 text-sm leading-5 text-gray-600">{description}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-[--primary-500] text-white border-none px-5 py-2.5 rounded-[10px] text-sm font-medium font-[--font-primary] cursor-pointer transition-all duration-200 ease flex items-center gap-2 shadow-[0_4px_10px_rgba(99,102,241,0.2)] hover:bg-[--primary-600] hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(99,102,241,0.3)] focus:outline-none focus:outline-2 focus:outline-offset-2 focus:outline-transparent">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default Warning;
