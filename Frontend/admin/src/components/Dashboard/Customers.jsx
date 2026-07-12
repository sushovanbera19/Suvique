import Breadcrumb from "../common/Breadcrumb";
import Card from "../common/Card";
import { useState, useEffect } from "react";

import {
  FiMoreHorizontal,
  FiDownload,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiEdit2,
  FiTrash2, FiEye, FiX, FiCheck, FiTrash
} from "react-icons/fi";

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

import "../../assets/style/customers.css";

const Customers = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [updating, setUpdating] = useState(false);

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

  const fetchCustomers = () => {
    fetch("http://localhost:5000/api/users/all-users")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCustomers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(customers.map((user) => user.user_id));
    } else {
      setSelectedRows([]);
    }
  };
  const handleRowSelect = (userId) => {
    setSelectedRows((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.name || "", email: user.email || "" });
    setOpenMenu(null);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${editingUser.user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );
      const data = await response.json();
      if (data.success) {
        setCustomers((prev) =>
          prev.map((u) =>
            u.user_id === editingUser.user_id
              ? { ...u, name: editForm.name, email: editForm.email }
              : u
          )
        );
        setEditingUser(null);
        setEditForm({ name: "", email: "" });
        alert("User updated successfully");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error updating user");
    } finally {
      setUpdating(false);
    }
  };

  const handleEditCancel = () => {
    setEditingUser(null);
    setEditForm({ name: "", email: "" });
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setCustomers((prev) =>
          prev.filter((user) => user.user_id !== userId)
        );
        alert("User deleted successfully");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting user");
    }
  };

  const handleBulkDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedRows.length} selected customer(s)?`
    );

    if (!confirmDelete) return;

    try {
      const deletePromises = selectedRows.map((userId) =>
        fetch(`http://localhost:5000/api/users/${userId}`, {
          method: "DELETE",
        }).then((res) => res.json())
      );

      const results = await Promise.all(deletePromises);
      const failedCount = results.filter((r) => !r.success).length;
      const successCount = results.length - failedCount;

      setCustomers((prev) =>
        prev.filter((user) => !selectedRows.includes(user.user_id))
      );
      setSelectedRows([]);

      if (failedCount > 0) {
        alert(`${successCount} deleted, ${failedCount} failed`);
      } else {
        alert(`${successCount} customer(s) deleted successfully`);
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting customers");
    }
  };

  return (
    <div className="customers-page">

      {/* PAGE HEADER */}
      <div className="customers-page-top">

        <h1 className="customers-page-title">
          Customers
        </h1>

        <Breadcrumb />

      </div>

      {/* EDIT MODE - replaces everything when editing */}
      {editingUser && (
        <Card>
          <div className="customers-edit-form">

            <div className="customers-card-head">
              <h3>Edit Customer</h3>
            </div>

            <form onSubmit={handleEditSubmit}>

              <div className="customers-edit-form-grid">

                <div className="customers-edit-field">
                  <label>Customer ID</label>
                  <input
                    type="text"
                    value={editingUser.user_id}
                    disabled
                    className="customers-edit-disabled"
                  />
                </div>

                <div className="customers-edit-field">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                    placeholder="Enter name"
                  />
                </div>

                <div className="customers-edit-field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    required
                    placeholder="Enter email"
                  />
                </div>

              </div>

              <div className="customers-edit-form-actions">

                <button
                  type="button"
                  className="customers-edit-cancel-btn"
                  onClick={handleEditCancel}
                >
                  <FiX />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="customers-edit-save-btn"
                  disabled={updating}
                >
                  <FiCheck />
                  {updating ? "Saving..." : "Save Changes"}
                </button>

              </div>

            </form>

          </div>
        </Card>
      )}

      {/* LIST MODE - show stats, chart, table only when not editing */}
      {!editingUser && (<>

      {/* TOP GRID */}
      <div className="customers-top-grid">

        {/* LEFT SIDE */}
        <div className="customers-left-side-cards">

          {/* SMALL STATS */}
          <div className="customers-stats-grid">

            <Card>
              <div className="customers-mini-stat-card">
                <p>Total Customers</p>
                <h2>{customers.length}</h2>
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

              {selectedRows.length > 0 && (
                <button
                  className="customers-bulk-delete-btn"
                  onClick={handleBulkDelete}
                >
                  <FiTrash />
                  Delete ({selectedRows.length})
                </button>
              )}

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
                    <input
                      type="checkbox"
                      checked={
                        customers.length > 0 &&
                        selectedRows.length === customers.length
                      }
                      onChange={handleSelectAll}
                    />
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

                {customers.map((item, index) => {

                  const status = item.status || "Active";
                  const country = item.country || "N/A";
                  const createdAt = item.created_at || null;
                  const image = item.image || null;

                  return (
                  <tr key={index} className={
                    selectedRows.includes(item.user_id)
                      ? "selected-row"
                      : ""
                  }>

                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.user_id)}
                        onChange={() => handleRowSelect(item.user_id)}
                      />
                    </td>

                    <td>
                      <div className="customers-customer-info">

                        {image ? (
                          <img
                            src={image}
                            alt={item.name}
                            className="customer-avatar"
                          />
                        ) : (
                          <div className="customer-initials">
                            {item.name
                              ? `${item.name.charAt(0).toUpperCase()}${item.name
                                .charAt(item.name.length - 1)
                                .toUpperCase()}`
                              : "NA"}
                          </div>
                        )}

                        <span>
                          {item.name}
                        </span>

                      </div>
                    </td>

                    <td>{item.user_id}</td>
                    <td>{item.email}</td>
                    <td>{country}</td>
                    <td>
                      {createdAt ? new Date(createdAt).toLocaleDateString("en-GB") : "N/A"}
                    </td>
                    <td>
                      <span
                        className={`customers-status-badge ${status.toLowerCase()}`}
                      >
                        {status}
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
                                onClick={() => handleEditClick(item)}
                              >
                                <FiEdit2 />
                                Edit
                              </button>

                              <button
                                onClick={() => handleDeleteUser(item.user_id)}
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
                  );
                })}

              </tbody>

            </table>

          </div>

          {/* FOOTER */}
          <div className="customers-table-footer">

            <p>
              Showing 1 to {customers.length} of {customers.length} entries
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
                <FiChevronRight />
              </button>

              <button>
                <FiChevronsRight />
              </button>

            </div>

          </div>

        </div>
      </Card>

      </>)}

    </div>
  );
};

export default Customers;
