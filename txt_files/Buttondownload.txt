import React from "react";
import styled from "styled-components";

const Buttondownload = ({ title, successTitle, onClick }) => {
  return (
    <StyledWrapper>
      <div className="bg-container">
        <label className="bg-label">
          <input type="checkbox" className="bg-input" onClick={onClick} />
          <span className="bg-circle">
            <svg
              className="icon"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 19V5m0 14-4-4m4 4 4-4"
              />
            </svg>
            <div className="bg-square" />
          </span>
          <p className="bg-title">{title}</p>
          <p className="bg-title">{successTitle}</p>
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .bg-container {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
    width: 100%;
    display: flex;
  }

  .bg-label {
    background-color: transparent;
    border: 2px solid rgb(91, 91, 240);
    display: flex;
    align-items: center;
    border-radius: 50px;
    width: 100%;
    max-width: 100%;
    cursor: pointer;
    transition: all 0.4s ease;
    padding: 2px;
    position: relative;
    gap: 10px;
  }

  .bg-label::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    width: 8px;
    height: 8px;
    transition: all 0.4s ease;
    border-radius: 100%;
    margin: auto;
    opacity: 0;
    visibility: hidden;
  }

  .bg-label .bg-input {
    display: none;
  }

  .bg-label .bg-title {
    font-size: 17px;
    color: #333;
    transition: all 0.4s ease;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }

  .bg-label .bg-title:last-child {
    opacity: 0;
    visibility: hidden;
  }

  .bg-label .bg-circle {
    height: 35px;
    width: 35px;
    border-radius: 50%;
    background-color: rgb(91, 91, 240);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.4s ease;
    position: relative;
    box-shadow: 0 0 0 0 rgb(255, 255, 255);
    overflow: hidden;
  }

  .bg-label .bg-circle .icon {
    color: #fff;
    width: 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.4s ease;
  }

  .bg-label .bg-circle .bg-square {
    aspect-ratio: 1;
    width: 15px;
    border-radius: 2px;
    background-color: #fff;
    opacity: 0;
    visibility: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.4s ease;
  }

  .bg-label .bg-circle::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    background-color: #3333a8;
    width: 100%;
    height: 0;
    transition: all 0.4s ease;
  }

  .bg-label:has(.bg-input:checked) {
    width: 42px;
    animation: installed 0.4s ease 3.5s forwards;
  }

  .bg-label:has(.bg-input:checked)::before {
    animation: rotate 3s ease-in-out 0.4s forwards;
  }

  .bg-label .bg-input:checked + .bg-circle {
    animation:
      pulse 1s forwards,
      circleDelete 0.2s ease 3.5s forwards;
    rotate: 180deg;
  }

  .bg-label .bg-input:checked + .bg-circle::before {
    animation: installing 3s ease-in-out forwards;
  }

  .bg-label .bg-input:checked + .bg-circle .icon {
    opacity: 0;
    visibility: hidden;
  }

  .bg-label .bg-input:checked ~ .bg-circle .bg-square {
    opacity: 1;
    visibility: visible;
  }

  .bg-label .bg-input:checked ~ .bg-title {
    opacity: 0;
    visibility: hidden;
  }

  .bg-label .bg-input:checked ~ .bg-title:last-child {
    animation: showInstalledMessage 0.4s ease 3.5s forwards;
  }

  @keyframes pulse {
    0% {
      scale: 0.95;
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
    }
    70% {
      scale: 1;
      box-shadow: 0 0 0 16px rgba(255, 255, 255, 0);
    }
    100% {
      scale: 0.95;
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  }

  @keyframes installing {
    from {
      height: 0;
    }
    to {
      height: 100%;
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(-90deg) translate(27px) rotate(0);
      opacity: 1;
      visibility: visible;
    }
    99% {
      transform: rotate(270deg) translate(27px) rotate(270deg);
      opacity: 1;
      visibility: visible;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes installed {
    100% {
      width: 100%;
      border-color: rgb(35, 174, 35);
    }
  }

  @keyframes circleDelete {
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes showInstalledMessage {
    100% {
      opacity: 1;
      visibility: visible;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

export default Buttondownload;
