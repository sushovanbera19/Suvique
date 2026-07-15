import Breadcrumb from "../common/Breadcrumb";
import Card from "../../components/common/Card";
import "../../assets/style/Orders.css";
import { useState, useEffect } from "react";
import {
  RiRefund2Line,
  RiCloseCircleLine,
  RiTruckLine,
  RiShipLine,
  RiStarSmileLine,
  RiSecurePaymentLine,
  RiCheckboxCircleLine,
  RiLoader4Line,
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiMore2Line,
  RiFileTextLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import OrderDetails from "./Orderdetails";

const Orders = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({ payment_status: "", order_status: "", payment_method: "" });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
    setOpenMenu(null);
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        alert("Order deleted successfully");
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting order");
    }
  };

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setEditForm({
      payment_status: order.payment_status || "Pending",
      order_status: order.order_status || "Pending",
      payment_method: order.payment_method || "cod",
    });
    setOpenMenu(null);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${editingOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === editingOrder.id
              ? { ...o, ...editForm }
              : o
          )
        );
        setEditingOrder(null);
        alert("Order updated successfully");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error updating order");
    } finally {
      setUpdating(false);
    }
  };

  const handleEditCancel = () => {
    setEditingOrder(null);
  };

  const orderStats = [
    {
      title: "Total Orders",
      count: orders.length,
      icon: <RiFileTextLine />,
    },
    {
      title: "Completed",
      count: orders.filter((o) => o.order_status === "Completed").length,
      icon: <RiCheckboxCircleLine />,
    },
    {
      title: "Pending",
      count: orders.filter((o) => o.order_status === "Pending").length,
      icon: <RiStarSmileLine />,
    },
    {
      title: "Processing",
      count: orders.filter((o) => o.order_status === "Processing").length,
      icon: <RiLoader4Line />,
    },
    {
      title: "Shipped",
      count: orders.filter((o) => o.order_status === "Shipped").length,
      icon: <RiTruckLine />,
    },
    {
      title: "Delivered",
      count: orders.filter((o) => o.order_status === "Delivered").length,
      icon: <RiShipLine />,
    },
    {
      title: "Cancelled",
      count: orders.filter((o) => o.order_status === "Cancelled").length,
      icon: <RiCloseCircleLine />,
    },
    {
      title: "Refunded",
      count: orders.filter((o) => o.payment_status === "Refunded").length,
      icon: <RiRefund2Line />,
    },
  ];

  return (
    <div className="orders-page">
      {/* Page Top */}
      <div className="orders-page-top">
        <h1 className="orders-page-title">
          {editingOrder ? "Edit Order" : showOrderDetails ? "Order Details" : "Orders"}
        </h1>
        <Breadcrumb
          items={
            editingOrder
              ? ["Dashboard", "Orders", `Edit #${editingOrder.id}`]
              : showOrderDetails
              ? ["Dashboard", "Orders", "Order Details"]
              : ["Dashboard", "Orders"]
          }
        />
      </div>

      {/* Page Body */}
      <div className="orders-page-body">

        {/* EDIT MODE */}
        {editingOrder && (
          <Card className="orders-table-wrapper">
            <div className="orders-edit-form">
              <div className="orders-edit-header">
                <h3>Edit Order #{editingOrder.id}</h3>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="orders-edit-form-grid">

                  <div className="orders-edit-field">
                    <label>Order ID</label>
                    <input type="text" value={`#${editingOrder.id}`} disabled className="orders-edit-disabled" />
                  </div>

                  <div className="orders-edit-field">
                    <label>Customer</label>
                    <input type="text" value={editingOrder.customer_name || "N/A"} disabled className="orders-edit-disabled" />
                  </div>

                  <div className="orders-edit-field">
                    <label>Total</label>
                    <input type="text" value={`₹ ${editingOrder.total}`} disabled className="orders-edit-disabled" />
                  </div>

                  <div className="orders-edit-field">
                    <label>Payment Status</label>
                    <select name="payment_status" value={editForm.payment_status} onChange={handleEditChange}>
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Refunded">Refunded</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>

                  <div className="orders-edit-field">
                    <label>Order Status</label>
                    <select name="order_status" value={editForm.order_status} onChange={handleEditChange}>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="orders-edit-field">
                    <label>Payment Method</label>
                    <select name="payment_method" value={editForm.payment_method} onChange={handleEditChange}>
                      <option value="cod">Cash on Delivery</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="upi">UPI</option>
                      <option value="netbanking">Net Banking</option>
                    </select>
                  </div>

                </div>

                <div className="orders-edit-form-actions">
                  <button type="button" className="orders-edit-cancel-btn" onClick={handleEditCancel}>
                    <RiCloseLine /> Cancel
                  </button>
                  <button type="submit" className="orders-edit-save-btn" disabled={updating}>
                    <RiCheckLine /> {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {/* LIST MODE */}
        {!editingOrder && !showOrderDetails && (
          <>
            {/* Stats Cards */}
            <div className="orders-stats">
              {orderStats.map((item, index) => (
                <Card className="orders-card" key={index}>
                  <div className="orders-card-content">
                    <div>
                      <h4 className="orders-card-title">{item.title}</h4>
                      <h2 className="orders-card-count">{item.count}</h2>
                    </div>
                    <div className="orders-card-icon">{item.icon}</div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Orders Table */}
            <Card className="orders-table-wrapper">
              {/* Table Header */}
              <div className="orders-table-header">
                <h3 className="orders-table-title">All Order List</h3>
                <select className="orders-table-select">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Year</option>
                </select>
              </div>

              {/* Table */}
              <div className="orders-table-responsive">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Created At</th>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>City</th>
                      <th>Total</th>
                      <th>Country</th>
                      <th>Currency</th>
                      <th>Payment Status</th>
                      <th>Items</th>
                      <th>Order Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={index}>
                        <td>#{order.id}</td>
                        <td>
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="orders-customer-name">
                          {order.customer_name || "N/A"}
                        </td>
                        <td>{order.email || "N/A"}</td>
                        <td>{order.phone || "N/A"}</td>
                        <td>{order.city || "N/A"}</td>
                        <td>{order.currency || "INR"} {order.total}</td>
                        <td>{order.country || "N/A"}</td>
                        <td>{order.currency || "INR"}</td>
                        <td>
                          <span
                            className={`orders-badge ${
                              order.payment_status === "Paid"
                                ? "orders-paid"
                                : "orders-refund"
                            }`}
                          >
                            {order.payment_status}
                          </span>
                        </td>
                        <td>{order.total_items}</td>
                        <td>
                          <span
                            className={`orders-status ${
                              order.order_status === "Completed" ||
                              order.order_status === "Delivered"
                                ? "orders-completed"
                                : order.order_status === "Cancelled"
                                ? "orders-canceled"
                                : "orders-progress"
                            }`}
                          >
                            {order.order_status}
                          </span>
                        </td>
                        <td>
                          <div className="orders-action-buttons">
                            <button
                              className="orders-view-btn"
                              onClick={() => handleViewOrder(order)}
                            >
                              <RiEyeLine />
                            </button>
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
                                  <button onClick={() => handleEditClick(order)}>
                                    <RiEditLine />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteOrder(order.id)}
                                  >
                                    <RiDeleteBinLine />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="11" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="orders-pagination">
                <button className="orders-pagination-btn">Previous</button>
                <button className="orders-pagination-btn orders-active-page">
                  1
                </button>
                <button className="orders-pagination-btn">Next</button>
              </div>
            </Card>
          </>
        )}

        {/* ORDER DETAILS MODE */}
        {showOrderDetails && (
          <OrderDetails
            selectedOrder={selectedOrder}
            setShowOrderDetails={setShowOrderDetails}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;
