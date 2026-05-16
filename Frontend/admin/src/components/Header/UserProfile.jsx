// =========================
// UserProfile.jsx
// =========================

import Dropdown from "../widgets/Dropdown";
import {
  FiUser,
  FiInbox,
  FiCheckSquare,
  FiSettings,
  FiCreditCard,
  FiHeadphones,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  // get admin data from localStorage
  const adminName = localStorage.getItem("adminName");
  const adminEmail = localStorage.getItem("adminEmail");
  // logout function
  const handleLogout = () => {

  localStorage.removeItem("adminAuth");
  localStorage.removeItem("adminName");
  localStorage.removeItem("adminEmail");

  navigate("/", { replace: true });

  window.location.reload();
};
  return (
    <Dropdown
      width="200px"
      trigger={
        <div className="user-profile">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="user"
          />

          <div>
            <h4>{adminName}</h4>
            <p>Web Designer</p>
          </div>
        </div>
      }
    >
      <div className="profile-dropdown">

        <ul>
          <li>
            <FiUser /> Profile
          </li>

          <li>
            <FiInbox />
            Inbox
            <span>25</span>
          </li>

          <li>
            <FiCheckSquare /> Task Manager
          </li>

          <li>
            <FiSettings /> Settings
          </li>

          <li>
            <FiCreditCard /> Bal: $7,129,950
          </li>

          <li>
            <FiHeadphones /> Support
          </li>

          {/* Logout */}
          <li
            
              type="button"
              onClick={handleLogout}
            >
              <FiLogOut />
              <span>Log Out</span>
            
          </li>
        </ul>
      </div>
    </Dropdown>
  );
};

export default UserProfile;