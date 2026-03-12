import React from "react";
import "../css/Loaders.css";
import logoIcon from "../assets/logo.png";

const Loaders = () => {
  const text = "NaaPOS";

  return (
    <div className="full-page-center">
      <div className="loader-wrapper">
        {/* The Icon */}
        <div className="icon-container">
          <img src={logoIcon} alt="NaaPOS Logo" className="floating-icon" />
        </div>

        {/* The Text Content */}
        <div className="text-content">
          <div className="jumping-text">
            {text.split("").map((letter, index) => (
              <span
                key={index}
                style={{ animationDelay: `${index * 0.05}s` }}
                className={index < 3 ? "blue-letter" : "orange-letter"}>
                {letter}
              </span>
            ))}
          </div>

          {/* Subtle accent line */}
          <div className="swoosh-container">
            <div className="swoosh-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loaders;
