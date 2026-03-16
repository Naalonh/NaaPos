import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import supabase from "../lib/supabase";

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

interface MenuItem {
  icon: React.ReactElement;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("Dashboard");
  const [shopName, setShopName] = useState<string>("Loading...");

  const menuItems: MenuItem[] = [
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

  const loadShop = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:8081/api/shops/me", {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const handleLogout = (): void => {
    console.log("Logging out...");
  };

  return (
    <aside className="group font-(--font-main) w-20 h-screen bg-(--bg-main) fixed left-0 top-0 flex flex-col z-950 border-r border-(--border-color) overflow-hidden transition-[width] duration-300 ease-in-out-[cubic-bezier(0.4,0,0.2,1)] hover:w-65 hover:shadow-[10px_0_30px_rgba(0,0,0,0.03)]">
      <div className="h-20 px-3.5 flex items-center">
        <div className="flex items-center justify-center w-full gap-3 group-hover:justify-start">
          <div className="w-8 h-8 bg-(--primary-500) text-white rounded-[10px] flex items-center justify-center">
            <HiSparkles size={18} />
          </div>
          <span className="font-bold text-[1.15rem] tracking-[-0.03em] text-(--text-main) opacity-0 w-0 overflow-hidden transition-all duration-200 ease-in-out group-hover:opacity-100 group-hover:w-auto">
            {shopName}
          </span>
        </div>
      </div>

      <div className="flex-1 py-2.5 px-3.5">
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }: { isActive: boolean }): string =>
                `cursor-pointer flex items-center py-2.5 px-3 rounded-lg text-(--text-dim) transition-all duration-200 ease-in-out relative hover:bg-(--bg-subtle) hover:text-[var(--primary-500)]${
                  isActive ? " bg-[#f1f5ff] text-(--primary-500)" : ""
                }`
              }>
              {({ isActive }: { isActive: boolean }): React.ReactElement => (
                <>
                  {isActive && (
                    <div className="absolute left-0 w-0.75 h-4 bg-(--primary-500) rounded-r" />
                  )}
                  <span className="w-6 h-6 flex items-center justify-center text-[20px] shrink-0">
                    {item.icon}
                  </span>
                  <span className="ml-3.5 text-[0.9rem] font-medium opacity-0 whitespace-nowrap transition-opacity duration-200 ease-in-out group-hover:opacity-100">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-3.5 border-t border-(--border-color) m-auto group-hover:w-full group-hover:justify-center group-hover:flex">
        <button
          className="group-hover:justify-center cursor-pointer flex items-center py-2.5 px-3 rounded-lg text-(--text-dim) transition-all duration-200 ease-in-out w-[calc(100%-24px)] hover:bg-[#fff1f2] hover:text-[#e11d48]"
          onClick={handleLogout}>
          <span className="w-6 h-6 flex items-center justify-center text-[20px] shrink-0">
            <HiOutlineLogout />
          </span>
          <span className="ml-3.5 text-[0.9rem] font-medium opacity-0 whitespace-nowrap transition-opacity duration-200 ease-in-out group-hover:opacity-100">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
