import { useState, useEffect, useRef } from "react";
import Breadcrumb from "../common/Breadcrumb";
import {
  FiUser, FiMail, FiPhone, FiEdit2, FiSave, FiX, FiCamera,
  FiLock, FiShield, FiCalendar, FiCheck, FiImage
} from "react-icons/fi";
import "../../assets/style/AdminProfile.css";

const API = "http://localhost:5000";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", bio: "", role: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const avatarRef = useRef(null);
  const coverRef = useRef(null);

  const adminEmail = localStorage.getItem("adminEmail");

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast({ type: "", msg: "" }), 3000);
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API}/api/admin/profile?email=${encodeURIComponent(adminEmail)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setProfile(json.data);
        setForm({
          name: json.data.name || "",
          phone: json.data.phone || "",
          bio: json.data.bio || "",
          role: json.data.role || "Administrator",
        });
        if (json.data.avatar) {
          setAvatarPreview(`${API}${json.data.avatar.replace(/\\/g, "/")}`);
        }
        if (json.data.cover_photo) {
          setCoverPreview(`${API}${json.data.cover_photo.replace(/\\/g, "/")}`);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("email", adminEmail);
      fd.append("avatar", avatarFile);
      const res = await fetch(`${API}/api/admin/avatar`, { method: "POST", body: fd });
      const json = await res.json();
      if (json.success) {
        const fullUrl = `${API}${json.avatar.replace(/\\/g, "/")}`;
        localStorage.setItem("adminImage", fullUrl);
        showToast("success", "Avatar updated!");
        setAvatarFile(null);
        fetchProfile();
      } else {
        showToast("error", json.message || "Upload failed");
      }
    } catch (err) {
      showToast("error", "Upload failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleCoverUpload = async () => {
    if (!coverFile) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("email", adminEmail);
      fd.append("cover_photo", coverFile);
      const res = await fetch(`${API}/api/admin/cover-photo`, { method: "POST", body: fd });
      const json = await res.json();
      if (json.success) {
        localStorage.setItem("adminCover", `${API}${json.cover_photo.replace(/\\/g, "/")}`);
        showToast("success", "Cover photo updated!");
        setCoverFile(null);
        fetchProfile();
      } else {
        showToast("error", json.message || "Upload failed");
      }
    } catch (err) {
      showToast("error", "Upload failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!form.name.trim()) return showToast("error", "Name is required");
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/admin/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, ...form }),
      });
      const json = await res.json();
      if (json.success) {
        localStorage.setItem("adminName", form.name);
        showToast("success", "Profile updated!");
        setEditing(false);
        fetchProfile();
      } else {
        showToast("error", json.message || "Update failed");
      }
    } catch (err) {
      showToast("error", "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) {
      return showToast("error", "All fields are required");
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return showToast("error", "New passwords do not match");
    }
    if (pwForm.newPassword.length < 6) {
      return showToast("error", "Password must be at least 6 characters");
    }
    setPwSaving(true);
    try {
      const res = await fetch(`${API}/api/admin/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, ...pwForm }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("success", "Password changed!");
        setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPassword(false);
      } else {
        showToast("error", json.message || "Failed");
      }
    } catch (err) {
      showToast("error", "Failed to change password");
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="shop-admin-wrap">
        <div className="settings-page-top">
          <h1 className="settings-page-title">My Profile</h1>
          <Breadcrumb />
        </div>
        <div className="shop-loading">Loading profile...</div>
      </div>
    );
  }

  const initials = profile?.name
    ? profile.name.split(" ").map((w) => w.charAt(0)).join("").toUpperCase().slice(0, 2)
    : "A";

  return (
    <div className="shop-admin-wrap">
      {toast.msg && (
        <div className={`ui-toast ${toast.type === "error" ? "error" : ""}`}>{toast.msg}</div>
      )}

      <div className="settings-page-top">
        <h1 className="settings-page-title">My Profile</h1>
        <Breadcrumb />
      </div>

      <div className="ap-profile-card">
        <div className="ap-cover-section">
          {coverPreview ? (
            <img src={coverPreview} alt="Cover" className="ap-cover-img" />
          ) : (
            <div className="ap-cover-placeholder" />
          )}
          <div className="ap-cover-overlay" onClick={() => coverRef.current?.click()}>
            <FiCamera /> <span>Change Cover</span>
          </div>
          <input ref={coverRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleCoverChange} />
          {coverFile && (
            <div className="ap-cover-actions">
              <button className="ap-btn-sm ap-btn-save" onClick={handleCoverUpload} disabled={saving}>
                <FiCheck /> Save Cover
              </button>
              <button className="ap-btn-sm ap-btn-cancel" onClick={() => { setCoverFile(null); setCoverPreview(profile?.cover_photo ? `${API}${profile.cover_photo.replace(/\\/g, "/")}` : null); }}>
                <FiX /> Cancel
              </button>
            </div>
          )}
        </div>

        <div className="ap-profile-body">
          <div className="ap-avatar-section">
            <div className="ap-avatar-wrap" onClick={() => avatarRef.current?.click()}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="ap-avatar-img" />
              ) : (
                <div className="ap-avatar-placeholder">{initials}</div>
              )}
              <div className="ap-avatar-overlay">
                <FiCamera />
              </div>
              <input ref={avatarRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
            </div>
            {avatarFile && (
              <div className="ap-avatar-actions">
                <button className="ap-btn-sm ap-btn-save" onClick={handleAvatarUpload} disabled={saving}>
                  <FiCheck /> Save
                </button>
                <button className="ap-btn-sm ap-btn-cancel" onClick={() => { setAvatarFile(null); setAvatarPreview(profile?.avatar ? `${API}${profile.avatar.replace(/\\/g, "/")}` : null); }}>
                  <FiX /> Cancel
                </button>
              </div>
            )}
          </div>
          <div className="ap-profile-info">
            <h2>{profile?.name || "Admin"}</h2>
            <p className="ap-role">{profile?.role || "Administrator"}</p>
            <p className="ap-email"><FiMail /> {profile?.email}</p>
          </div>
        </div>
      </div>

      <div className="ap-grid">
        <div className="ap-card">
          <div className="ap-card-header">
            <h3><FiUser /> Personal Information</h3>
            {!editing && (
              <button className="ap-edit-btn" onClick={() => setEditing(true)}>
                <FiEdit2 /> Edit
              </button>
            )}
          </div>
          <div className="ap-card-body">
            <div className="ap-field-grid">
              <div className="ap-field">
                <label>Full Name</label>
                {editing ? (
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                ) : (
                  <span className="ap-field-value">{profile?.name || "—"}</span>
                )}
              </div>
              <div className="ap-field">
                <label>Email Address</label>
                <span className="ap-field-value ap-locked"><FiMail /> {profile?.email}</span>
              </div>
              <div className="ap-field">
                <label>Phone</label>
                {editing ? (
                  <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
                ) : (
                  <span className="ap-field-value">{profile?.phone || "—"}</span>
                )}
              </div>
              <div className="ap-field">
                <label>Role</label>
                {editing ? (
                  <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                ) : (
                  <span className="ap-field-value">{profile?.role || "Administrator"}</span>
                )}
              </div>
              <div className="ap-field ap-field-full">
                <label>Bio</label>
                {editing ? (
                  <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself..." />
                ) : (
                  <span className="ap-field-value">{profile?.bio || "—"}</span>
                )}
              </div>
            </div>
            {editing && (
              <div className="ap-card-footer">
                <button className="ui-cancel-btn" onClick={() => { setEditing(false); setForm({ name: profile?.name || "", phone: profile?.phone || "", bio: profile?.bio || "", role: profile?.role || "Administrator" }); }}>
                  <FiX /> Cancel
                </button>
                <button className="ui-save-btn" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? "Saving..." : <><FiSave /> Save Changes</>}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="ap-card">
          <div className="ap-card-header">
            <h3><FiShield /> Security</h3>
            {!showPassword && (
              <button className="ap-edit-btn" onClick={() => setShowPassword(true)}>
                <FiLock /> Change Password
              </button>
            )}
          </div>
          <div className="ap-card-body">
            {showPassword ? (
              <div className="ap-field-grid">
                <div className="ap-field ap-field-full">
                  <label>Current Password</label>
                  <input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} placeholder="Enter current password" />
                </div>
                <div className="ap-field">
                  <label>New Password</label>
                  <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} placeholder="Enter new password" />
                </div>
                <div className="ap-field">
                  <label>Confirm New Password</label>
                  <input type="password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} placeholder="Confirm new password" />
                </div>
                <div className="ap-card-footer ap-field-full">
                  <button className="ui-cancel-btn" onClick={() => { setShowPassword(false); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }}>
                    <FiX /> Cancel
                  </button>
                  <button className="ui-save-btn" onClick={handleChangePassword} disabled={pwSaving}>
                    {pwSaving ? "Saving..." : <><FiLock /> Update Password</>}
                  </button>
                </div>
              </div>
            ) : (
              <div className="ap-security-info">
                <div className="ap-security-item">
                  <FiShield />
                  <div>
                    <p className="ap-security-label">Password</p>
                    <span className="ap-security-hint">Last changed: Unknown</span>
                  </div>
                </div>
                <div className="ap-security-item">
                  <FiCalendar />
                  <div>
                    <p className="ap-security-label">Account Created</p>
                    <span className="ap-security-hint">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "—"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
