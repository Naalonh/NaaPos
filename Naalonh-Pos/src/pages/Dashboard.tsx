import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Dashboard: React.FC = () => {
  useEffect(() => {
    const shopName = localStorage.getItem("shopName") || "POS";
    document.title = `Dashboard | ${shopName}`;
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-[Inter,system-ui,sans-serif] antialiased text-slate-900">
      <Sidebar />

      <div className="flex-1 ml-20 transition-[margin-left] duration-300 ease-in-out">
        <Header title="Dashboard" />

        <main className="p-7 flex flex-col gap-7">
          {/* ── 1. KPI Cards ── */}
          <section className="grid grid-cols-4 gap-5 max-[1200px]:grid-cols-2 max-[768px]:grid-cols-1">
            {/* Revenue */}
            <div className="bg-white rounded-[20px] p-6 flex items-start gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] border border-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.03)] hover:border-slate-200">
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white shrink-0 shadow-[0_4px_8px_rgba(0,0,0,0.05)] bg-linear-to-br from-indigo-500 to-violet-500">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5M17 12h-5M17 19h-5" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="block text-xs text-slate-500 font-medium uppercase tracking-[0.02em] mb-1.5">
                  Today's Revenue
                </span>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-slate-900 m-0 leading-tight font-[Outfit,system-ui,sans-serif] tracking-[-0.02em]">
                    $1,240.50
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-500">
                    +12%
                  </span>
                </div>
                <span className="text-xs text-slate-400">vs yesterday</span>
              </div>
            </div>

            {/* Orders */}
            <div className="bg-white rounded-[20px] p-6 flex items-start gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] border border-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.03)] hover:border-slate-200">
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white shrink-0 shadow-[0_4px_8px_rgba(0,0,0,0.05)] bg-linear-to-br from-blue-500 to-blue-600">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="block text-xs text-slate-500 font-medium uppercase tracking-[0.02em] mb-1.5">
                  Orders Today
                </span>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-slate-900 m-0 leading-tight font-[Outfit,system-ui,sans-serif] tracking-[-0.02em]">
                    42
                  </h2>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    8 pending
                  </span>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-[20px] p-6 flex items-start gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] border border-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.03)] hover:border-slate-200">
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white shrink-0 shadow-[0_4px_8px_rgba(0,0,0,0.05)] bg-linear-to-br from-emerald-500 to-emerald-600">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="block text-xs text-slate-500 font-medium uppercase tracking-[0.02em] mb-1.5">
                  Total Products
                </span>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-slate-900 m-0 leading-tight font-[Outfit,system-ui,sans-serif] tracking-[-0.02em]">
                    128
                  </h2>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-green-700">
                    +4 new
                  </span>
                </div>
              </div>
            </div>

            {/* Low Stock */}
            <div className="bg-linear-to-r from-white to-red-50 rounded-[20px] p-6 flex items-start gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] border border-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.03)] hover:border-slate-200">
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white shrink-0 shadow-[0_4px_8px_rgba(0,0,0,0.05)] bg-linear-to-br from-red-500 to-red-600">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <circle cx="12" cy="16" r="0.5" fill="currentColor" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="block text-xs text-slate-500 font-medium uppercase tracking-[0.02em] mb-1.5">
                  Low Stock Items
                </span>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-slate-900 m-0 leading-tight font-[Outfit,system-ui,sans-serif] tracking-[-0.02em]">
                    5
                  </h2>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-50 text-red-700">
                    Action needed
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── 2. Analytics Grid ── */}
          <section className="grid grid-cols-[2fr_1fr] gap-5 max-[1200px]:grid-cols-1">
            {/* Sales Overview */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 m-0 mb-1 font-[Outfit,system-ui,sans-serif] tracking-[-0.01em]">
                    Sales Overview
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Revenue performance over time
                  </p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-[10px]">
                  {["7d", "30d", "90d"].map((label, i) => (
                    <button
                      key={label}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 font-[Outfit,system-ui,sans-serif] tracking-[0.01em] cursor-pointer border-none
                        ${
                          i === 0
                            ? "bg-white text-indigo-500 shadow-[0_1px_2px_rgba(0,0,0,0.03)] font-semibold"
                            : "bg-transparent text-slate-600 hover:bg-indigo-500/5 hover:text-indigo-500"
                        }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <div className="h-50 bg-linear-to-b from-white to-slate-50 rounded-2xl flex items-end justify-center border border-slate-100 overflow-hidden">
                  <svg
                    width="400"
                    height="200"
                    viewBox="0 0 400 200"
                    className="w-full h-full">
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%">
                        <stop
                          offset="0%"
                          stopColor="#6366f1"
                          stopOpacity="0.4"
                        />
                        <stop
                          offset="100%"
                          stopColor="#6366f1"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <polygon
                      points="0,150 40,120 80,140 120,80 160,100 200,40 240,60 280,30 320,50 360,20 400,40 400,200 0,200"
                      fill="url(#gradient)"
                      opacity="0.1"
                    />
                    <polyline
                      points="0,150 40,120 80,140 120,80 160,100 200,40 240,60 280,30 320,50 360,20 400,40"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
              <div className="flex justify-between items-start mb-5">
                <h3 className="text-lg font-semibold text-slate-900 m-0 font-[Outfit,system-ui,sans-serif] tracking-[-0.01em]">
                  Order Status
                </h3>
                <span className="text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full font-medium font-[Outfit,system-ui,sans-serif]">
                  Updated just now
                </span>
              </div>
              <div className="flex flex-col gap-5 mt-4">
                {[
                  {
                    name: "Preparing",
                    count: 12,
                    pct: "28%",
                    fill: "bg-gradient-to-r from-orange-400 to-orange-300",
                  },
                  {
                    name: "Ready",
                    count: 4,
                    pct: "10%",
                    fill: "bg-gradient-to-r from-blue-500 to-blue-400",
                  },
                  {
                    name: "Completed",
                    count: 26,
                    pct: "62%",
                    fill: "bg-gradient-to-r from-emerald-500 to-emerald-400",
                  },
                ].map(({ name, count, pct, fill }) => (
                  <div key={name} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">
                        {name}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 font-[Outfit,system-ui,sans-serif]">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-[width] duration-300 ${fill}`}
                        style={{ width: pct }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 3. Recent Orders Table ── */}
          <section className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-6 max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 m-0 mb-1 font-[Outfit,system-ui,sans-serif] tracking-[-0.01em]">
                  Recent Orders
                </h3>
                <p className="text-sm text-slate-400 m-0">
                  Latest transactions from your store
                </p>
              </div>
              <button className="flex items-center gap-2 bg-transparent border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 cursor-pointer transition-all duration-200 font-[Outfit,system-ui,sans-serif] hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 hover:translate-x-0.5 group max-[768px]:w-full max-[768px]:justify-center">
                View All Orders
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform duration-200 group-hover:translate-x-1">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            <div className="overflow-x-auto rounded-[14px] border border-slate-100">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    {[
                      "Order ID",
                      "Customer",
                      "Amount",
                      "Status",
                      "Time",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.04em] text-slate-500 bg-slate-50 border-b border-slate-100 font-[Outfit,system-ui,sans-serif]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "#ORD-772",
                      avatar: "T4",
                      name: "Table 04",
                      amount: "$45.00",
                      status: "Preparing",
                      time: "12:45 PM",
                    },
                    {
                      id: "#ORD-771",
                      avatar: "TW",
                      name: "Takeaway",
                      amount: "$12.50",
                      status: "Ready",
                      time: "12:40 PM",
                    },
                    {
                      id: "#ORD-770",
                      avatar: "T8",
                      name: "Table 08",
                      amount: "$78.50",
                      status: "Completed",
                      time: "12:30 PM",
                    },
                  ].map((row, i, arr) => {
                    const badgeClass: Record<string, string> = {
                      Preparing:
                        "bg-amber-50 text-orange-700 border border-orange-200",
                      Ready: "bg-sky-50 text-sky-700 border border-sky-200",
                      Completed:
                        "bg-emerald-50 text-green-700 border border-green-200",
                    };
                    return (
                      <tr key={row.id} className="hover:[&>td]:bg-slate-50">
                        <td
                          className={`px-4 py-4 font-semibold text-slate-900 font-[Outfit,system-ui,sans-serif] tracking-[-0.01em] ${i < arr.length - 1 ? "border-b border-slate-100" : ""}`}>
                          {row.id}
                        </td>
                        <td
                          className={`px-4 py-4 text-slate-700 ${i < arr.length - 1 ? "border-b border-slate-100" : ""}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-[10px] flex items-center justify-center text-xs font-semibold text-slate-700 font-[Outfit,system-ui,sans-serif] border border-slate-200 shrink-0">
                              {row.avatar}
                            </div>
                            <span>{row.name}</span>
                          </div>
                        </td>
                        <td
                          className={`px-4 py-4 font-semibold text-slate-900 font-[Outfit,system-ui,sans-serif] ${i < arr.length - 1 ? "border-b border-slate-100" : ""}`}>
                          {row.amount}
                        </td>
                        <td
                          className={`px-4 py-4 ${i < arr.length - 1 ? "border-b border-slate-100" : ""}`}>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium tracking-[0.01em] font-[Outfit,system-ui,sans-serif] ${badgeClass[row.status]}`}>
                            {row.status}
                          </span>
                        </td>
                        <td
                          className={`px-4 py-4 text-slate-500 ${i < arr.length - 1 ? "border-b border-slate-100" : ""}`}>
                          {row.time}
                        </td>
                        <td
                          className={`px-4 py-4 ${i < arr.length - 1 ? "border-b border-slate-100" : ""}`}>
                          <button className="bg-transparent border-none p-1.5 rounded-lg text-slate-400 cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-slate-100 hover:text-slate-700">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2">
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
