import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AccountHeader from "../Common/AccountHeader";
import { useTranslation } from "../context/LanguageContext";
import "../assets/style/AccountPages.css";

const API = "http://localhost:5000";

export default function UserProfile() {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [hasImage, setHasImage] = useState(false);

  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [hasCover, setHasCover] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${API}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setName(data.data.name || "");
        setEmail(data.data.email || "");
        setUserId(data.data.id);
        if (data.data.profileImageType) {
          setImagePreview(`${API}/api/users/profile/image/${data.data.id}`);
          setHasImage(true);
        } else {
          setImagePreview(null);
          setHasImage(false);
        }
        if (data.data.coverPhotoType) {
          setCoverPreview(`${API}/api/users/profile/cover/${data.data.id}`);
          setHasCover(true);
        } else {
          setCoverPreview(null);
          setHasCover(false);
        }
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...stored, ...data.data }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setHasImage(false);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setHasCover(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${API}/api/users/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!data.success) {
        setMsg(data.message);
        setLoading(false);
        return;
      }

      if (coverFile) {
        const formData = new FormData();
        formData.append("coverPhoto", coverFile);
        const coverRes = await fetch(`${API}/api/users/profile/cover`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        let coverData;
        try {
          coverData = await coverRes.json();
        } catch {
          setMsg("Cover photo upload failed. Please try a smaller image.");
          setLoading(false);
          return;
        }
        if (!coverData.success) {
          setMsg(coverData.message || "Error uploading cover photo");
          setLoading(false);
          return;
        }
        const newVersion = Date.now();
        setCoverPreview(`${API}/api/users/profile/cover/${userId}?v=${newVersion}`);
        setHasCover(true);
        setCoverFile(null);
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append("profileImage", imageFile);
        const imgRes = await fetch(`${API}/api/users/profile/image`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        let imgData;
        try {
          imgData = await imgRes.json();
        } catch {
          setMsg("Image upload failed. Please try a smaller image.");
          setLoading(false);
          return;
        }
        if (!imgData.success) {
          setMsg(imgData.message || "Error uploading image");
          setLoading(false);
          return;
        }
        const newVersion = Date.now();
        setImagePreview(`${API}/api/users/profile/image/${userId}?v=${newVersion}`);
        setHasImage(true);
        setImageFile(null);
      }

      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, name, email }));

      window.dispatchEvent(new Event("profileUpdated"));

      setMsg(t("profile.updated"));
    } catch (err) {
      console.error("Profile save error:", err);
      setMsg("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fallbackImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&size=90`;
  const fallbackCover = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=400&fit=crop";

  return (
    <>
      <AccountHeader title={t("profile.title")} breadcrumb={`${t("breadcrumb.home")} → ${t("breadcrumb.profile")}`} />
      <div className="account-page">
        <div className="account-page-container">
          <div className="account-card profile-card">
            {fetching ? (
              <div className="account-loading">{t("common.loading")}</div>
            ) : (
              <>
                <div className="profile-cover-section">
                  <img
                    src={coverPreview || fallbackCover}
                    alt="cover"
                    className="profile-cover-img"
                    onError={(e) => { e.target.src = fallbackCover; }}
                  />
                  <div className="profile-cover-overlay" onClick={() => coverInputRef.current?.click()}>
                    <span>{t("profile.changeCover") || "Change Cover"}</span>
                  </div>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    hidden
                  />
                  <div className="profile-avatar-on-cover">
                    <img
                      src={imagePreview || fallbackImg}
                      alt="profile"
                      onError={(e) => { e.target.src = fallbackImg; }}
                    />
                    <div className="profile-avatar-overlay" onClick={() => avatarInputRef.current?.click()}>
                      <span>+</span>
                    </div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="account-form profile-form">
                  <div className="profile-info-row">
                    <h2>{name || "User"}</h2>
                    <p>{email}</p>
                  </div>

                  <div className="account-field">
                    <label>{t("profile.name")}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="account-field">
                    <label>{t("profile.email")}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {msg && <p className={`account-msg ${msg.includes("Error") ? "account-msg-error" : ""}`}>{msg}</p>}

                  <button type="submit" className="account-btn" disabled={loading}>
                    {loading ? "..." : t("profile.save")}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
