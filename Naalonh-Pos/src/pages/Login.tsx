import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";
import supabase from "../lib/supabase";
import { Eye, EyeOff } from "lucide-react";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type ErrorType = {
  email?: string;
  password?: string;
  general?: string;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorType>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Login | Naalonh POS";
  }, []);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof FormData]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof ErrorType]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = (): ErrorType => {
    const newErrors: ErrorType = {};

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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "Login failed" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-white to-[#f1f5ff]">
      <div className="flex max-w-250 min-h-160 w-full bg-(--bg-main)  border  border-[#f1f5f9] rounded-2xl overflow-hidden shadow-xl animate-[slideUp_0.5s_ease-out]">
        {/* Left Panel - Welcome with cover.png */}
        <div className="flex-1 px-10 py-15 flex flex-col justify-center text-center text-white relative bg-(--primary-500) before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)] before:opacity-40">
          <div className="relative z-10 max-w-[320px] mx-auto">
            <h1 className="font-display text-[35px] font-bold mb-2 tracking-[-0.02em] leading-[1.2] text-white/90">
              Welcome to
            </h1>

            <img
              src="/c1.png"
              alt="Naalonh POS Cover"
              className="w-full max-w-70 h-auto border-2 border-white/10 rounded-2xl my-6 m-auto shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-in-out hover:scale-[1.02]"
            />

            <p className="text-sm text-white/80 leading-[1.6] font-normal">
              Run your shop smarter with real-time sales and inventory
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 bg-(--bg-main) py-15 px-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className=" font-display text-2xl text-(--text-main) mb-2 font-bold tracking-[-0.02em]">
              Sign in
            </h2>
            <p className="text-base text-(--text-dim) font-normal">
              Please sign in to your account
            </p>
          </div>

          {errors.general && (
            <div
              className="bg-(--danger-50) text-(--danger-700)
                px-4.5 py-3 rounded-xl mb-3 border border-(--danger-500) font-medium 
                text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={isLoading}
                error={errors.email}
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
              <Label htmlFor="password">Password</Label>
              <div className="relative flex items-center">
                <Input
                  type={showPassword ? "text" : "password"} // Toggle type
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  error={errors.password}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 bg-transparent  border-none text-[var(--text-light)] cursor-pointer flex items-center justify-center p-1 transition-colors duration-200 ease-in-out hover:text-[var(--primary-500)] focus:outline-none z-10"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="bg-[var(--danger-50)] text-[var(--danger-700)] px-[18px] py-[12px] rounded-[12px] mb-6 border border-[var(--danger-500)] font-medium text-sm">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center mb-5">
              <Checkbox
                checked={formData.rememberMe}
                onChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    rememberMe: checked,
                  }))
                }
                disabled={isLoading}
                label="Remember me"
              />
              <a
                href="/forgot-password"
                className="text-[var(--primary-600)] text-sm font-medium no-underline transition-colors duration-200 ease hover:text-[var(--primary-500)] hover:underline">
                Forgot Password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              text={isLoading ? "Signing in..." : "Sign In"}
            />
          </form>

          <div className="mt-4 text-center text-sm text-[var(--text-dim)] pt-4 border-t border-[var(--border-color)]">
            <p>
              Don't have an account?{" "}
              <a
                href="/Register"
                className="text-[var(--primary-600)] text-sm font-medium no-underline transition-colors duration-200 ease hover:text-[var(--primary-500)] hover:underline">
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
