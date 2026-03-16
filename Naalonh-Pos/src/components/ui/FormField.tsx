import React from "react";

export type FieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  isPassword?: boolean;
  passwordField?: string;
  formData: any;
  errors: any;
  focused: string;
  setFocused: (v: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword?: any;
  togglePasswordVisibility?: (field: any) => void;
  isLoading?: boolean;
};

const FormField = React.memo(
  ({
    id,
    label,
    type = "text",
    placeholder,
    isPassword,
    passwordField,
    formData,
    errors,
    focused,
    setFocused,
    handleChange,
    showPassword,
    togglePasswordVisibility,
    isLoading,
  }: FieldProps) => {
    const hasError = !!errors[id];
    const isFocused = focused === id;
    const val = formData[id];
    const isActive = isFocused || !!val;

    return (
      <div className="relative mb-5">
        <label
          htmlFor={id}
          className={[
            "absolute left-3.5 pointer-events-none z-10 transition-all duration-200",
            isActive
              ? "-top-2 text-[11px] font-semibold uppercase tracking-widest bg-white px-1"
              : "top-3.5 text-sm font-normal",
            hasError
              ? "text-red-500"
              : isFocused
                ? "text-slate-900"
                : "text-slate-400",
          ].join(" ")}>
          {label}
        </label>

        <input
          id={id}
          name={id}
          type={
            isPassword && passwordField
              ? showPassword?.[passwordField]
                ? "text"
                : "password"
              : type
          }
          value={val}
          onChange={handleChange}
          onFocus={() => setFocused(id)}
          onBlur={() => setFocused("")}
          placeholder={isFocused ? placeholder : ""}
          disabled={isLoading}
          className={[
            "w-full px-3.5 py-3.5 text-[15px] text-slate-900 rounded-[10px] outline-none transition-all duration-200 placeholder:text-slate-300",
            hasError
              ? "border-[1.5px] border-red-400"
              : isFocused
                ? "border-[1.5px] border-slate-900 shadow-[0_0_0_3px_rgba(15,23,42,0.06)]"
                : "border-[1.5px] border-slate-200",
          ].join(" ")}
        />
      </div>
    );
  },
);

export default FormField;
