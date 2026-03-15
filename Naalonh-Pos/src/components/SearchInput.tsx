import React from "react";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const letters = placeholder.split("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() !== "") {
      console.log("Search triggered");
    }
  };

  const clearSearch = () => {
    onChange("");
  };

  return (
    <div className="relative w-full">
      <input
        className="peer w-full py-2.5 pr-11.25 pl-3.75 border border-[#6366f1] rounded-[5px] bg-(--primary-50) outline-none text-[16px] box-border"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        required
      />

      <label className="absolute left-3.75 top-2.5 pointer-events-none peer-focus:[&>span]:-translate-y-8.5 peer-valid:[&>span]:-translate-y-8.5">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="inline-block text-[#6366f1] font-semibold transition-transform duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]"
            style={{ transitionDelay: `${index * 30}ms` }}>
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </label>

      <div className="absolute right-3 top-0 h-full flex items-center text-[#6366f1] text-xl cursor-pointer z-10">
        {value && value.length > 0 ? (
          <HiOutlineX onClick={clearSearch} />
        ) : (
          <HiOutlineSearch />
        )}
      </div>
    </div>
  );
};

export default SearchInput;
