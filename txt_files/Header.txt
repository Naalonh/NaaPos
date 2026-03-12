import React, { useState, useEffect } from "react";
import supabase from "../lib/supabase";
import { HiOutlineBell, HiOutlineCog } from "react-icons/hi";
import "../css/Header.css";

const Header = ({ title = "Dashboard" }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [fullName, setFullName] = useState("Loading...");
  const [email, setEmail] = useState("");
  const [roleName, setRoleName] = useState("");

  const loadUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const res = await fetch("http://localhost:8081/api/users/me", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to load user");
        return;
      }

      const data = await res.json();

      setFullName(data.fullName);
      setEmail(data.email);
      setRoleName(data.role);
    } catch (err) {
      console.error("Load user error:", err);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <header className="main-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
      </div>

      <div className="header-right">
        <button className="icon-btn" aria-label="Notifications">
          <HiOutlineBell size={20} />
          <span className="notification-badge" />
        </button>

        <button className="icon-btn" aria-label="Settings">
          <HiOutlineCog size={20} />
        </button>

        <div className="vertical-divider" />

        <div className="user-profile-wrapper">
          <div className="user-info">
            <span className="user-role">{roleName}</span>
          </div>

          <button
            className="avatar-btn"
            onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <img
              /* Updated background to a soft slate and color to indigo for a premium look */
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                fullName,
              )}&background=f1f5f9&color=6366f1&bold=true`}
              alt="Profile"
              className="avatar-img"
            />
          </button>

          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <p className="d-name">{fullName}</p>
                <p className="d-email">{email}</p>
              </div>
              <hr className="dropdown-divider" />
              <button className="dropdown-item">View Profile</button>
              <button className="dropdown-item">Account Settings</button>
              <button
                className="dropdown-item"
                style={{ color: "#e11d48" }}
                onClick={async () => {
                  await supabase.auth.signOut();
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
