import Breadcrumb from "../common/Breadcrumb";
import Card from "../common/Card";
import { useState } from "react";

import {
  FiMoreHorizontal,
  FiDownload,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiEdit2,
  FiTrash2, FiEye
} from "react-icons/fi";

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

import "../../assets/style/customers.css";

const Customers = () => {
  const [openMenu, setOpenMenu] = useState(null);


  const chartData = [
    { month: "Jan", value: 50 },
    { month: "Feb", value: 85 },
    { month: "Mar", value: 120 },
    { month: "Apr", value: 150 },
    { month: "May", value: 200 },
    { month: "Jun", value: 180 },
    { month: "Jul", value: 250 },
    { month: "Aug", value: 300 },
  ];

  const customers = [
    {
      id: "CUST1001",
      name: "John Carter",
      email: "john.carter@email.com",
      country: "USA",
      date: "01-08-2025",
      status: "Active",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },

    {
      id: "CUST1002",
      name: "Sophia Miller",
      email: "sophia.miller@email.com",
      country: "UK",
      date: "03-08-2025",
      status: "Pending",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },

    {
      id: "CUST1003",
      name: "David Johnson",
      email: "david.j@email.com",
      country: "Canada",
      date: "05-08-2025",
      status: "Active",
      image: "https://randomuser.me/api/portraits/men/50.jpg",
    },

    {
      id: "CUST1004",
      name: "Emma Wilson",
      email: "emma.w@email.com",
      country: "Australia",
      date: "06-08-2025",
      status: "Review",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },

    {
      id: "CUST1005",
      name: "Michael Brown",
      email: "mike.b@email.com",
      country: "Germany",
      date: "09-08-2025",
      status: "Active",
      image: "https://randomuser.me/api/portraits/men/76.jpg",
    },

    {
      id: "CUST1006",
      name: "Olivia Davis",
      email: "olivia.d@email.com",
      country: "France",
      date: "11-08-2025",
      status: "Active",
      image: "https://randomuser.me/api/portraits/women/21.jpg",
    },
  ];

  return (
    <div className="customers-page">

      {/* PAGE HEADER */}
      <div className="customers-page-top">

        <h1 className="customers-page-title">
          Customers
        </h1>

        <Breadcrumb />

      </div>

      {/* TOP GRID */}
      <div className="customers-top-grid">

        {/* LEFT SIDE */}
        <div className="customers-left-side-cards">

          {/* SMALL STATS */}
          <div className="customers-stats-grid">

            <Card>
              <div className="customers-mini-stat-card">
                <p>Total Customers</p>
                <h2>12,540</h2>
                <span className="customers-success-text">+12.5%</span>
              </div>
            </Card>

            <Card>
              <div className="customers-mini-stat-card">
                <p>New Customers</p>
                <h2>1,245</h2>
                <span className="customers-success-text">+8.2%</span>
              </div>
            </Card>

            <Card>
              <div className="customers-mini-stat-card">
                <p>Total Ratings</p>
                <h2>4,820</h2>
                <span className="customers-warning-text">4.8 Average</span>
              </div>
            </Card>

          </div>

          {/* RATING CARD */}
          <Card>
            <div className="customers-rating-card">

              <div className="customers-card-head">
                <h3>Customer Rating</h3>

                <button className="customers-icon-btn">
                  <FiMoreHorizontal />
                </button>
              </div>

              <div className="customers-rating-value">
                4.8
              </div>

              <div className="customers-stars">
                ★ ★ ★ ★ ★
                <span>(520)</span>
              </div>

              <div className="customers-growth">
                <span>↑ +40%</span>
                <p>Last month</p>
              </div>

              <div className="customers-mini-chart">
                <svg
                  width="100%"
                  height="60"
                  viewBox="0 0 200 60"
                  fill="none"
                >
                  <path
                    d="M10 45
                    C25 30, 40 50, 55 35
                    C70 20, 85 40, 100 28
                    C115 18, 130 38, 145 30
                    C160 22, 175 35, 190 25"
                    stroke="#22c55e"
                    strokeWidth="3"
                    fill="none"
                  />

                  <circle cx="10" cy="45" r="3" fill="#22c55e" />
                  <circle cx="55" cy="35" r="3" fill="#22c55e" />
                  <circle cx="100" cy="28" r="3" fill="#22c55e" />
                  <circle cx="145" cy="30" r="3" fill="#22c55e" />
                  <circle cx="190" cy="25" r="3" fill="#22c55e" />
                </svg>
              </div>

              <button className="customers-download-btn">
                <FiDownload />
                Download
              </button>

            </div>
          </Card>

        </div>

        {/* CHART CARD */}
        <Card>
          <div className="customers-chart-card">

            <div className="customers-card-head">
              <h3>New Customers</h3>
            </div>

            <div className="customers-chart-wrapper">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ff6a00"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        </Card>

      </div>

      {/* TABLE */}
      <Card>
        <div className="customers-table-wrap">

          <div className="customers-table-top">

            <h3>Customer List</h3>

            <div className="customers-table-actions">

              <select>
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
              </select>

              <div className="customers-search-box">

                <FiSearch />

                <input
                  type="text"
                  placeholder="Search"
                />

              </div>

            </div>

          </div>

          <div className="customers-table-responsive">

            <table className="customers-table">

              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>

                  <th>Name & Profile</th>
                  <th>Customer ID</th>
                  <th>Email</th>
                  <th>Country</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>

                </tr>
              </thead>

              <tbody>

                {customers.map((item, index) => (

                  <tr key={index}>

                    <td>
                      <input type="checkbox" />
                    </td>

                    <td>
                      <div className="customers-customer-info">

                        <img
                          src={item.image}
                          alt=""
                        />

                        <span>
                          {item.name}
                        </span>

                      </div>
                    </td>

                    <td>{item.id}</td>
                    <td>{item.email}</td>
                    <td>{item.country}</td>
                    <td>{item.date}</td>

                    <td>
                      <span
                        className={`customers-status-badge ${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="customers-action-buttons">

                        {/* VIEW BUTTON */}
                        <button
                          className="customers-view-btn"
                          onClick={() => alert("View Clicked")}
                        >
                          <FiEye />
                        </button>

                        {/* THREE DOT MENU */}
                        <div className="customers-dropdown-wrapper">

                          <button
                            className="customers-menu-btn"
                            onClick={() =>
                              setOpenMenu(openMenu === index ? null : index)
                            }
                          >
                            <FiMoreHorizontal />
                          </button>

                          {openMenu === index && (

                            <div className="customers-dropdown-menu">

                              <button
                                onClick={() => alert("Edit Clicked")}
                              >
                                <FiEdit2 />
                                Edit
                              </button>

                              <button
                                onClick={() => alert("Delete Clicked")}
                              >
                                <FiTrash2 />
                                Delete
                              </button>

                            </div>

                          )}

                        </div>

                      </div>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* FOOTER */}
          <div className="customers-table-footer">

            <p>
              Showing 1 to 6 of 10 entries
            </p>

            <div className="customers-pagination">

              <button>
                <FiChevronsLeft />
              </button>

              <button>
                <FiChevronLeft />
              </button>

              <button className="customers-active-page">
                1
              </button>

              <button>
                2
              </button>

              <button>
                <FiChevronRight />
              </button>

              <button>
                <FiChevronsRight />
              </button>

            </div>

          </div>

        </div>
      </Card>

    </div>
  );
};

export default Customers;