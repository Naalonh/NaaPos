import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";
import supabase from "../lib/supabase";
import FormField from "../components/ui/FormField";

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
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ErrorType>({});
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    document.title = "Login | Naalonh POS";
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof ErrorType]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): ErrorType => {
    const e: ErrorType = {};
    if (!formData.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      e.email = "Invalid email address";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 6) e.password = "At least 6 characters";
    return e;
  };

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
      const token = data.session.access_token;
      const res = await fetch(`${API_BASE}/api/shops/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch shop");
      const shop = await res.json();
      
      localStorage.clear();
      localStorage.setItem("token", token);
      localStorage.setItem("shopName", shop.name);
      localStorage.setItem("shopId", shop.id);
      window.location.href = "/dashboard";
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "Login failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // ── Floating label field ──────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .anim-fadeup { animation: fadeUp 0.45s ease forwards; font-family: 'DM Sans', sans-serif; }
        .spin { animation: spin 0.8s linear infinite; }
        .serif { font-family: 'DM Serif Display', serif; }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="anim-fadeup flex w-full max-w-215 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_24px_48px_rgba(0,0,0,0.08)]">
          {/* ── Left panel ── */}
          <div className="hidden lg:flex w-[320px] shrink-0 bg-slate-900 p-12 flex-col justify-between">
            <div>
              {/* Logo */}
              <div className="flex items-center gap-2.5 mb-14">
                <div className="w-9 h-9 rounded-[9px] bg-white flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1.5"
                      fill="#0f172a"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1.5"
                      fill="#0f172a"
                      opacity="0.4"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1.5"
                      fill="#0f172a"
                      opacity="0.4"
                    />
                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      rx="1.5"
                      fill="#0f172a"
                    />
                  </svg>
                </div>
                <span className="text-white text-base font-semibold tracking-tight">
                  Naalonh POS
                </span>
              </div>

              <h1 className="serif text-white text-[30px] leading-snug font-normal mb-3.5">
                Good to see
                <br />
                you <em className="text-slate-400">again.</em>
              </h1>

              <p className="text-slate-500 text-sm leading-relaxed mb-11">
                Sign in to continue managing your shop and tracking your sales.
              </p>

              {/* Stats */}
              <div className="border-t border-white/[0.07] pt-7 flex flex-col gap-5">
                {[
                  { value: "10k+", label: "Transactions processed" },
                  { value: "99.9%", label: "Uptime reliability" },
                  { value: "< 1s", label: "Average load time" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="text-white text-[22px] font-semibold tracking-tight leading-none">
                      {value}
                    </div>
                    <div className="text-slate-500 text-[12.5px] mt-0.5">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-slate-700 text-xs">
              © {new Date().getFullYear()} Naalonh POS
            </p>
          </div>

          {/* ── Right panel ── */}
          <div className="flex-1 bg-white px-10 py-12 flex flex-col justify-center">
            {/* Header */}
            <div className="mb-9">
              <p className="text-slate-400 text-[13px] font-semibold tracking-[0.08em] uppercase mb-2">
                Welcome back
              </p>
              <h2 className="text-slate-900 text-[26px] font-semibold tracking-tight mb-1.5">
                Sign in to your account
              </h2>
              <p className="text-slate-400 text-sm">
                No account yet?{" "}
                <a
                  href="/register"
                  className="text-slate-900 font-semibold border-b border-slate-900 no-underline hover:text-slate-600 hover:border-slate-600 transition-colors">
                  Create one →
                </a>
              </p>
            </div>

            {/* General error */}
            {errors.general && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-[13.5px] font-medium rounded-[10px] px-4 py-3 mb-5">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <FormField
                id="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                formData={formData}
                errors={errors}
                focused={focused}
                setFocused={setFocused}
                handleChange={handleChange}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                isLoading={isLoading}
              />

              <FormField
                id="password"
                label="Password"
                placeholder="Your password"
                isPassword
                formData={formData}
                errors={errors}
                focused={focused}
                setFocused={setFocused}
                handleChange={handleChange}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                isLoading={isLoading}
              />

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between mb-7">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div className="relative shrink-0">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="opacity-0 absolute w-4.5 h-4.5 cursor-pointer m-0"
                    />
                    <div
                      className={[
                        "w-4.5 h-4.5 rounded-[5px] border-[1.5px] flex items-center justify-center transition-all duration-150",
                        formData.rememberMe
                          ? "bg-slate-900 border-slate-900"
                          : "bg-white border-slate-300",
                      ].join(" ")}>
                      {formData.rememberMe && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-[13.5px] text-slate-500">
                    Remember me
                  </span>
                </label>

                <a
                  href="/forgot-password"
                  className="text-[13.5px] text-slate-900 font-semibold no-underline border-b border-slate-900 hover:text-slate-600 hover:border-slate-600 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.75 bg-slate-900 hover:bg-slate-800 disabled:opacity-55 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-[10px] flex items-center justify-center gap-2.5 transition-colors duration-200 tracking-tight">
                {isLoading ? (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="spin">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Trust footer */}
            <div className="mt-7 pt-6 border-t border-slate-100 flex items-center justify-center gap-1.5">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-[12.5px] text-slate-300">
                Secured with end-to-end encryption
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
