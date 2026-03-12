import React, { useState } from "react";
import styled from "styled-components";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";

const SearchInput = ({ value, onChange, placeholder }) => {
  const letters = placeholder.split("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value.trim() !== "") {
      setActiveSearch(true);
    }
  };

  const clearSearch = () => {
    onChange("");
  };

  return (
    <Wrapper>
      <div className="search">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          required
        />

        <label>
          {letters.map((letter, index) => (
            <span key={index} style={{ transitionDelay: `${index * 30}ms` }}>
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </label>

        <div className="search-icon">
          {value && value.length > 0 ? (
            <HiOutlineX onClick={clearSearch} />
          ) : (
            <HiOutlineSearch />
          )}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .search {
    position: relative;
    width: 100%;
  }

  .search input {
    width: 100%;
    padding: 10px 45px 10px 15px;
    border: 1px solid #6366f1;
    border-radius: 5px;
    background: #f1f1f1;
    outline: none;
    font-size: 16px;
    box-sizing: border-box;
  }

  .search label {
    position: absolute;
    left: 15px;
    top: 10px;
    pointer-events: none;
  }

  .search label span {
    display: inline-block;
    color: #6366f1;
    font-weight: 600;
    transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .search input:focus + label span,
  .search input:valid + label span {
    transform: translateY(-34px);
  }

  .search-icon {
    position: absolute;
    right: 12px;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #6366f1;
    cursor: pointer;
    z-index: 5;
  }
`;

export default SearchInput;
