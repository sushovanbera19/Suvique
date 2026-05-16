import Breadcrumb from "../common/Breadcrumb";
import Card from "../common/Card";
import React, { useState } from "react";
import "../../assets/style/Dashboard.css"
import { FaChevronDown } from "react-icons/fa";
import { FaEllipsisV } from "react-icons/fa";
import { Dropdown } from "antd";
import {
  FaDollarSign,
  FaWallet,
  FaUsers,
  FaShoppingCart,
} from "react-icons/fa";

const Overview = () => {
  const [activeTab, setActiveTab] = useState("active");
  // Dummy data
  const orders = {
    active: [
      { customer: "Amanda Nanes", price: "$229.99", date: "24 May 2022" },
      { customer: "Peter Parkour", price: "$135.29", date: "18 May 2022" },
    ],
    completed: [
      { customer: "Jackie Chen", price: "$129.99", date: "29 May 2022" },
    ],
    cancelled: [
      { customer: "Robert Smith", price: "$99.99", date: "10 May 2022" },
    ],
  };
  const items = [
    {
      key: "1",
      label: "Download",
    },
    {
      key: "2",
      label: "Import",
    },
    {
      key: "3",
      label: "Export",
    },
  ];
  const recentOrders = [
    { name: "Smart Phone", price: "$699", img: "https://www.indiamart.com/proddetail/stylish-bedroom-chairs-2849506328197.html?srsltid=AfmBOopfZMAfPqHl0zUiQZyG1V-PdmPZbiAGdOG6pVmAaPAHwo1dhs1r" },
    { name: "Headphones", price: "$79", img: "https://via.placeholder.com/40" },
    { name: "Stop Watch", price: "$49", img: "https://via.placeholder.com/40" },
    { name: "Camera", price: "$999", img: "https://via.placeholder.com/40" },
    { name: "Canvas Shoes", price: "$89", img: "https://via.placeholder.com/40" },
  ];
  const menuItems = [
    {
      key: "1",
      label: "Action",
    },
    {
      key: "2",
      label: "Another Action",
    },
    {
      key: "3",
      label: "Something Else",
    },
  ];
  return (
    <div className="content">

      {/* PAGE HEADER */}
      <div className="page-top">
        <h1 className="page-title">Overview</h1>
        <Breadcrumb />
      </div>

      <div className="dashboard-layout">

        {/* LEFT COLUMN */}
        <div className="left-column">

          {/* STATS */}
          <div className="stats-grid">

            <Card
              title="Total Sales"
              value="14,732"
              subtitle="Increase by +4.2% this month"
              icon={<FaDollarSign />}
              iconClass="purple"
            />

            <Card
              title="Total Expenses"
              value="$28,346"
              subtitle="Increase by +12.0% this month"
              icon={<FaWallet />}
              iconClass="blue"
            />

            <Card
              title="Total Visitors"
              value="1,29,368"
              subtitle="Decreased by -7.6% this month"
              icon={<FaUsers />}
              iconClass="green"
            />

            <Card
              title="Total Orders"
              value="35,367"
              subtitle="Increased by +2.5% this month"
              icon={<FaShoppingCart />}
              iconClass="orange"
            />

          </div>

          {/* PROMO + RECENT ORDERS */}
          <div className="small-grid">

            <Card title="Big Saving Days">
              <div className="promo-box">
                <h3>Biggest sale is back.</h3>
                <p>Lorem ipsum dolor sit amet.</p>
                <button>Notify Me</button>
              </div>
            </Card>

            <Card
              title={
                <div className="card-title-row">
                  <span>Recent Orders</span>
                  <Dropdown
                    menu={{ items: menuItems }}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <FaEllipsisV className="three-dot-icon" />
                  </Dropdown>
                </div>
              }
            >
              <ul className="product-list">
                {recentOrders.map((item, index) => (
                  <li key={index}>
                    <img src={item.img} alt="product" className="product-img" />

                    <span className="product-name">{item.name}</span>

                    <span className="product-price">{item.price}</span>
                  </li>
                ))}
              </ul>
            </Card>

          </div>

          {/* ORDERS TABLE */}
          <Card>
            <div className="card-header-with-tabs">
              <h3 className="card-title">Orders</h3>

              <div className="card-tabs">
                <button
                  className={activeTab === "active" ? "tab active" : "tab"}
                  onClick={() => setActiveTab("active")}
                >
                  Active Orders
                </button>

                <button
                  className={activeTab === "completed" ? "tab active" : "tab"}
                  onClick={() => setActiveTab("completed")}
                >
                  Completed
                </button>

                <button
                  className={activeTab === "cancelled" ? "tab active" : "tab"}
                  onClick={() => setActiveTab("cancelled")}
                >
                  Cancelled
                </button>
              </div>
            </div>

            {/* Table */}
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Price</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {orders[activeTab].map((order, index) => (
                  <tr key={index}>
                    <td>{order.customer}</td>
                    <td>{order.price}</td>
                    <td>{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

        </div>

        {/* RIGHT COLUMN */}
        <div className="right-column">

          {/* EARNINGS */}
          <Card
            className="earnings-card"
            title={
              <div className="earnings-header">
                <div className="earnings-title">Earnings</div>

                <div className="earnings-actions">
                  <span className="view-all">View All</span>

                  <Dropdown
                    menu={{ items }}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <span>
                      <FaChevronDown className="dropdown-icon" />
                    </span>
                  </Dropdown>
                </div>
              </div>
            }
          >
            <div className="chart-placeholder">
              Earnings Chart
            </div>
          </Card>
          {/* BOTTOM CARDS */}
          <div className="right-bottom-section">

            {/* TOP FULL WIDTH */}
            <Card title="Top Selling Products">
              <table className="table">

                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Total Sales</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Ethnic School Bag</td>
                    <td>Bags</td>
                    <td><span className="stock in-stock">In Stock</span></td>
                    <td>5,093</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Ethnic School Bag</td>
                    <td>Bags</td>
                    <td><span className="stock out-of-stock">Out Of Stock</span></td>
                    <td>5,093</td>
                  </tr>
                </tbody>

              </table>
            </Card>

            {/* BOTTOM 2 CARDS SAME ROW */}
            <div className="bottom-two-cards">

              <Card title="Top Countries By Sales">
                <ul className="list">
                  <li>France - 5,932</li>
                  <li>Spain - 5,383</li>
                  <li>Argentina - 4,825</li>
                  <li>Germany - 4,501</li>
                </ul>
              </Card>

              <Card title="Top Customers">
                <ul className="list">
                  <li>Emma Wilson</li>
                  <li>Robert Lewis</li>
                  <li>Angelina Rose</li>
                  <li>Samantha Sam</li>
                </ul>
              </Card>

            </div>

          </div>

        </div>

      </div>

      {/* PRODUCTS OVERVIEW */}
      <Card title="Products Overview" className="products-card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Product Id</th>
              <th>Price</th>
              <th>Status</th>
              <th>Sales</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Niker College Bag</td>
              <td>#1734-9743</td>
              <td>$199.99</td>
              <td>Available</td>
              <td>3,903</td>
              <td>$67,899</td>
            </tr>

            <tr>
              <td>Outdoor Bomber Jacket</td>
              <td>#1902-9883</td>
              <td>$99.99</td>
              <td>Not Available</td>
              <td>5,143</td>
              <td>$76,102</td>
            </tr>
          </tbody>
        </table>
      </Card>

    </div>
  );
};

export default Overview;