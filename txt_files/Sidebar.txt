import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import supabase from "../lib/supabase";
import "../css/Sidebar.css";
import {
  HiOutlineHome,
  HiOutlineShoppingCart,
  HiOutlineClipboardList,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineCog,
  HiOutlineTable,
  HiOutlineLogout,
  HiSparkles,
  HiOutlineCube,
  HiOutlineViewGrid,
} from "react-icons/hi";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [shopName, setShopName] = useState("Loading...");
  const menuItems = [
    { icon: <HiOutlineHome />, label: "Dashboard", path: "/dashboard" },
    { icon: <HiOutlineShoppingCart />, label: "Orders", path: "/orders" },
    { icon: <HiOutlineTable />, label: "Tables", path: "/tables" },
    { icon: <HiOutlineCube />, label: "Products", path: "/products" },
    { icon: <HiOutlineViewGrid />, label: "Categories", path: "/categories" },
    { icon: <HiOutlineClipboardList />, label: "Menu", path: "/menu" },
    { icon: <HiOutlineChartBar />, label: "Reports", path: "/reports" },
    { icon: <HiOutlineUserGroup />, label: "Staff", path: "/staff" },
    { icon: <HiOutlineCog />, label: "Settings", path: "/settings" },
  ];

  const loadShop = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const res = await fetch("http://localhost:8081/api/shops/me", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to load shop");
        return;
      }

      const data = await res.json();
      setShopName(data.name);
    } catch (err) {
      console.error("Load shop error:", err);
    }
  };

  useEffect(() => {
    loadShop();
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-wrapper">
          <div className="logo-icon">
            <HiSparkles size={18} />
          </div>
          <span className="logo-text">{shopName}</span>
        </div>
      </div>

      <div className="sidebar-content">
        <nav className="nav-group">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }>
              {({ isActive }) => (
                <>
                  {isActive && <div className="active-dot" />}
                  <span className="icon-box">{item.icon}</span>
                  <span className="label-text">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button
          className="logout-button"
          onClick={() => console.log("Logging out...")}>
          <span className="icon-box">
            <HiOutlineLogout />
          </span>
          <span className="label-text">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
