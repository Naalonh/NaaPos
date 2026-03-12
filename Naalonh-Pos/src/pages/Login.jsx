import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";
import supabase from "../lib/supabase";
import { Eye, EyeOff } from "lucide-react";
import "../css/Login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    document.title = "Login | Naalonh POS";
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw new Error(error.message);

      // 1️⃣ Get JWT token from Supabase
      const token = data.session.access_token;

      // 2️⃣ Save token
      if (formData.rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      // 3️⃣ Fetch shop info from Spring Boot
      const res = await fetch(`${API_BASE}/api/shops/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch shop");
      }

      const shop = await res.json();

      // 4️⃣ Save shop name
      const storage = formData.rememberMe ? localStorage : sessionStorage;

      storage.setItem("token", token);
      storage.setItem("shopName", shop.name);
      storage.setItem("shopId", shop.id);

      // 5️⃣ Redirect
      window.location.href = "/dashboard";
    } catch (error) {
      setErrors({
        general: error.message || "Login failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="split-panel">
        {/* Left Panel - Welcome with cover.png */}
        <div className="welcome-panel">
          <div className="welcome-content">
            <h1 className="welcome-title">Welcome to</h1>

            <img
              src="/c1.png"
              alt="Naalonh POS Cover"
              className="cover-image"
            />

            <p className="welcome-quote">
              Run your shop smarter with real-time sales and inventory
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="login-card">
          <div className="login-header">
            <h2>Sign in</h2>
            <p>Please sign in to your account</p>
          </div>

          {errors.general && (
            <div className="error-message general-error">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
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
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"} // Toggle type
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={errors.password ? "error" : ""}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            <div className="form-options">
              <div className="checkbox-wrapper-46">
                <input
                  type="checkbox"
                  id="cbx-46"
                  className="inp-cbx"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isLoading}
                />

                <label htmlFor="cbx-46" className="cbx">
                  <span>
                    <svg viewBox="0 0 12 10" height="10px" width="12px">
                      <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                    </svg>
                  </span>
                  <span>Remember me</span>
                </label>
              </div>

              <a href="/forgot-password" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <a href="/Register" className="signup-link">
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
