import "../../assets/style/sales.css";

import Breadcrumb from "../common/Breadcrumb";
import Card from "../common/Card";

const stats = [
  {
    title: "Store Status",
    value: "Good",
    badge: "88%",
    gradient: true,
  },
  {
    title: "Total Sales",
    value: "$314k",
    icon: "📊",
  },
  {
    title: "Total Profit",
    value: "$90k",
    icon: "💲",
  },
  {
    title: "Revenue",
    value: "$9102k",
    icon: "📷",
  },
];

const topProducts = [
  { name: "iPod", price: "$250" },
  { name: "iMac", price: "$589" },
  { name: "iPhone x", price: "$1292" },
];
const regionalSales = [
  { name: "Ohio", value: "30.5%", color: "ohio" },
  { name: "Texas", value: "18.3%", color: "texas" },
  { name: "UK", value: "12.2%", color: "uk" },
  { name: "Florida", value: "10.1%", color: "florida" },
  { name: "Hawaii", value: "8.5%", color: "hawaii" },
  { name: "Indiana", value: "7.8%", color: "indiana" },
  { name: "UK", value: "6.0%", color: "uk2" },
  { name: "Belgium", value: "3.6%", color: "belgium" },
  { name: "Colorado", value: "3.0%", color: "colorado" },
];

const mapDots = [
  { className: "dot-1" },
  { className: "dot-2" },
  { className: "dot-3" },
  { className: "dot-4" },
  { className: "dot-5" },
  { className: "dot-6" },
  { className: "dot-7" },
  { className: "dot-8" },
];
// SALES OVERVIEW DATA
const salesOverviewData = [
  { month: "jan", profit: 42, expense: 32, revenue: 75 },
  { month: "Feb", profit: 42, expense: 32, revenue: 75 },
  { month: "Mar", profit: 54, expense: 39, revenue: 84 },
  { month: "Apr", profit: 56, expense: 34, revenue: 100 },
  { month: "May", profit: 55, expense: 24, revenue: 97 },
  { month: "Jun", profit: 60, expense: 43, revenue: 87 },
  { month: "Jul", profit: 57, expense: 46, revenue: 103 },
  { month: "Aug", profit: 62, expense: 50, revenue: 90 },
  { month: "Sep", profit: 58, expense: 51, revenue: 113 },
  { month: "Oct", profit: 64, expense: 39, revenue: 93 },
  { month: "Nov", profit: 66, expense: 45, revenue: 98 },
  { month: "Dec", profit: 70, expense: 48, revenue: 120 },
];

const legends = [
  { label: "Profit", className: "sale-purple" },
  { label: "Expense", className: "sale-red" },
  { label: "Revenue", className: "sale-pink" },
];

const Sales = () => {
  return (
    <div className="sales-page">
      {/* Header */}
      <div className="page-top">
        <h1 className="sale-page-title">Sales</h1>
        <Breadcrumb />
      </div>

      {/* Stats */}
      <div className="sale-stats-grid">
        {stats.map((item, index) => (
          <Card key={index}>
            <div className="sale-stat-card">
              <div
                className={`sale-stat-icon ${item.gradient ? "sale-gradient-bg" : ""
                  }`}
              >
                {item.badge || item.icon}
              </div>

              <div>
                <p className="sale-stat-title">{item.title}</p>
                <h3 className="sale-stat-value">{item.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Top Section */}
      <div className="sale-charts-grid">
        {/* Sales Overview */}
        <Card>
          <div className="sale-card-header">
            <h2 className="sale-card-title">
              Sales Overview
            </h2>
          </div>
          <div className="sale-overview-top">

            <div className="sale-overview-stats">
              <div>
                <p>Profit</p>
                <h2>$25K</h2>
                <span className="sale-profit-text">
                  ↑ 2.37%
                </span>
              </div>

              <div>
                <p>Expense</p>
                <h2>$39K</h2>
                <span className="sale-profit-text">
                  ↑ 1.74%
                </span>
              </div>

              <div>
                <p>Revenue</p>
                <h2>$208B</h2>
                <span className="sale-loss-text">
                  ↓ 7.37%
                </span>
              </div>
            </div>
            <div className="sale-chart-legends">
              {legends.map((item, index) => (
                <div key={index} className="sale-legend-item">
                  <span className={`sale-legend-box ${item.className}`}></span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CHART */}
          <div className="sale-chart-wrapper">

            {/* Y AXIS */}
            <div className="sale-y-axis">
              {[120, 90, 60, 30, 0].map((value, index) => (
                <span key={index}>{value}</span>
              ))}
            </div>

            {/* MAIN CHART */}
            <div className="sale-chart-main">

              {/* GRID LINES */}
              <div className="sale-grid-lines">
                {[120, 90, 60, 30, 0].map((_, index) => (
                  <span key={index}></span>
                ))}
              </div>

              {/* BARS */}
              <div className="sale-bar-chart">
                {salesOverviewData.map((item, index) => (
                  <div
                    key={index}
                    className="sale-chart-column"
                  >
                    <div className="sale-bars-wrapper">

                      <div
                        className="sale-bar sale-purple-bg"
                        style={{
                          height: `${item.profit * 2}px`,
                        }}
                      ></div>

                      <div
                        className="sale-bar sale-red-bg"
                        style={{
                          height: `${item.expense * 2}px`,
                        }}
                      ></div>

                      <div
                        className="sale-bar sale-pink-bg"
                        style={{
                          height: `${item.revenue * 2}px`,
                        }}
                      ></div>

                    </div>

                    <span className="sale-chart-month">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Production */}
        <Card>
          <h2 className="sale-card-title">
            Production By Unit
          </h2>

          <div className="sale-production-list">
            {[65, 80, 45, 90, 60].map((value, index) => (
              <div key={index}>
                <div className="sale-production-header">
                  <span>Series {index + 1}</span>
                  <span>{value}%</span>
                </div>

                <div className="sale-progress-bar">
                  <div
                    className="sale-progress-fill"
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Middle Section */}
      <div className="sale-middle-grid">
        {/* Plant Productivity */}
        <Card>
          <h2 className="sale-card-title">
            Plant Productivity
          </h2>

          <div className="sale-productivity-box">
            <h1>88.11%</h1>

            <div className="sale-productivity-chart"></div>

            <div className="sale-target-box">
              <div>
                <p>Target</p>
                <h3>85.00%</h3>
              </div>

              <div className="sale-growth-box">
                +5.0%
              </div>
            </div>
          </div>
        </Card>

        {/* Order Overview */}
        <Card>
          <div className="sale-card-header">
            <h2 className="sale-card-title">
              Order Overview
            </h2>

            <div className="sale-button-group">
              <button>Weekly</button>

              <button className="sale-active-btn">
                Monthly
              </button>
            </div>
          </div>

          <div className="sale-line-chart">
            <svg viewBox="0 0 300 150">
              <polyline
                fill="none"
                stroke="#6366f1"
                strokeWidth="4"
                points="0,120 50,90 100,110 150,70 200,80 250,30 300,40"
              />

              <polyline
                fill="none"
                stroke="#60a5fa"
                strokeWidth="4"
                points="0,100 50,95 100,85 150,90 200,92 250,80 300,88"
              />
            </svg>
          </div>
        </Card>

        {/* Top Products */}
        <Card>
          <h2 className="sale-card-title">
            Top Products
          </h2>

          <div className="sale-product-list">
            {topProducts.map((product, index) => (
              <div
                className="sale-product-item"
                key={index}
              >
                <span>{product.name}</span>
                <strong>{product.price}</strong>
              </div>
            ))}
          </div>

          <div className="sale-total-sales">
            <p>Total Sales</p>

            <h2>$8,459k</h2>

            <div className="sale-progress-bar">
              <div className="sale-progress-fill sale-width-75"></div>
            </div>
          </div>
        </Card>

      </div>
      {/* Bottom Section */}
      <div className="sale-bottom-grid">
        {/* Regional Sales */}
        <Card>
          <div className="sale-region-card">
            <h2 className="sale-card-title">
              Regional Sales
            </h2>

            <div className="sale-donut-wrapper">
              <div className="sale-donut-chart">
                <div className="sale-donut-center"></div>
              </div>
            </div>

            <div className="sale-region-list">
              {regionalSales.map((item, index) => (
                <div
                  className="sale-region-item"
                  key={index}
                >
                  <span
                    className={`sale-region-color ${item.color}`}
                  ></span>

                  <span>{item.name}</span>

                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Customer Location */}
        <Card>
          <div className="sale-location-card">
            <h2 className="sale-card-title">
              Sales By Customer Location
            </h2>

            <div className="sale-map-wrapper">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
                alt="map"
                className="sale-map-image"
              />

              {mapDots.map((dot, index) => (
                <span
                  key={index}
                  className={`sale-map-dot ${dot.className}`}
                ></span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Sales;