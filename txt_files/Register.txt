import React, { useState } from "react";
import { API_BASE } from "../config";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useEffect } from "react";
import supabase from "../lib/supabase";
import "../css/Register.css";

const Register = () => {
  useEffect(() => {
    document.title = "Register | Naalonh POS";
  }, []);
  
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [formData, setFormData] = useState({
    shopName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Shop Name validation
    if (!formData.shopName.trim()) {
      newErrors.shopName = "Shop name is required";
    } else if (formData.shopName.length < 3) {
      newErrors.shopName = "Shop name must be at least 3 characters";
    }

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone Number validation
    const cleanedPhone = formData.phoneNumber.replace(/\s+/g, "");

    if (!cleanedPhone) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[0-9]{8,15}$/.test(cleanedPhone)) {
      newErrors.phoneNumber = "Phone number must contain 8–15 digits";
    }

    // Password validation
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

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    return newErrors;
  };;;

  // Check password strength
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "No password" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&])/.test(password)) strength++;

    const strengthLevels = {
      0: { label: "Very Weak", color: "#dc3545", width: "20%" },
      1: { label: "Weak", color: "#ffc107", width: "40%" },
      2: { label: "Fair", color: "#fd7e14", width: "60%" },
      3: { label: "Good", color: "#20c997", width: "80%" },
      4: { label: "Strong", color: "#28a745", width: "90%" },
      5: { label: "Very Strong", color: "#28a745", width: "100%" },
    };

    return strengthLevels[strength] || strengthLevels[0];
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // 1️⃣ Create Supabase user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw new Error(error.message);

      const authUserId = data.user.id;

      // 2️⃣ Call Spring Boot backend
      const response = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authUserId: authUserId,
          shopName: formData.shopName,
          fullName: formData.fullName,
          phone: formData.phoneNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend registration failed");
      }

      setRegistrationSuccess(true);
    } catch (error) {
      setErrors({
        general: error.message || "Registration failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="register-container">
        <div className="register-card success-card">
          <div className="success-icon">✓</div>
          <h2>Registration Successful!</h2>
          <p>Your account has been created successfully.</p>
          <p className="success-message">
            We've sent a verification email to <strong>{formData.email}</strong>
            . Please check your inbox to verify your email address.
          </p>
          <button
            className="login-button"
            onClick={() => (window.location.href = "/login")}>
            Proceed to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Your Account</h2>
          <p>Join us and start managing your shop</p>
        </div>

        {errors.general && (
          <div className="error-message general-error">
            <span className="error-icon">⚠️</span>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          {/* Shop Name Field */}
          <div className="form-group">
            <label htmlFor="shopName">
              Shop Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="shopName"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="Enter your shop name"
              className={errors.shopName ? "error" : ""}
              disabled={isLoading}
            />
            {errors.shopName && (
              <span className="error-text">{errors.shopName}</span>
            )}
          </div>

          {/* Full Name Field */}
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.fullName ? "error" : ""}
              disabled={isLoading}
            />
            {errors.fullName && (
              <span className="error-text">{errors.fullName}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? "error" : ""}
              disabled={isLoading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Phone Number Field */}
          <div className="form-group">
            <label htmlFor="phoneNumber">
              Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={errors.phoneNumber ? "error" : ""}
              disabled={isLoading}
            />
            {errors.phoneNumber && (
              <span className="error-text">{errors.phoneNumber}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">
              Create Password <span className="required">*</span>
            </label>
            <div className="password-input-container">
              <input
                type={showPassword.password ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={errors.password ? "error" : ""}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("password")}
                tabIndex="-1">
                {showPassword.password ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: getPasswordStrength().width,
                      backgroundColor: getPasswordStrength().color,
                    }}
                  />
                </div>
                <span
                  className="strength-label"
                  style={{ color: getPasswordStrength().color }}>
                  {getPasswordStrength().label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password <span className="required">*</span>
            </label>
            <div className="password-input-container">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? "error" : ""}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                tabIndex="-1">
                {showPassword.confirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Password Requirements */}
          <div className="password-requirements">
            <p className="requirements-title">Password must contain:</p>
            <ul className="requirements-list">
              <li className={formData.password.length >= 8 ? "met" : ""}>
                At least 8 characters
              </li>
              <li
                className={/(?=.*[a-z])/.test(formData.password) ? "met" : ""}>
                One lowercase letter
              </li>
              <li
                className={/(?=.*[A-Z])/.test(formData.password) ? "met" : ""}>
                One uppercase letter
              </li>
              <li className={/(?=.*\d)/.test(formData.password) ? "met" : ""}>
                One number
              </li>
              <li
                className={
                  /(?=.*[@$!%*?&])/.test(formData.password) ? "met" : ""
                }>
                One special character (@$!%*?&) - Optional
              </li>
            </ul>
          </div>

          {/* Terms and Conditions */}
          <div className="form-group checkbox-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                disabled={isLoading}
              />
              <span className="checkbox-label">
                I agree to the{" "}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <span className="error-text">{errors.agreeToTerms}</span>
            )}
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Social Registration */}

        {/* Login Link */}
        <div className="register-footer">
          <p>
            Already have an account?{" "}
            <a href="/login" className="login-link">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
