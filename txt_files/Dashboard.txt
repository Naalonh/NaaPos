import React from "react";
import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../css/Dashboard.css";

const Dashboard = () => {
  useEffect(() => {
    const shopName = localStorage.getItem("shopName") || "POS";
    document.title = `Dashboard | ${shopName}`;
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-container">
        <Header title="Dashboard" />

        <main className="dashboard-content">
          {/* 1. KPI Cards Row - Cleaner cards with subtle design */}
          <section className="kpi-grid">
            <div className="stat-card">
              <div className="stat-icon revenue">
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
              <div className="stat-content">
                <span className="stat-label">Today's Revenue</span>
                <div className="stat-value-wrapper">
                  <h2 className="stat-value">$1,240.50</h2>
                  <span className="stat-trend positive">+12%</span>
                </div>
                <span className="stat-comparison">vs yesterday</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orders">
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
              <div className="stat-content">
                <span className="stat-label">Orders Today</span>
                <div className="stat-value-wrapper">
                  <h2 className="stat-value">42</h2>
                  <span className="stat-badge">8 pending</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon products">
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
              <div className="stat-content">
                <span className="stat-label">Total Products</span>
                <div className="stat-value-wrapper">
                  <h2 className="stat-value">128</h2>
                  <span className="stat-badge success">+4 new</span>
                </div>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-icon low-stock">
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
              <div className="stat-content">
                <span className="stat-label">Low Stock Items</span>
                <div className="stat-value-wrapper">
                  <h2 className="stat-value">5</h2>
                  <span className="stat-badge danger">Action needed</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Charts & Operational Visibility - Cleaner layout */}
          <section className="analytics-grid">
            <div className="analytics-card main-chart">
              <div className="analytics-header">
                <div>
                  <h3>Sales Overview</h3>
                  <p className="analytics-subtitle">
                    Revenue performance over time
                  </p>
                </div>
                <div className="chart-toggles">
                  <button className="toggle-btn active">7d</button>
                  <button className="toggle-btn">30d</button>
                  <button className="toggle-btn">90d</button>
                </div>
              </div>
              <div className="chart-container">
                <div className="chart-placeholder">
                  <svg
                    width="400"
                    height="200"
                    viewBox="0 0 400 200"
                    className="chart-preview">
                    <polyline
                      points="0,150 40,120 80,140 120,80 160,100 200,40 240,60 280,30 320,50 360,20 400,40"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                    />
                    <polygon
                      points="0,150 40,120 80,140 120,80 160,100 200,40 240,60 280,30 320,50 360,20 400,40 400,200 0,200"
                      fill="url(#gradient)"
                      opacity="0.1"
                    />
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
                  </svg>
                </div>
              </div>
            </div>

            <div className="analytics-card order-status">
              <div className="analytics-header">
                <h3>Order Status</h3>
                <span className="status-update">Updated just now</span>
              </div>
              <div className="status-distribution">
                <div className="status-item">
                  <div className="status-info">
                    <span className="status-name">Preparing</span>
                    <span className="status-count">12</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill preparing"
                      style={{ width: "28%" }}></div>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-info">
                    <span className="status-name">Ready</span>
                    <span className="status-count">4</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill ready"
                      style={{ width: "10%" }}></div>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-info">
                    <span className="status-name">Completed</span>
                    <span className="status-count">26</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill completed"
                      style={{ width: "62%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Recent Orders Table - Cleaner table design */}
          <section className="orders-section">
            <div className="orders-header">
              <div>
                <h3>Recent Orders</h3>
                <p className="orders-subtitle">
                  Latest transactions from your store
                </p>
              </div>
              <button className="view-all-btn">
                View All Orders
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
            <div className="table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="order-id">#ORD-772</td>
                    <td className="customer-info">
                      <div className="customer-avatar">T4</div>
                      <span>Table 04</span>
                    </td>
                    <td className="amount">$45.00</td>
                    <td>
                      <span className="status-badge preparing">Preparing</span>
                    </td>
                    <td className="time">12:45 PM</td>
                    <td>
                      <button className="action-btn">
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
                  <tr>
                    <td className="order-id">#ORD-771</td>
                    <td className="customer-info">
                      <div className="customer-avatar">TW</div>
                      <span>Takeaway</span>
                    </td>
                    <td className="amount">$12.50</td>
                    <td>
                      <span className="status-badge ready">Ready</span>
                    </td>
                    <td className="time">12:40 PM</td>
                    <td>
                      <button className="action-btn">
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
                  <tr>
                    <td className="order-id">#ORD-770</td>
                    <td className="customer-info">
                      <div className="customer-avatar">T8</div>
                      <span>Table 08</span>
                    </td>
                    <td className="amount">$78.50</td>
                    <td>
                      <span className="status-badge completed">Completed</span>
                    </td>
                    <td className="time">12:30 PM</td>
                    <td>
                      <button className="action-btn">
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
