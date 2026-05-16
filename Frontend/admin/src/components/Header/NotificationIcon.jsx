// =========================
// NotificationIcon.jsx
// =========================

import Dropdown from "../widgets/Dropdown";
import {
  FiBell,
  FiGift,
  FiPercent,
  FiUserCheck,
  FiCheckCircle,
  FiClock,
  FiX,
} from "react-icons/fi";

const notifications = [
  {
    id: 1,
    icon: <FiGift />,
    title: "Your Order Has Been Shipped",
    desc: "Order No: 123456 Has Shipped To Your Delivery Address",
    color: "purple",
  },
  {
    id: 2,
    icon: <FiPercent />,
    title: "Discount Available",
    desc: "Discount Available On Selected Products",
    color: "blue",
  },
  {
    id: 3,
    icon: <FiUserCheck />,
    title: "Account Has Been Verified",
    desc: "Your Account Has Been Verified Sucessfully",
    color: "pink",
  },
  {
    id: 4,
    icon: <FiCheckCircle />,
    title: "Order Placed ID: #1116773",
    desc: "Order Placed Successfully",
    color: "yellow",
  },
  
];

const NotificationIcon = () => {

  // Dynamic Count
  const notificationCount = notifications.length;

  return (
    <Dropdown
      width="350px"
      trigger={
        <div className="header-icon badge-wrapper">
          <FiBell />

          <span className="top-badge blue">
            {notificationCount}
          </span>
        </div>
      }
    >
      <div className="notification-dropdown">

        {/* Header */}
        <div className="notification-header">
          <h3>Notifications</h3>

          <span>
            {notificationCount} Unread
          </span>
        </div>

        {/* Notifications */}
        <div className="notification-items">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`notification-item ${
                item.active ? "active" : ""
              }`}
            >
              {/* Left */}
              <div
                className={`notification-icon ${item.color}`}
              >
                {item.icon}
              </div>

              {/* Content */}
              <div className="notification-content">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>

              {/* Close */}
              <button className="notification-close">
                <FiX />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="notification-footer">
          <button>View All</button>
        </div>
      </div>
    </Dropdown>
  );
};

export default NotificationIcon;