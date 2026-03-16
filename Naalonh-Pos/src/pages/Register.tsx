import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";
import { FiEye, FiEyeOff } from "react-icons/fi";
import supabase from "../lib/supabase";

// ── Types ──────────────────────────────────────────────────────────────────

interface FormData {
  shopName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  shopName?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

interface ShowPassword {
  password: boolean;
  confirmPassword: boolean;
}

interface StrengthLevel {
  label: string;
  color: string;
  width: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const STRENGTH_LEVELS: Record<number, StrengthLevel> = {
  0: { label: "Very Weak", color: "#dc3545", width: "20%" },
  1: { label: "Weak", color: "#ffc107", width: "40%" },
  2: { label: "Fair", color: "#fd7e14", width: "60%" },
  3: { label: "Good", color: "#20c997", width: "80%" },
  4: { label: "Strong", color: "#28a745", width: "90%" },
  5: { label: "Very Strong", color: "#28a745", width: "100%" },
};

// ── Shared input class builder ─────────────────────────────────────────────

const inputCls = (hasError: boolean, disabled: boolean): string =>
  [
    "w-full px-4 py-3 border-2 rounded-[10px] text-base transition-all duration-300",
    "focus:outline-none",
    hasError
      ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(231,76,60,0.1)]"
      : "border-gray-200 focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]",
    disabled ? "bg-gray-100 cursor-not-allowed" : "",
  ]
    .filter(Boolean)
    .join(" ");

// ── Component ──────────────────────────────────────────────────────────────

const Register: React.FC = () => {
  useEffect(() => {
    document.title = "Register | Naalonh POS";
  }, []);

  const [showPassword, setShowPassword] = useState<ShowPassword>({
    password: false,
    confirmPassword: false,
  });

  const [formData, setFormData] = useState<FormData>({
    shopName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);

  const togglePasswordVisibility = (field: keyof ShowPassword): void => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.shopName.trim()) {
      newErrors.shopName = "Shop name is required";
    } else if (formData.shopName.length < 3) {
      newErrors.shopName = "Shop name must be at least 3 characters";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const cleanedPhone = formData.phoneNumber.replace(/\s+/g, "");
    if (!cleanedPhone) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[0-9]{8,15}$/.test(cleanedPhone)) {
      newErrors.phoneNumber = "Phone number must contain 8–15 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    return newErrors;
  };

  const getPasswordStrength = (): StrengthLevel => {
    const { password } = formData;
    if (!password) return { ...STRENGTH_LEVELS[0], label: "No password" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&])/.test(password)) strength++;

    return STRENGTH_LEVELS[strength] ?? STRENGTH_LEVELS[0];
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw new Error(error.message);

      const authUserId = data.user?.id;

      const response = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authUserId,
          shopName: formData.shopName,
          fullName: formData.fullName,
          phone: formData.phoneNumber,
        }),
      });

      if (!response.ok) throw new Error("Backend registration failed");

      setRegistrationSuccess(true);
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "Registration failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Password requirements list ─────────────────────────────────────────

  const requirements: { label: string; met: boolean }[] = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    {
      label: "One lowercase letter",
      met: /(?=.*[a-z])/.test(formData.password),
    },
    {
      label: "One uppercase letter",
      met: /(?=.*[A-Z])/.test(formData.password),
    },
    { label: "One number", met: /(?=.*\d)/.test(formData.password) },
    {
      label: "One special character (@$!%*?&) - Optional",
      met: /(?=.*[@$!%*?&])/.test(formData.password),
    },
  ];

  // ── Password field helper ──────────────────────────────────────────────

  const PasswordField = ({
    id,
    label,
    field,
    placeholder,
  }: {
    id: keyof FormData;
    label: string;
    field: keyof ShowPassword;
    placeholder: string;
  }) => (
    <div className="mb-5">
      <label
        htmlFor={id as string}
        className="block mb-2 text-[#555] font-medium text-sm">
        {label} <span className="text-red-500 ml-0.5">*</span>
      </label>
      <div className="relative flex items-center">
        <input
          type={showPassword[field] ? "text" : "password"}
          id={id as string}
          name={id as string}
          value={formData[id] as string}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${inputCls(!!errors[id as keyof FormErrors], isLoading)} pr-11`}
          disabled={isLoading}
        />
        <button
          type="button"
          className="absolute right-3 bg-transparent border-none cursor-pointer text-gray-400 flex items-center justify-center p-1 transition-colors duration-300 hover:text-[#667eea] focus:outline-none"
          onClick={() => togglePasswordVisibility(field)}
          tabIndex={-1}>
          {showPassword[field] ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {errors[id as keyof FormErrors] && (
        <span className="block mt-1.5 text-red-500 text-[13px]">
          {errors[id as keyof FormErrors]}
        </span>
      )}
    </div>
  );

  // ── Success screen ────────────────────────────────────────────────────

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5">
        <div className="bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-[60px_40px] w-full max-w-[550px] text-center animate-[slideUp_0.5s_ease]">
          <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-5 animate-[scaleIn_0.5s_ease]">
            ✓
          </div>
          <h2 className="text-[#333] mb-4 font-semibold text-2xl">
            Registration Successful!
          </h2>
          <p className="text-[#666] mb-2.5">
            Your account has been created successfully.
          </p>
          <p className="bg-gray-50 p-4 rounded-[10px] my-5 text-sm text-[#666]">
            We've sent a verification email to <strong>{formData.email}</strong>
            . Please check your inbox to verify your email address.
          </p>
          <button
            className="w-full py-3.5 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(102,126,234,0.4)]"
            onClick={() => (window.location.href = "/login")}>
            Proceed to Login
          </button>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────

  const strength = getPasswordStrength();

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5">
        <div
          className="bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-10 w-full max-w-[550px] max-h-[90vh] overflow-y-auto
            [animation:slideUp_0.5s_ease]
            [scrollbar-width:thin] [scrollbar-color:#c1c1c1_#f1f1f1]
            max-[600px]:px-5 max-[480px]:px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-[#333] text-[28px] font-semibold mb-2.5 max-[600px]:text-2xl">
              Create Your Account
            </h2>
            <p className="text-[#666] text-base">
              Join us and start managing your shop
            </p>
          </div>

          {/* General error */}
          {errors.general && (
            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-5 text-sm border-l-4 border-red-500 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mb-5">
            {/* Shop Name */}
            <div className="mb-5">
              <label
                htmlFor="shopName"
                className="block mb-2 text-[#555] font-medium text-sm">
                Shop Name <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                id="shopName"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="Enter your shop name"
                className={inputCls(!!errors.shopName, isLoading)}
                disabled={isLoading}
              />
              {errors.shopName && (
                <span className="block mt-1.5 text-red-500 text-[13px]">
                  {errors.shopName}
                </span>
              )}
            </div>

            {/* Full Name */}
            <div className="mb-5">
              <label
                htmlFor="fullName"
                className="block mb-2 text-[#555] font-medium text-sm">
                Full Name <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={inputCls(!!errors.fullName, isLoading)}
                disabled={isLoading}
              />
              {errors.fullName && (
                <span className="block mt-1.5 text-red-500 text-[13px]">
                  {errors.fullName}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-[#555] font-medium text-sm">
                Email Address <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={inputCls(!!errors.email, isLoading)}
                disabled={isLoading}
              />
              {errors.email && (
                <span className="block mt-1.5 text-red-500 text-[13px]">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Phone */}
            <div className="mb-5">
              <label
                htmlFor="phoneNumber"
                className="block mb-2 text-[#555] font-medium text-sm">
                Phone Number <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={inputCls(!!errors.phoneNumber, isLoading)}
                disabled={isLoading}
              />
              {errors.phoneNumber && (
                <span className="block mt-1.5 text-red-500 text-[13px]">
                  {errors.phoneNumber}
                </span>
              )}
            </div>

            {/* Password */}
            <PasswordField
              id="password"
              label="Create Password"
              field="password"
              placeholder="Create a strong password"
            />

            {/* Password strength meter */}
            {formData.password && (
              <div className="flex items-center gap-2.5 mt-2 mb-5 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-1">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-sm overflow-hidden max-[600px]:w-full">
                  <div
                    className="h-full rounded-sm transition-all duration-300"
                    style={{
                      width: strength.width,
                      backgroundColor: strength.color,
                    }}
                  />
                </div>
                <span
                  className="text-xs font-semibold min-w-[70px]"
                  style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}

            {/* Confirm Password */}
            <PasswordField
              id="confirmPassword"
              label="Confirm Password"
              field="confirmPassword"
              placeholder="Confirm your password"
            />

            {/* Password requirements */}
            <div className="bg-gray-50 rounded-[10px] p-4 mb-5">
              <p className="text-[#555] text-sm font-semibold mb-2">
                Password must contain:
              </p>
              <ul className="list-none p-0 m-0">
                {requirements.map(({ label, met }) => (
                  <li
                    key={label}
                    className={`text-[13px] mb-1 pl-5 relative transition-colors duration-300 ${
                      met ? "text-green-500" : "text-gray-400"
                    }`}>
                    <span className="absolute left-0">{met ? "✓" : "○"}</span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Terms checkbox */}
            <div className="mb-6">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-[18px] h-[18px] mt-0.5 cursor-pointer max-[480px]:mt-[3px]"
                />
                <span className="text-[#555] text-sm leading-relaxed">
                  I agree to the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#667eea] no-underline font-medium transition-colors duration-300 hover:text-[#764ba2] hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#667eea] no-underline font-medium transition-colors duration-300 hover:text-[#764ba2] hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreeToTerms && (
                <span className="block mt-1.5 text-red-500 text-[13px]">
                  {errors.agreeToTerms}
                </span>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_5px_20px_rgba(102,126,234,0.4)]">
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-[3px] border-white/30 rounded-full border-t-white animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-[#666] text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#667eea] no-underline font-semibold transition-colors duration-300 hover:text-[#764ba2] hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
