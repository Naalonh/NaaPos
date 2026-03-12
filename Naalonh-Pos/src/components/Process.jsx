import React from "react";
import styled from "styled-components";

const Process = ({ message = "Processing..." }) => {
  return (
    <StyledWrapper>
      <div className="process-box">
        <p className="process-text">{message}</p>

        <div className="loader">
          <div className="progress" data-percentage="100%" />
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
    
  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);

  z-index: 9999;

  .process-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    padding: 30px 40px;
    background: white;
    border-radius: 14px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .process-text {
    font-size: 0.95rem;
    font-weight: 600;
    color: #111827;
  }

  .loader {
    width: 360px;
    height: 28px;
    background-color: #000;
    position: relative;
    overflow: hidden;
    border-radius: 6px;
  }

  .progress {
    width: 0%;
    height: 100%;
    background: linear-gradient(90deg, #ffffff, #e5e7eb);
    position: absolute;
    top: 0;
    left: 0;
    animation: progress-animation 2.8s ease-in-out forwards;
  }

  .progress::after {
    content: attr(data-percentage);
    position: absolute;
    top: 50%;
    left: 50%;
    font-weight: 700;
    transform: translate(-50%, -50%);
    font-size: 0.9rem;
    color: black;
  }

  @keyframes progress-animation {
    0% {
      width: 0%;
    }
    25% {
      width: 25%;
    }
    50% {
      width: 50%;
    }
    75% {
      width: 75%;
    }
    100% {
      width: 100%;
    }
  }

  @keyframes percentage-animation {
    0% {
      content: "0%";
    }
    25% {
      content: "25%";
    }
    50% {
      content: "50%";
    }
    75% {
      content: "75%";
    }
    100% {
      content: "100%";
    }
  }

  .progress::after {
    animation: percentage-animation 2.8s ease-in-out forwards;
  }
`;

export default Process;
