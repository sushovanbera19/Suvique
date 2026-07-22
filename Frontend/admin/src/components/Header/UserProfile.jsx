import { useState, useEffect } from "react";
import Dropdown from "../widgets/Dropdown";
import {
  FiUser, FiSettings, FiLogOut
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const adminEmail = localStorage.getItem("adminEmail");
  const adminName = localStorage.getItem("adminName");

  useEffect(() => {
    if (!adminEmail) return;
    fetch(`${API}/api/admin/profile?email=${encodeURIComponent(adminEmail)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setProfile(json.data);
      })
      .catch(() => {});
  }, [adminEmail]);

  const displayName = profile?.name || adminName || "Admin";
  const displayRole = profile?.role || "Administrator";
  const avatar = profile?.avatar ? `${API}${profile.avatar.replace(/\\/g, "/")}` : null;
  const cover = profile?.cover_photo ? `${API}${profile.cover_photo.replace(/\\/g, "/")}` : null;

  const initials = displayName
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminImage");
    localStorage.removeItem("adminCover");
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <Dropdown
      width="280px"
      trigger={
        <div className="user-profile">
          {avatar ? (
            <img src={avatar} alt="user" />
          ) : (
            <div className="avatar-letter">{initials}</div>
          )}
          <div>
            <h4>{displayName}</h4>
            <p>{displayRole}</p>
          </div>
        </div>
      }
    >
      <div className="profile-dropdown">
        <div className="dropdown-header" style={{ position: "relative", padding: 0, overflow: "hidden" }}>
          {cover ? (
            <img src={cover} alt="cover" style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: 90, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }} />
          )}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 16px 16px", marginTop: -30, position: "relative", zIndex: 1 }}>
            {avatar ? (
              <img src={avatar} alt="user" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "3px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }} />
            ) : (
              <div style={{ width: 56, height: 56, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#fff", borderRadius: "50%", fontWeight: 700, border: "3px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                {initials}
              </div>
            )}
            <h4 style={{ margin: "8px 0 2px", fontSize: 15, fontWeight: 700 }}>{displayName}</h4>
            <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{displayRole}</p>
          </div>
        </div>
        <ul>
          <li onClick={() => navigate("/dashboard/profile")} style={{ cursor: "pointer" }}>
            <FiUser /> My Profile
          </li>
          <li onClick={() => navigate("/dashboard/settings")} style={{ cursor: "pointer" }}>
            <FiSettings /> Settings
          </li>
          <li className="logout" onClick={handleLogout} style={{ cursor: "pointer", color: "#ef4444" }}>
            <FiLogOut /> <span>Log Out</span>
          </li>
        </ul>
      </div>
    </Dropdown>
  );
};

export default UserProfile;
