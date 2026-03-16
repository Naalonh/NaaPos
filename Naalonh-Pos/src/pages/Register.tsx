import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";
import supabase from "../lib/supabase";
import FormField from "../components/ui/FormField";

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
  barColor: string;
}

const STRENGTH_LEVELS: Record<number, StrengthLevel> = {
  0: {
    label: "Very Weak",
    color: "text-red-500",
    width: "w-[16%]",
    barColor: "bg-red-400",
  },
  1: {
    label: "Weak",
    color: "text-orange-500",
    width: "w-[32%]",
    barColor: "bg-orange-400",
  },
  2: {
    label: "Fair",
    color: "text-yellow-500",
    width: "w-[52%]",
    barColor: "bg-yellow-400",
  },
  3: {
    label: "Good",
    color: "text-green-500",
    width: "w-[72%]",
    barColor: "bg-green-400",
  },
  4: {
    label: "Strong",
    color: "text-green-600",
    width: "w-[88%]",
    barColor: "bg-green-500",
  },
  5: {
    label: "Very Strong",
    color: "text-green-700",
    width: "w-full",
    barColor: "bg-green-600",
  },
};


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
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [focused, setFocused] = useState("");

  const togglePasswordVisibility = (field: keyof ShowPassword) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof FormErrors])
      setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): FormErrors => {
    const e: FormErrors = {};
    if (!formData.shopName.trim()) e.shopName = "Shop name is required";
    else if (formData.shopName.length < 3) e.shopName = "At least 3 characters";
    if (!formData.fullName.trim()) e.fullName = "Full name is required";
    else if (formData.fullName.length < 3) e.fullName = "At least 3 characters";
    if (!formData.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      e.email = "Invalid email address";
    const cleaned = formData.phoneNumber.replace(/\s+/g, "");
    if (!cleaned) e.phoneNumber = "Phone number is required";
    else if (!/^\+?[0-9]{8,15}$/.test(cleaned))
      e.phoneNumber = "Must be 8–15 digits";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 8) e.password = "At least 8 characters";
    else if (!/(?=.*[a-z])/.test(formData.password))
      e.password = "Add a lowercase letter";
    else if (!/(?=.*[A-Z])/.test(formData.password))
      e.password = "Add an uppercase letter";
    else if (!/(?=.*\d)/.test(formData.password)) e.password = "Add a number";
    if (!formData.confirmPassword)
      e.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords don't match";
    if (!formData.agreeToTerms) e.agreeToTerms = "You must agree to continue";
    return e;
  };

  const getStrength = (): StrengthLevel => {
    const { password } = formData;
    if (!password) return { ...STRENGTH_LEVELS[0], label: "" };
    let s = 0;
    if (password.length >= 8) s++;
    if (/(?=.*[a-z])/.test(password)) s++;
    if (/(?=.*[A-Z])/.test(password)) s++;
    if (/(?=.*\d)/.test(password)) s++;
    if (/(?=.*[@$!%*?&])/.test(password)) s++;
    return STRENGTH_LEVELS[s] ?? STRENGTH_LEVELS[0];
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
      if (!response.ok)
        throw new Error("Registration failed. Please try again.");
      setRegistrationSuccess(true);
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "Registration failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requirements = [
    { label: "8+ chars", met: formData.password.length >= 8 },
    { label: "Lowercase", met: /(?=.*[a-z])/.test(formData.password) },
    { label: "Uppercase", met: /(?=.*[A-Z])/.test(formData.password) },
    { label: "Number", met: /(?=.*\d)/.test(formData.password) },
    { label: "Special", met: /(?=.*[@$!%*?&])/.test(formData.password) },
  ];
  const strength = getStrength();

  // ── Success screen ──────────────────────────────────────────────────────

  if (registrationSuccess) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
          @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
          @keyframes checkPop { 0%{transform:scale(0) rotate(-20deg);} 70%{transform:scale(1.1);} 100%{transform:scale(1);} }
          .anim-fadeup { animation: fadeUp 0.5s ease forwards; font-family: 'DM Sans', sans-serif; }
          .anim-check { animation: checkPop 0.5s 0.1s ease both; }
        `}</style>
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-5">
          <div className="anim-fadeup bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_20px_40px_rgba(0,0,0,0.06)] p-16 w-full max-w-110 text-center">
            <div className="anim-check w-18 h-18 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-7">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-slate-900 text-2xl font-semibold tracking-tight mb-2.5">
              Account created
            </h2>
            <p className="text-slate-500 text-[15px] leading-relaxed mb-6">
              A verification email was sent to{" "}
              <strong className="text-slate-900">{formData.email}</strong>.
              Please verify to continue.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-[15px] font-semibold rounded-[10px] transition-colors duration-200 tracking-tight">
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Main form ───────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .anim-fadeup { animation: fadeUp 0.45s ease forwards; font-family: 'DM Sans', sans-serif; }
        .spin { animation: spin 0.8s linear infinite; }
        .serif { font-family: 'DM Serif Display', serif; }
        .reg-scroll::-webkit-scrollbar { width: 4px; }
        .reg-scroll::-webkit-scrollbar-track { background: transparent; }
        .reg-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 8px; }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="anim-fadeup flex w-full max-w-240 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_24px_48px_rgba(0,0,0,0.08)]">
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

              <h1 className="serif text-white text-[32px] leading-snug font-normal mb-4">
                Run your shop
                <br />
                <em className="text-slate-400">smarter.</em>
              </h1>

              <p className="text-slate-500 text-sm leading-relaxed mb-10">
                Everything you need to manage sales, inventory, and customers —
                in one place.
              </p>

              {[
                { icon: "📦", text: "Inventory tracking" },
                { icon: "🧾", text: "Instant receipts" },
                { icon: "📊", text: "Sales analytics" },
                { icon: "👥", text: "Customer management" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 mb-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center text-[15px] shrink-0">
                    {icon}
                  </div>
                  <span className="text-slate-400 text-[13.5px]">{text}</span>
                </div>
              ))}
            </div>

            <p className="text-slate-700 text-xs">
              © {new Date().getFullYear()} Naalonh POS
            </p>
          </div>

          {/* ── Right panel ── */}
          <div className="reg-scroll flex-1 bg-white px-10 py-12 overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="mb-8">
              <p className="text-slate-400 text-[13px] font-semibold tracking-[0.08em] uppercase mb-2">
                Get started
              </p>
              <h2 className="text-slate-900 text-[26px] font-semibold tracking-tight mb-1.5">
                Create your account
              </h2>
              <p className="text-slate-400 text-sm">
                Already registered?{" "}
                <a
                  href="/login"
                  className="text-slate-900 font-semibold border-b border-slate-900 no-underline hover:text-slate-600 hover:border-slate-600 transition-colors">
                  Sign in →
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
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-x-4">
                <FormField
                  id="shopName"
                  label="Shop Name"
                  placeholder="Your shop name"
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
                  id="fullName"
                  label="Full Name"
                  placeholder="Your full name"
                  formData={formData}
                  errors={errors}
                  focused={focused}
                  setFocused={setFocused}
                  handleChange={handleChange}
                  showPassword={showPassword}
                  togglePasswordVisibility={togglePasswordVisibility}
                  isLoading={isLoading}
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-x-4">
                <FormField
                  id="email"
                  label="Email"
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
                  id="phoneNumber"
                  label="Phone Number"
                  type="tel"
                  placeholder="+855 12 345 678"
                  formData={formData}
                  errors={errors}
                  focused={focused}
                  setFocused={setFocused}
                  handleChange={handleChange}
                  showPassword={showPassword}
                  togglePasswordVisibility={togglePasswordVisibility}
                  isLoading={isLoading}
                />
              </div>

              {/* Password */}
              <FormField
                id="password"
                label="Password"
                isPassword
                passwordField="password"
                placeholder="Create a strong password"
                formData={formData}
                errors={errors}
                focused={focused}
                setFocused={setFocused}
                handleChange={handleChange}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                isLoading={isLoading}
              />

              {/* Strength bar */}
              {formData.password && (
                <div className="-mt-2 mb-5">
                  <div className="h-0.75 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.width} ${strength.barColor}`}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-3 flex-wrap">
                      {requirements.map(({ label, met }) => (
                        <span
                          key={label}
                          className={`flex items-center gap-1 text-[11px] transition-colors duration-200 ${met ? "text-green-600" : "text-slate-300"}`}>
                          <svg
                            width="9"
                            height="9"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            {met ? (
                              <polyline points="20 6 9 17 4 12" />
                            ) : (
                              <circle cx="12" cy="12" r="9" />
                            )}
                          </svg>
                          {label}
                        </span>
                      ))}
                    </div>
                    {strength.label && (
                      <span
                        className={`text-[11px] font-semibold ${strength.color}`}>
                        {strength.label}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <FormField
                id="confirmPassword"
                label="Confirm Password"
                isPassword
                passwordField="confirmPassword"
                placeholder="Re-enter your password"
                formData={formData}
                errors={errors}
                focused={focused}
                setFocused={setFocused}
                handleChange={handleChange}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                isLoading={isLoading}
              />

              {/* Terms */}
              <div className="mb-6">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <div className="relative shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="opacity-0 absolute w-4.5 h-4.5 cursor-pointer m-0"
                    />
                    <div
                      className={[
                        "w-4.5 h-4.5 rounded-[5px] border-[1.5px] flex items-center justify-center transition-all duration-150",
                        errors.agreeToTerms
                          ? "border-red-400"
                          : formData.agreeToTerms
                            ? "bg-slate-900 border-slate-900"
                            : "bg-white border-slate-300",
                      ].join(" ")}>
                      {formData.agreeToTerms && (
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
                  <span className="text-[13.5px] text-slate-500 leading-relaxed select-none">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-900 font-semibold border-b border-slate-900 no-underline hover:text-slate-600 hover:border-slate-600 transition-colors">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-900 font-semibold border-b border-slate-900 no-underline hover:text-slate-600 hover:border-slate-600 transition-colors">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1.5 ml-7 text-xs text-red-500 font-medium">
                    {errors.agreeToTerms}
                  </p>
                )}
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
                    Creating account…
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
