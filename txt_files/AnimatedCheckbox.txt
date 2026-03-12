import React from "react";
import styled from "styled-components";

const AnimatedCheckbox = ({ checked, onChange, label, description }) => {
  return (
    <StyledWrapper>
      <div className="checkbox-wrapper">
        <input
          id="animated-checkbox"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />

        <label className="terms-label" htmlFor="animated-checkbox">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 200 200"
            className="checkbox-svg">
            <mask fill="white" id="mask">
              <rect height={200} width={200} />
            </mask>

            <rect
              mask="url(#mask)"
              strokeWidth={40}
              className="checkbox-box"
              height={200}
              width={200}
            />

            <path
              strokeWidth={15}
              d="M52 111.018L76.9867 136L149 64"
              className="checkbox-tick"
            />
          </svg>

          <div className="checkbox-text">
            <span className="title">{label}</span>
            {description && <span className="hint">{description}</span>}
          </div>
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .checkbox-wrapper input {
    display: none;
  }

  .terms-label {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .checkbox-svg {
    width: 28px;
    height: 28px;
  }

  .checkbox-box {
    fill: rgba(207, 205, 205, 0.3);
    stroke: #6366f1;
    stroke-dasharray: 760;
    stroke-dashoffset: 760;
    transition: stroke-dashoffset 0.6s ease;
  }

  .checkbox-tick {
    stroke: #6366f1;
    stroke-dasharray: 172;
    stroke-dashoffset: 172;
    transition: stroke-dashoffset 0.6s ease;
  }

  .checkbox-wrapper input:checked + label .checkbox-box,
  .checkbox-wrapper input:checked + label .checkbox-tick {
    stroke-dashoffset: 0;
  }
  .checkbox-svg {
    width: 28px;
    height: 28px;
    pointer-events: none;
  }
  .checkbox-text {
    display: flex;
    flex-direction: column;
  }

  .title {
    font-weight: 600;
    font-size: 0.9rem;
    color: #1e293b;
  }

  .hint {
    font-size: 0.75rem;
    color: #94a3b8;
  }
`;

export default AnimatedCheckbox;
