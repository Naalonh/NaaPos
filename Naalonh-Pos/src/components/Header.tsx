import { useState, useEffect } from "react";
import supabase from "../lib/supabase";
import { HiOutlineBell, HiOutlineCog } from "react-icons/hi";


type HeaderProps = {
  title?: string;
};

type UserResponse = {
  fullName: string;
  email: string;
  role: string;
};

const Header = ({ title = "Dashboard" }: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const [fullName, setFullName] = useState<string>("Loading...");
  const [email, setEmail] = useState<string>("");
  const [roleName, setRoleName] = useState<string>("");

  const loadUser = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:8081/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to load user");
        return;
      }

      const data: UserResponse = await res.json();

      setFullName(data.fullName);
      setEmail(data.email);
      setRoleName(data.role);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Load user error:", err.message);
      } else {
        console.error("Load user error:", err);
      }
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <header className="font-(--font-primary) h-18 flex items-center justify-between px-8 py-0 bg-white border-b border-(--border-color) sticky top-0 z-900">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-semibold text-(--text-main) m-0 tracking-[-0.02em]">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-[10px] text-(--text-dim) relative transition-all duration-200 ease hover:bg-(--bg-hover) hover:text-(--primary-500)"
          aria-label="Notifications">
          <HiOutlineBell size={20} />
          <span className="absolute top-2.5 right-2.5 w-1.75 h-1.75 bg-(--danger-500) border-2 border-white rounded-full" />
        </button>

        <button
          className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-[10px] text-(--text-dim) relative transition-all duration-200 ease hover:bg-(--bg-hover) hover:text-(--primary-500)"
          aria-label="Settings">
          <HiOutlineCog size={20} />
        </button>

        <div className="w-px h-6 bg-(--border-color) mx-3" />

        <div className="relative flex items-center gap-3 pl-1">
          <div>
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.05em] bg-(--border-light) px-2.5 py-1 rounded-md text-(--text-secondary)">
              {roleName}
            </span>
          </div>

          <button
            className="group cursor-pointer flex items-center"
            onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                fullName,
              )}&background=f1f5f9&color=6366f1&bold=true`}
              alt="Profile"
              className="w-10 h-10 rounded-xl border border-(--border-color) transition-all duration-200 group-hover:-translate-y-px group-hover:border-indigo-500"
            />
          </button>

          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-(--border-color) rounded-lg shadow-lg animate-[slideDown_0.2s_ease-out]">
              <div className="py-2.5 px-3">
                <p className="font-semibold text-sm text-(--primary-500) ml-0.5">
                  {fullName}
                </p>
                <p className="text-sm border-t border-(--border-color) mt-1 pt-1">
                  {email}
                </p>
              </div>
              <hr className="border-t border-(--border-color)" />
              <button className="flex items-center justify-center w-full py-3 px-2 text-[0.85rem] font-medium text-(--text-dim) rounded-lg cursor-pointer transition-all duration-200 ease hover:bg-(--bg-subtle) hover:text-(--primary-500)">
                View Profile
              </button>
              <button className="flex items-center justify-center w-full py-3 px-2 text-[0.85rem] font-medium text-(--text-dim) rounded-lg cursor-pointer transition-all duration-200 ease hover:bg-(--bg-subtle) hover:text-(--primary-500)">
                Account Settings
              </button>
              <button
                className="flex items-center justify-center w-full py-3 px-2 text-[0.85rem] font-medium text-(--text-dim) rounded-lg cursor-pointer transition-all duration-200 ease hover:bg-(--bg-subtle) hover:text-(--primary-500)"
                style={{ color: "#e11d48" }}
                onClick={async () => {
                  await supabase.auth.signOut();

                  localStorage.clear();
                  sessionStorage.clear();

                  window.location.href = "/login";
                }}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
