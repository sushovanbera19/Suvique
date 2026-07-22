import Breadcrumb from "../common/Breadcrumb";
import Card from "../common/Card";
import React, { useState, useEffect } from "react";
import "../../assets/style/Analytics.css";

const API = "http://localhost:5000";

const FLAG_MAP = {
  "United States": "🇺🇸",
  "Canada": "🇨🇦",
  "India": "🇮🇳",
  "United Kingdom": "🇬🇧",
  "Germany": "🇩🇪",
  "France": "🇫🇷",
  "Japan": "🇯🇵",
  "Brazil": "🇧🇷",
  "Australia": "🇦🇺",
  "Mexico": "🇲🇽",
  "UAE": "🇦🇪",
  "Argentina": "🇦🇷",
  "Italy": "🇮🇹",
  "Spain": "🇪🇸",
  "China": "🇨🇳",
  "South Korea": "🇰🇷",
  "Netherlands": "🇳🇱",
  "Turkey": "🇹🇷",
  "Saudi Arabia": "🇸🇦",
  "South Africa": "🇿🇦",
};

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/stats/analytics`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      })
      .catch((err) => console.error("Analytics fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const counts = stats?.counts || {};
  const ordersByCountry = stats?.ordersByCountry || [];
  const ordersByPaymentMethod = stats?.ordersByPaymentMethod || [];
  const ordersPerMonth = stats?.ordersPerMonth || [];

  const totalSessions = counts.totalOrders || 0;
  const totalUsers = counts.totalUsers || 0;

  const countries = ordersByCountry.map((c) => ({
    name: c.country,
    value: Number(c.orderCount),
    revenue: Number(c.totalRevenue),
    flag: FLAG_MAP[c.country] || "🌍",
  }));

  const channelData = ordersByPaymentMethod.map((p, i) => ({
    id: i + 1,
    channel: p.payment_method,
    sessions: Number(p.count),
    revenue: Number(p.totalRevenue),
  }));

  const statsData = [
    {
      id: 1,
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      growth: `${counts.totalOrders || 0} orders`,
      color: "green",
    },
    {
      id: 2,
      title: "Total Orders",
      value: totalSessions.toLocaleString(),
      growth: `${counts.totalProducts || 0} products`,
      color: "blue",
    },
    {
      id: 3,
      title: "Total Reviews",
      value: (counts.totalReviews || 0).toLocaleString(),
      growth: "Customer feedback",
      color: "orange",
    },
  ];

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-page-header">
          <div className="analytics-page-top">
            <h1 className="analytics-page-title">Analytics</h1>
            <Breadcrumb />
          </div>
        </div>
        <p style={{ color: "#94a3b8", textAlign: "center", marginTop: 60 }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="analytics-page">

      {/* PAGE HEADER */}
      <div className="analytics-page-header">
        <div className="analytics-page-top">
          <h1 className="analytics-page-title">Analytics</h1>
          <Breadcrumb />
        </div>
      </div>

      {/* MAIN TOP WRAPPER */}
      <div className="analytics-top-wrapper">

        {/* LEFT SIDE */}
        <div className="analytics-left-side">

          {/* TOP STATS GRID */}
          <div className="analytics-top-cards">
            {statsData.map((item) => (
              <Card key={item.id} className="analytics-top-stat-card">
                <div className="analytics-stat-card">
                  <div className="analytics-stat-content">
                    <h4 className="analytics-stat-title">{item.title}</h4>
                    <h2 className="analytics-stat-value">{item.value}</h2>
                    <span className={`analytics-growth ${item.color}`}>{item.growth}</span>
                  </div>
                </div>
              </Card>
            ))}

            {/* PROMO */}
            <Card className="analytics-promo-wrapper">
              <div className="analytics-promo-card">
                <div className="analytics-promo-content">
                  <h3 className="analytics-promo-title">Plan is expiring!</h3>
                  <p className="analytics-promo-text">Upgrade to premium</p>
                  <button className="analytics-promo-btn">Upgrade Now</button>
                </div>
              </div>
            </Card>
          </div>

          {/* AUDIENCE SECTION */}
          <Card title="Audience Report" className="analytics-audience-card">
            <div className="analytics-audience-wrapper">
              <div className="analytics-audience-top">
                <div className="analytics-chart-legends">
                  <div className="analytics-legend-item">
                    <span className="legend-dot purple"></span>
                    <span>Orders</span>
                  </div>
                  <div className="analytics-legend-item">
                    <span className="legend-dot blue"></span>
                    <span>Revenue (k)</span>
                  </div>
                </div>
              </div>
              <div className="analytics-audience-chart">
                <div className="analytics-chart-placeholder">
                  {ordersPerMonth.length > 0 ? (
                    <div style={{ width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 12, height: "100%", padding: "20px 0" }}>
                      {ordersPerMonth.map((m, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, color: "#666" }}>{m.orders} orders</span>
                          <div style={{
                            width: 40,
                            height: `${Math.max((m.orders / Math.max(...ordersPerMonth.map(x => x.orders), 1)) * 150, 10)}px`,
                            background: "linear-gradient(180deg, #7c4dff, #cab5ff)",
                            borderRadius: "6px 6px 0 0"
                          }}></div>
                          <span style={{ fontSize: 11, color: "#999" }}>{m.month}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    "No order data yet"
                  )}
                </div>
              </div>
            </div>
          </Card>

        </div>

        {/* RIGHT SIDE */}
        <div className="analytics-right-side">

          {/* DEVICE CARD — keep static (no device tracking) */}
          <Card className="analytics-device-wrapper">
            <div className="analytics-device-card">
              <div className="analytics-device-header">
                <h4 className="analytics-device-title">Sessions By Device</h4>
                <span className="analytics-view-all">View All</span>
              </div>
              <div className="analytics-donut-chart">
                <div className="analytics-donut-inner">
                  <h3>Total</h3>
                  <p>{totalSessions}</p>
                </div>
              </div>
              <div className="analytics-device-stats">
                <div className="analytics-device-item">
                  <strong>68.3%</strong>
                  <span>Mobile</span>
                </div>
                <div className="analytics-device-item">
                  <strong>17.68%</strong>
                  <span>Tablet</span>
                </div>
                <div className="analytics-device-item">
                  <strong>10.5%</strong>
                  <span>Desktop</span>
                </div>
              </div>
            </div>
          </Card>

          {/* SMALL STATS — static (no analytics tracking) */}
          <div className="analytics-small-cards">
            <Card className="analytics-small-wrapper">
              <div className="analytics-small-card">
                <div className="analytics-progress-circle blue">
                  <span>48%</span>
                </div>
                <div className="analytics-small-info">
                  <p>Impressions</p>
                  <h3>9,903</h3>
                </div>
              </div>
            </Card>
            <Card className="analytics-small-wrapper">
              <div className="analytics-small-card">
                <div className="analytics-progress-circle orange">
                  <span>65%</span>
                </div>
                <div className="analytics-small-info">
                  <p>Clicks</p>
                  <h3>16,789</h3>
                </div>
              </div>
            </Card>
          </div>

        </div>

      </div>

      {/* LOWER SECTION */}
      <div className="analytics-lower-section">

        {/* COUNTRY REPORT — dynamic from orders */}
        <Card title="Top Countries Orders vs Revenue" className="analytics-country-report-card">
          <div className="analytics-country-chart">
            <div className="analytics-chart-placeholder">
              {countries.length > 0 ? (
                <div style={{ width: "100%", padding: "10px 20px" }}>
                  {countries.map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
                      <span style={{ fontSize: 20 }}>{c.flag}</span>
                      <span style={{ flex: 1, fontSize: 13, color: "#333" }}>{c.name}</span>
                      <div style={{
                        width: `${Math.max((c.value / Math.max(...countries.map(x => x.value), 1)) * 200, 10)}px`,
                        height: 8,
                        background: "linear-gradient(90deg, #7c4dff, #cab5ff)",
                        borderRadius: 4
                      }}></div>
                      <span style={{ fontSize: 13, fontWeight: 600, minWidth: 30, textAlign: "right" }}>{c.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                "No country data yet"
              )}
            </div>
          </div>
        </Card>

        {/* TRAFFIC SOURCES — dynamic from payment methods */}
        <Card title="Orders By Payment Method" className="analytics-traffic-card">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Payment Method</th>
                <th>Orders</th>
                <th>Traffic</th>
              </tr>
            </thead>
            <tbody>
              {channelData.length === 0 ? (
                <tr><td colSpan={3} style={{ textAlign: "center", color: "#94a3b8" }}>No data yet</td></tr>
              ) : (
                channelData.map((item) => {
                  const maxCount = Math.max(...channelData.map((c) => c.sessions), 1);
                  const pct = (item.sessions / maxCount) * 100;
                  const colors = ["purple", "blue", "green", "orange", "red"];
                  const color = colors[channelData.indexOf(item) % colors.length];
                  return (
                    <tr key={item.id}>
                      <td>{item.channel}</td>
                      <td>{item.sessions.toLocaleString()}</td>
                      <td>
                        <div className={`analytics-traffic-bar ${color}`} style={{ width: `${pct}%` }}></div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </Card>

        {/* SESSION CHART — static (no session tracking) */}
        <Card title="Sessions Duration By New Users" className="analytics-session-card">
          <div className="analytics-session-chart">
            <div className="analytics-chart-placeholder">
              Session Chart
            </div>
          </div>
        </Card>

      </div>

      {/* BOTTOM SECTION */}
      <div className="analytics-bottom-section">

        {/* CHANNEL TABLE — dynamic from payment methods */}
        <Card title="Orders By Payment Method Report" className="analytics-channel-card">
          <div className="analytics-channel-table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Payment Method</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {channelData.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: "center", color: "#94a3b8" }}>No data yet</td></tr>
                ) : (
                  channelData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.channel}</td>
                      <td>{item.sessions}</td>
                      <td>${item.revenue.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* COUNTRY LIST — dynamic from orders */}
        <Card title="Visitors By Countries" className="analytics-country-card">
          <div className="analytics-country-list">
            {countries.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: 20 }}>No country data yet</p>
            ) : (
              countries.map((country, index) => (
                <div key={index} className="analytics-country-item">
                  <div className="analytics-country-left">
                    <span className="analytics-flag">{country.flag}</span>
                    <span className="analytics-country-name">{country.name}</span>
                  </div>
                  <strong className="analytics-country-value">{country.value.toLocaleString()}</strong>
                </div>
              ))
            )}
          </div>
        </Card>

      </div>

    </div>
  );
};

export default Analytics;
