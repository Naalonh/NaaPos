import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";
import supabase from "../lib/supabase";
import { Eye, EyeOff } from "lucide-react";
// import "../css/Login.css";

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white to-[#f1f5ff]">
      <div className="flex max-w-[1000px] min-h-[640px] w-full bg-[var(--bg-main)]  border  border-[var(--border-light)] rounded-2xl overflow-hidden shadow-[var(--shadow-xl)] animate-[slideUp_0.5s_ease-out]">
        {/* Left Panel - Welcome with cover.png */}
        <div className="flex-1 px-[40px] py-[60px] flex flex-col justify-center text-center text-white relative bg-[var(--primary-500)] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)] before:opacity-40">
          <div className="relative z-10 max-w-[320px] mx-auto">
            <h1 className="font-[var(--font-display)] text-[35px] font-bold mb-2 tracking-[-0.02em] leading-[1.2] text-white/90">
              Welcome to
            </h1>

            <img
              src="/c1.png"
              alt="Naalonh POS Cover"
              className="w-full max-w-[280px] h-auto border-2 border-white/10 rounded-2xl my-6 m-auto shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-in-out hover:scale-[1.02]"
            />

            <p className="text-sm text-white/80 leading-[1.6] font-normal">
              Run your shop smarter with real-time sales and inventory
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 bg-[var(--bg-main)] py-[60px] px-[48px] flex flex-col justify-center">
          <div className="mb-6">
            <h2 className=" font-[var(--font-display)] text-2xl text-[var(--text-main)] mb-2 font-bold tracking-[-0.02em]">
              Sign in
            </h2>
            <p className="text-base text-[var(--text-dim)] font-normal">
              Please sign in to your account
            </p>
          </div>

          {errors.general && (
            <div
              className="bg-[var(--danger-50)] text-[var(--danger-700)] 
                px-[18px] py-[12px] rounded-[12px] mb-3 border border-[var(--danger-500)] font-medium 
                text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="mb-4">
              <label
                className="block mb-2 text-[var(--text-secondary)] font-medium text-sm tracking-[0.3px]"
                htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg border outline-none transition placeholder:text-[var(--text-light)] placeholder:font-normal placeholder:text-sm focus:outline-none placeholder:border-[var(--primary-500)] focus:bg-[var(--bg-main)] focus:shadow-[0_0_0_4px_var(--primary-50)]
                  ${
                    errors.email
                      ? "border-[var(--danger-500)]"
                      : "border-[var(--border-color)] focus:border-[var(--primary-500)]"
                  }`}
              />

              {errors.email && (
                <span
                  className="bg-[var(--danger-50)] text-[var(--danger-700)] 
                px-[18px] py-[12px] rounded-[12px] mb-6 border border-[var(--danger-500)] font-medium 
                text-sm">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block mb-2 text-[var(--text-secondary)] font-medium text-sm tracking-[0.3px]"
                htmlFor="password">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"} // Toggle type
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-lg border outline-none transition placeholder:text-[var(--text-light)] placeholder:font-normal placeholder:text-sm focus:outline-none placeholder:border-[var(--primary-500)] focus:bg-[var(--bg-main)] focus:shadow-[0_0_0_4px_var(--primary-50)]
                  ${
                    errors.password
                      ? "border-[var(--danger-500)]"
                      : "border-[var(--border-color)] focus:border-[var(--primary-500)]"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 bg-transparent  border-none text-[var(--text-light)] cursor-pointer flex items-center justify-center p-1 transition-colors duration-200 ease-in-out hover:text-[var(--primary-500)] focus:outline-none z-10"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="bg-[var(--danger-50)] text-[var(--danger-700)] px-[18px] py-[12px] rounded-[12px] mb-6 border border-[var(--danger-500)] font-medium text-sm">
                  {errors.password}
                </span>
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

              <a
                href="/forgot-password"
                className="text-[var(--primary-600)] text-sm font-medium no-underline transition-colors duration-200 ease hover:text-[var(--primary-500)] hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full p-4 bg-[var(--primary-600)] text-white  rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 ease-in-out shadow-[var(--shadow-md)] tracking-[0.3px]"
              disabled={isLoading}>
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
