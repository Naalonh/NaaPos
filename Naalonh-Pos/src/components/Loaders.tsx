import React from "react";
import logoIcon from "../assets/logo.png";

const Loaders: React.FC = () => {
  const text = "NaaPOS";

  return (
    <>
      <style>{`
        @keyframes clean-reveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes smooth-idle {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(0.96); opacity: 0.8; }
        }
        @keyframes line-slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
        .jumping-text span {
          display: inline-block;
          opacity: 0;
          transform: translateY(5px);
          animation: clean-reveal 0.5s forwards ease-out;
        }
        .floating-icon {
          animation: smooth-idle 2.5s ease-in-out infinite;
        }
        .swoosh-bar {
          animation: line-slide 1.8s infinite ease-in-out;
        }
      `}</style>

      <div className="fixed inset-0 w-full h-full flex justify-center items-center bg-white/85 backdrop-blur-sm z-9999">
        <div className="flex flex-row items-center gap-3">

          {/* Icon */}
          <div>
            <img
              src={logoIcon}
              alt="NaaPOS Logo"
              className="floating-icon h-12.5 w-auto"
            />
          </div>

          {/* Text Content */}
          <div>
            <div
              className="jumping-text flex"
              style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontSize: "2.8rem",
                fontWeight: 800,
                letterSpacing: "-1.5px",
                lineHeight: 1,
              }}
            >
              {text.split("").map((letter, index) => (
                <span
                  key={index}
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    color: index < 3 ? "#0056b3" : "#f37021",
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>

            {/* Accent line */}
            <div className="w-full h-0.5 bg-slate-100 mt-1 rounded-sm overflow-hidden">
              <div className="swoosh-bar w-[30%] h-full bg-linear-to-r from-[#0056b3] to-[#f37021]" />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Loaders;