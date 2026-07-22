import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../widgets/Dropdown";
import {
  FiBell,
  FiGift,
  FiPercent,
  FiUserCheck,
  FiCheckCircle,
  FiClock,
  FiX,
  FiTrash2,
  FiPackage,
  FiAlertTriangle,
  FiMessageSquare,
} from "react-icons/fi";

const API = "http://localhost:5000";

const typeConfig = {
  order: { icon: <FiPackage />, color: "purple" },
  promo: { icon: <FiPercent />, color: "blue" },
  account: { icon: <FiUserCheck />, color: "pink" },
  system: { icon: <FiCheckCircle />, color: "yellow" },
  review: { icon: <FiMessageSquare />, color: "green" },
  stock: { icon: <FiAlertTriangle />, color: "yellow" },
};

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API}/api/notifications`);
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data || []);
        setUnreadCount(json.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await fetch(`${API}/api/notifications/${id}/read`, { method: "PUT" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await fetch(`${API}/api/notifications/${id}`, { method: "DELETE" });
      const item = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (item && !item.is_read) setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch(`${API}/api/notifications/read-all`, { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = (notif) => {
    if (!notif.is_read) handleMarkRead(notif.id);
    if (notif.link) navigate(notif.link);
  };

  const formatTime = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  return (
    <Dropdown
      width="380px"
      trigger={
        <div className="header-icon badge-wrapper">
          <FiBell />
          {unreadCount > 0 && (
            <span className="top-badge blue">{unreadCount > 99 ? "99+" : unreadCount}</span>
          )}
        </div>
      }
    >
      <div className="notification-dropdown">
        <div className="notification-header">
          <h3>Notifications</h3>
          {unreadCount > 0 && (
            <span onClick={handleMarkAllRead} style={{ cursor: "pointer" }}>
              {unreadCount} Unread
            </span>
          )}
        </div>

        <div className="notification-items">
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontSize: 13 }}>
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontSize: 13 }}>
              <FiBell style={{ fontSize: 32, marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
              No notifications yet
            </div>
          ) : (
            notifications.map((item) => {
              const config = typeConfig[item.type] || typeConfig.system;
              return (
                <div
                  key={item.id}
                  className={`notification-item ${!item.is_read ? "active" : ""}`}
                  onClick={() => handleClick(item)}
                  style={{ cursor: item.link ? "pointer" : "default" }}
                >
                  <div className={`notification-icon ${config.color}`}>
                    {config.icon}
                  </div>
                  <div className="notification-content">
                    <h4>{item.title}</h4>
                    {item.description && <p>{item.description}</p>}
                    <span className="notification-time">{formatTime(item.created_at)}</span>
                  </div>
                  <button
                    className="notification-close"
                    onClick={(e) => { e.stopPropagation(); handleDismiss(item.id); }}
                    title="Dismiss"
                  >
                    <FiX />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="notification-footer">
          {notifications.length > 0 && (
            <button onClick={() => navigate("/dashboard/orders")}>View All</button>
          )}
        </div>
      </div>
    </Dropdown>
  );
};

export default NotificationIcon;
