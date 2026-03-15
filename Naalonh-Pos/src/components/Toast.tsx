import React from "react";

// Define toast types
type ToastType = "success" | "info" | "warning" | "error" | "default";

// Define props interface
interface ToastProps {
  type?: ToastType;
  message: string;
  onClose: () => void;
}

// Define toast configuration interface
interface ToastConfig {
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  textColor: string;
}

// Toast types configuration with Tailwind classes
const TOAST_TYPES: Record<ToastType, ToastConfig> = {
  success: {
    bgColor: "bg-[#edfbd8]",
    borderColor: "border-[#84d65a]",
    iconColor: "text-[#84d65a]",
    textColor: "text-[#2b641e]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    ),
  },
  info: {
    bgColor: "bg-[#eff6ff]",
    borderColor: "border-[#1d4ed8]",
    iconColor: "text-[#1d4ed8]",
    textColor: "text-[#1d4ed8]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    ),
  },
  warning: {
    bgColor: "bg-[#fefce8]",
    borderColor: "border-[#facc15]",
    iconColor: "text-[#facc15]",
    textColor: "text-[#ca8a04]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    ),
  },
  error: {
    bgColor: "bg-[#fef2f2]",
    borderColor: "border-[#f87171]",
    iconColor: "text-[#f87171]",
    textColor: "text-[#991b1b]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    ),
  },
  default: {
    bgColor: "bg-white",
    borderColor: "border-gray-300",
    iconColor: "text-gray-600",
    textColor: "text-gray-800",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        />
      </>
    ),
  },
};

const Toast: React.FC<ToastProps> = ({
  type = "default",
  message,
  onClose,
}) => {
  const config = TOAST_TYPES[type] || TOAST_TYPES.default;

  return (
    <li className={`list-none m-2.5`}>
      <div
        className={`
        flex items-center justify-between
        w-75 px-2 py-1.5
        rounded border
        shadow-[4px_4px_10px_-10px_rgba(0,0,0,1)]
        ${config.bgColor} ${config.borderColor}
      `}>
        {/* Left section with icon and message */}
        <div className="flex items-center gap-2">
          {/* Icon */}
          <div className="flex items-center">
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className={`w-5 h-5 ${config.iconColor}`}>
              {config.icon}
            </svg>
          </div>

          {/* Message */}
          <div className={`font-light ${config.textColor}`}>{message}</div>
        </div>

        {/* Close button */}
        <div
          className="flex items-center cursor-pointer ml-auto"
          onClick={onClose}
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              onClose();
            }
          }}>
          <svg
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18 17.94 6M18 18 6.06 6"
            />
          </svg>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-gray-200 rounded-b overflow-hidden">
        <div className="h-full w-full bg-gray-400 animate-[progress_3s_linear]"></div>
      </div>
    </li>
  );
};

// Optional: Add animation keyframes to your global CSS or use Tailwind's arbitrary variants
// Add this to your global CSS file:
/*
@keyframes progress {
  0% { width: 100%; }
  100% { width: 0%; }
}
*/

export default Toast;
