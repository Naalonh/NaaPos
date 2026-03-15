import React, { useState, useEffect, ChangeEvent } from "react";

interface ButtonDownloadProps {
  title: string;
  successTitle: string;
  onClick?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Buttondownload: React.FC<ButtonDownloadProps> = ({
  title,
  successTitle,
  onClick,
}) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const handleStart = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!isDownloading) {
      setIsDownloading(true);
      if (onClick) onClick(e);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isDownloading && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 1 : 100));
      }, 30);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDownloading, progress]);

  const isDone = progress === 100;

  return (
    <div className="w-full">
      <label
        className={`
          relative flex h-12.5 w-full cursor-pointer items-center justify-center 
          overflow-hidden rounded-[10px] border-2 transition-colors duration-500
          ${
            isDone
              ? "border-green-600 bg-green-50"
              : "border-indigo-500 bg-gray-50"
          }
        `}>
        <input
          type="checkbox"
          className="hidden"
          onChange={handleStart}
          disabled={isDownloading}
        />

        {/* Progress Fill */}
        <div
          className={`absolute left-0 top-0 h-full transition-[width] duration-100 ease-linear z-10
            ${isDone ? "bg-green-600/10" : "bg-indigo-500/15"}`}
          style={{ width: `${progress}%` }}
        />

        {/* Text Layer */}
        <div className="relative z-20 flex items-center justify-center">
          {!isDownloading && (
            <span className="text-base font-bold text-gray-800">{title}</span>
          )}

          {isDownloading && !isDone && (
            <span className="font-mono text-xl font-bold text-indigo-600">
              {progress}%
            </span>
          )}

          {isDone && (
            <span className="animate-in zoom-in-95 duration-300 text-base font-bold text-green-600">
              {successTitle}
            </span>
          )}
        </div>
      </label>
    </div>
  );
};

export default Buttondownload;
