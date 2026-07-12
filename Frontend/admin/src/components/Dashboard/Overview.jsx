import Breadcrumb from "../common/Breadcrumb";
import Card from "../common/Card";
import React, { useState } from "react";
import "../../assets/style/Dashboard.css"
import { Dropdown } from "antd";
import { FaDollarSign, FaWallet, FaUsers, FaShoppingCart, FaChevronDown, FaEllipsisV, } from "react-icons/fa";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, } from "recharts";
// IMPORTS
import { RiEyeLine, RiMore2Line, RiEditLine, RiDeleteBinLine, RiFileListLine, } from "react-icons/ri";

const Overview = () => {
  const [activeTab, setActiveTab] = useState("active");
  // STATES
  const [openMenu, setOpenMenu] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showProductDetails, setShowProductDetails] = useState(false);
  // Dummy data
  const orders = {
    active: [
      { customer: "Amanda Nanes", price: "$229.99", date: "24 May 2022" },
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
    {
      name: "Smart Phone",
      price: "$699",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200",
    },
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
  const chartData = [
    { month: "Jan", value: 45, fill: "#d9c8ff" },
    { month: "Feb", value: 42, fill: "#d9c8ff" },
    { month: "Mar", value: 58, fill: "#cab5ff" },
    { month: "Apr", value: 85, fill: "#cab5ff" },
    { month: "May", value: 110, fill: "#7c4dff" },
    { month: "Jun", value: 55, fill: "#cab5ff" },
    { month: "Jul", value: 70, fill: "#e5e7eb" },
    { month: "Aug", value: 45, fill: "#e5e7eb" },
    { month: "Sep", value: 25, fill: "#e5e7eb" },
    { month: "Oct", value: 55, fill: "#e5e7eb" },
    { month: "Nov", value: 78, fill: "#e5e7eb" },
    { month: "Dec", value: 35, fill: "#e5e7eb" },
  ];

  const customers = [
    {
      id: 1,
      name: "Emma Wilson",
      purchases: "15 Purchases",
      amount: "$1,835",
      img: "https://i.pravatar.cc/100?img=1",
    },
  ];
  const countries = [
    {
      id: 1,
      name: "France",
      flag: "🇫🇷",
      sales: "5,932",
    },
  ];
  const products = [
    {
      id: 1,
      name: "Niker College Bag",
      productId: "#1734-9743",
      price: "$199.99",
      status: "Available",
      sales: "3,903",
      revenue: "$67,899",
    },

  ];
  const topSellingProducts = [
    {
      id: 1,
      productName: "Ethnic School Bag",
      category: "Bags",
      stock: "In Stock",
      totalSales: "5,093",
    },
    {
      id: 2,
      productName: "Ethnic School Bag",
      category: "Bags",
      stock: "Out Of Stock",
      totalSales: "5,093",
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
                <div className="earnings-title">
                  Earnings
                </div>
                <div className="earnings-actions">
                  <span className="view-all">
                    View All
                  </span>
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

            {/* STATS */}
            <div className="earning-stats">
              <div className="earning-box">
                <div className="earning-label purple-light">
                  <span className="dot"></span>
                  First Half
                </div>
                <div className="earning-price">
                  <h2>$51.94k</h2>
                  <span className="badge success">
                    +0.9%
                  </span>
                </div>
              </div>
              <div className="earning-box">
                <div className="earning-label purple">
                  <span className="dot"></span>
                  Top Gross
                </div>
                <div className="earning-price">
                  <h2>$18.32k</h2>
                  <span className="badge success">
                    +0.39%
                  </span>
                </div>
              </div>
              <div className="earning-box">
                <div className="earning-label gray">
                  <span className="dot"></span>
                  Second Half
                </div>
                <div className="earning-price">
                  <h2>$38k</h2>
                  <span className="badge danger">
                    -0.15%
                  </span>
                </div>
              </div>
            </div>

            {/* CHART */}
            <div className="earnings-chart">
              <ResponsiveContainer
                width="100%"
                height={260}
              >
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar
                    dataKey="value"
                    radius={[20, 20, 20, 20]}
                    barSize={15}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.fill}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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
                  {topSellingProducts.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.productName}</td>
                      <td>{product.category}</td>
                      <td>
                        <span
                          className={
                            product.stock === "In Stock"
                              ? "stock in-stock"
                              : "stock out-of-stock"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td>{product.totalSales}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </Card>

            {/* BOTTOM 2 CARDS SAME ROW */}
            <div className="bottom-two-cards">

              <Card
                title={
                  <div className="card-title-row">
                    <span>Top Countries By Sales</span>

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
                <div className="country-sales-card">

                  {/* HEADER */}
                  <div className="country-sales-header">

                    <h2>38,256</h2>

                    <div className="country-growth">
                      <span className="growth-badge">12.24%</span>
                      <p>Since last week</p>
                    </div>

                  </div>

                  {/* COUNTRY LIST */}
                  <ul className="country-sales-list">

                    {countries.map((country) => (
                      <li key={country.id}>

                        <div className="country-left">
                          <span className="flag">{country.flag}</span>

                          <span className="country-name">
                            {country.name}
                          </span>
                        </div>

                        <span className="country-sales">
                          {country.sales}
                        </span>

                      </li>
                    ))}

                  </ul>

                </div>
              </Card>

              <Card
                title={
                  <div className="card-title-row">
                    <span>Top Customers</span>

                    <Dropdown
                      menu={{ items: menuItems }}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
                      <FaChevronDown className="three-dot-icon" />
                    </Dropdown>
                  </div>
                }
              >
                <ul className="customer-list">
                  {customers.map((customer) => (
                    <li key={customer.id} className="customer-item">
                      <div className="customer-item-left">
                        <img src={customer.img} className="customer-avatar" />

                        <div className="customer-info">
                          <h4>{customer.name}</h4>
                          <span>{customer.purchases}</span>
                        </div>
                      </div>

                      <span className="customer-amount">
                        {customer.amount}
                      </span>
                    </li>
                  ))}
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
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.productId}</td>
                <td>{product.price}</td>
                <td>{product.status}</td>
                <td>{product.sales}</td>
                <td>{product.revenue}</td>

                {/* ACTIONS */}
                <td>
                  <div className="orders-action-buttons">

                    {/* VIEW DETAILS */}
                    <button
                      className="orders-view-btn"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowProductDetails(true);
                      }}
                    >
                      <RiEyeLine />
                    </button>

                    {/* DROPDOWN */}
                    <div className="orders-dropdown-wrapper">

                      <button
                        className="orders-menu-btn"
                        onClick={() =>
                          setOpenMenu(openMenu === index ? null : index)
                        }
                      >
                        <RiMore2Line />
                      </button>

                      {openMenu === index && (
                        <div className="orders-dropdown-menu">

                          {/* OVERVIEW */}
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              console.log("Overview:", product);
                            }}
                          >
                            <RiFileListLine />
                            Overview
                          </button>

                          {/* EDIT */}
                          <button
                            onClick={() => alert(`Edit ${product.name}`)}
                          >
                            <RiEditLine />
                            Edit
                          </button>

                          {/* DELETE */}
                          <button onClick={() => alert(`Delete ${product.name}`)}><RiDeleteBinLine /> Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Overview;