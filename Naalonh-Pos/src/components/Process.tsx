import React from "react";

interface ProcessProps {
  message?: string;
}

const Process: React.FC<ProcessProps> = ({ message = "Processing..." }) => {
  return (
    <>
      <style>{`
        @keyframes progress-animation {
          0%   { width: 0%; }
          25%  { width: 25%; }
          50%  { width: 50%; }
          75%  { width: 75%; }
          100% { width: 100%; }
        }
        .progress-bar {
          width: 0%;
          height: 100%;
          background: linear-gradient(90deg, #ffffff, #e5e7eb);
          position: absolute;
          top: 0;
          left: 0;
          animation: progress-animation 2.8s ease-in-out forwards;
        }
        .progress-bar::after {
          content: attr(data-percentage);
          position: absolute;
          top: 50%;
          left: 50%;
          font-weight: 700;
          transform: translate(-50%, -50%);
          font-size: 0.9rem;
          color: black;
        }
      `}</style>

      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black/35 backdrop-blur-sm z-9999">
        <div className="flex flex-col items-center gap-4 px-10 py-7.5 bg-white rounded-[14px] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
          <p className="text-[0.95rem] font-semibold text-(--primary-500) m-0">
            {message}
          </p>

          <div className="w-90 h-7 bg-(--primary-500) relative overflow-hidden rounded-md">
            <div className="progress-bar" data-percentage="100%" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Process;