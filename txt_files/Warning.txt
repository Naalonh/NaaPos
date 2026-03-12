import React from "react";
import styled from "styled-components";
import { BiErrorCircle } from "react-icons/bi";

const Warning = ({ isOpen, onClose, title, description }) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <div className="warning-card">
        <div className="w-header">
          <BiErrorCircle className="w-icon" />
          <span className="w-title">{title || "Warning"}</span>
        </div>
        <p className="w-description">{description}</p>
        <div className="w-actions">
          <button className="w-accept" onClick={onClose}>
            Accept
          </button>
        </div>
      </div>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;

  .w-header {
    display: flex;
    align-items: center;
    gap: 4px;
    padding-bottom: 10px;
    border-bottom: 1px solid #94a3b8;
  }

  .w-icon {
    font-size: 20px;
    color: #f59e0b;
  }

  .warning-card {
    width: 100%;
    max-width: 320px;
    padding: 1rem;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 20px 20px 30px rgba(0, 0, 0, 0.05);
  }

  .w-title {
    font-size: 16px;
    font-weight: 600;
    color: rgb(31 41 55);
  }

  .w-description {
    margin-top: 1rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: rgb(75 85 99);
  }

  .w-description a {
    --tw-text-opacity: 1;
    color: rgb(59 130 246);
  }

  .w-description a:hover {
    -webkit-text-decoration-line: underline;
    text-decoration-line: underline;
  }

  .w-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }

  .w-accept {
    background: var(--primary-500);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    font-family: var(--font-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 10px rgba(99, 102, 241, 0.2);
  }

  .w-accept:hover {
    background: var(--primary-600);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(99, 102, 241, 0.3);
  }

  .w-accept:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
`;

export default Warning;
