import Breadcrumb from "../common/Breadcrumb";
import "../../assets/style/AboutUs.css";
import { useEffect, useState } from "react";
import {
  FaStar, FaAward, FaHeart, FaThumbsUp, FaSave,
  FaImage, FaVideo, FaPenFancy, FaListUl, FaLink, FaCheck
} from "react-icons/fa";

const API = "http://localhost:5000";

const TABS = [
  { id: "content", label: "Content", icon: <FaPenFancy /> },
  { id: "images", label: "Images", icon: <FaImage /> },
  { id: "video", label: "Video", icon: <FaVideo /> },
  { id: "features", label: "Features", icon: <FaListUl /> },
];

const ImagePreview = ({ url, label }) => {
  if (!url) return null;
  return (
    <div className="about-img-preview-card">
      <img src={url} alt={label} />
      <span className="about-img-preview-label">{label}</span>
    </div>
  );
};

const AboutUs = () => {
  const [form, setForm] = useState({
    heading: "", description: "",
    stat1_value: "", stat1_label: "",
    stat2_value: "", stat2_label: "",
    stat3_value: "", stat3_label: "",
    experience_title: "", experience_text: "",
    feature1: "", feature2: "", feature3: "", feature4: "", feature5: "",
    hero_image: "", about_image: "", experience_image: "", video_banner_image: "",
    video_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchAboutPage(); }, []);

  const fetchAboutPage = async () => {
    try {
      const res = await fetch(`${API}/api/about`);
      const data = await res.json();
      if (data.success && data.data) {
        const d = data.data;
        setForm({
          heading: d.heading || "", description: d.description || "",
          stat1_value: d.stat1_value || "", stat1_label: d.stat1_label || "",
          stat2_value: d.stat2_value || "", stat2_label: d.stat2_label || "",
          stat3_value: d.stat3_value || "", stat3_label: d.stat3_label || "",
          experience_title: d.experience_title || "", experience_text: d.experience_text || "",
          feature1: d.feature1 || "", feature2: d.feature2 || "", feature3: d.feature3 || "",
          feature4: d.feature4 || "", feature5: d.feature5 || "",
          hero_image: d.hero_image || "", about_image: d.about_image || "",
          experience_image: d.experience_image || "", video_banner_image: d.video_banner_image || "",
          video_url: d.video_url || "",
        });
      }
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API}/api/about`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) { console.log(err); alert("Server Error"); }
  };

  if (loading) {
    return (
      <div className="content">
        <div className="page-top">
          <h1 className="page-title">About Us</h1>
          <Breadcrumb />
        </div>
        <div className="about-loading">
          <div className="about-loading-spinner" />
          <p>Loading about page content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-top">
        <h1 className="page-title">About Us</h1>
        <Breadcrumb />
      </div>

      {/* HERO BANNER */}
      <div className="about-hero-banner">
        <div className="about-hero-overlay">
          <h2>About Page Editor</h2>
          <p>Manage your about page content, images, and video from one place</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="about-stats-row">
        <div className="about-stat-card about-stat-purple">
          <div className="about-stat-icon"><FaStar /></div>
          <div className="about-stat-info">
            <span className="about-stat-value">{form.stat1_value ? Number(form.stat1_value).toLocaleString() : "—"}</span>
            <span className="about-stat-label">{form.stat1_label || "Premium Products"}</span>
          </div>
        </div>
        <div className="about-stat-card about-stat-blue">
          <div className="about-stat-icon"><FaAward /></div>
          <div className="about-stat-info">
            <span className="about-stat-value">{form.stat2_value ? Number(form.stat2_value).toLocaleString() : "—"}</span>
            <span className="about-stat-label">{form.stat2_label || "Experience"}</span>
          </div>
        </div>
        <div className="about-stat-card about-stat-green">
          <div className="about-stat-icon"><FaHeart /></div>
          <div className="about-stat-info">
            <span className="about-stat-value">{form.stat3_value ? Number(form.stat3_value).toLocaleString() : "—"}</span>
            <span className="about-stat-label">{form.stat3_label || "Happy Customers"}</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="about-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`about-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}<span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="about-tab-panel">

        {/* CONTENT TAB */}
        {activeTab === "content" && (
          <div className="about-panel-grid">
            <div className="about-form-card">
              <div className="about-form-card-header">
                <FaPenFancy /><h3>Page Heading & Description</h3>
              </div>
              <div className="about-form-group">
                <label>Heading</label>
                <input type="text" name="heading" value={form.heading} onChange={handleChange} placeholder="Enter page heading" />
              </div>
              <div className="about-form-group">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Enter about page description" rows="5" />
              </div>
            </div>

            <div className="about-form-card">
              <div className="about-form-card-header">
                <FaThumbsUp /><h3>Experience Section</h3>
              </div>
              <div className="about-form-group">
                <label>Experience Title</label>
                <input type="text" name="experience_title" value={form.experience_title} onChange={handleChange} placeholder="e.g. Our Experience" />
              </div>
              <div className="about-form-group">
                <label>Experience Text</label>
                <textarea name="experience_text" value={form.experience_text} onChange={handleChange} placeholder="Describe your experience" rows="5" />
              </div>
            </div>

            <div className="about-form-card about-form-card-full">
              <div className="about-form-card-header">
                <FaStar /><h3>Statistics</h3>
              </div>
              <div className="about-stats-form-grid">
                <div className="about-stats-form-group">
                  <label>Stat 1 — Value</label>
                  <input type="number" name="stat1_value" value={form.stat1_value} onChange={handleChange} placeholder="e.g. 12000" />
                  <label>Stat 1 — Label</label>
                  <input type="text" name="stat1_label" value={form.stat1_label} onChange={handleChange} placeholder="e.g. Premium Products" />
                </div>
                <div className="about-stats-form-group">
                  <label>Stat 2 — Value</label>
                  <input type="number" name="stat2_value" value={form.stat2_value} onChange={handleChange} placeholder="e.g. 25000" />
                  <label>Stat 2 — Label</label>
                  <input type="text" name="stat2_label" value={form.stat2_label} onChange={handleChange} placeholder="e.g. Years Experience" />
                </div>
                <div className="about-stats-form-group">
                  <label>Stat 3 — Value</label>
                  <input type="number" name="stat3_value" value={form.stat3_value} onChange={handleChange} placeholder="e.g. 20000" />
                  <label>Stat 3 — Label</label>
                  <input type="text" name="stat3_label" value={form.stat3_label} onChange={handleChange} placeholder="e.g. Happy Customers" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* IMAGES TAB */}
        {activeTab === "images" && (
          <div className="about-panel-grid">
            <div className="about-form-card about-form-card-full">
              <div className="about-form-card-header">
                <FaImage /><h3>Page Images</h3>
              </div>
              <p className="about-form-hint">Paste image URLs below. These will be displayed on the public about page.</p>

              <div className="about-image-inputs-grid">
                {[
                  { name: "hero_image", label: "Hero Image", desc: "Full-width banner at top of page" },
                  { name: "about_image", label: "About Image", desc: "Shown next to about description" },
                  { name: "experience_image", label: "Experience Image", desc: "Shown next to experience section" },
                  { name: "video_banner_image", label: "Video Banner Image", desc: "Background for video play button" },
                ].map((img) => (
                  <div className="about-image-input-card" key={img.name}>
                    <div className="about-image-input-header">
                      <FaImage />
                      <div>
                        <span className="about-image-input-label">{img.label}</span>
                        <span className="about-image-input-desc">{img.desc}</span>
                      </div>
                    </div>
                    <div className="about-form-group">
                      <div className="about-url-input-wrapper">
                        <FaLink className="about-url-icon" />
                        <input
                          type="text"
                          name={img.name}
                          value={form[img.name]}
                          onChange={handleChange}
                          placeholder="https://example.com/image.jpg"
                          className="about-url-input"
                        />
                      </div>
                    </div>
                    <ImagePreview url={form[img.name]} label={img.label} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIDEO TAB */}
        {activeTab === "video" && (
          <div className="about-panel-grid">
            <div className="about-form-card about-form-card-full">
              <div className="about-form-card-header">
                <FaVideo /><h3>Video Settings</h3>
              </div>

              <div className="about-video-layout">
                <div className="about-video-form-side">
                  <div className="about-form-group">
                    <label>YouTube Embed URL</label>
                    <div className="about-url-input-wrapper">
                      <FaLink className="about-url-icon" />
                      <input
                        type="text"
                        name="video_url"
                        value={form.video_url}
                        onChange={handleChange}
                        placeholder="https://www.youtube.com/embed/VIDEO_ID"
                        className="about-url-input"
                      />
                    </div>
                    <span className="about-form-hint">Use the embed URL format: youtube.com/embed/ID</span>
                  </div>
                </div>
                <div className="about-video-preview-side">
                  {form.video_url ? (
                    <div className="about-video-embed-preview">
                      <iframe
                        width="100%"
                        height="100%"
                        src={form.video_url}
                        title="Video Preview"
                        frameBorder="0"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="about-video-empty">
                      <FaVideo />
                      <p>Enter a video URL to see preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FEATURES TAB */}
        {activeTab === "features" && (
          <div className="about-panel-grid">
            <div className="about-form-card about-form-card-full">
              <div className="about-form-card-header">
                <FaListUl /><h3>Feature Highlights</h3>
              </div>
              <p className="about-form-hint">Add up to 5 feature highlights shown in the experience section.</p>

              <div className="about-features-list">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div className="about-feature-input-row" key={num}>
                    <span className="about-feature-badge">{num}</span>
                    <div className="about-form-group about-feature-input-group">
                      <input
                        type="text"
                        name={`feature${num}`}
                        value={form[`feature${num}`]}
                        onChange={handleChange}
                        placeholder={`Feature ${num}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STICKY SAVE BAR */}
      <div className="about-save-bar">
        <div className="about-save-bar-inner">
          <span className="about-save-status">
            {saved ? <><FaCheck /> Saved successfully</> : "Unsaved changes"}
          </span>
          <button className="about-save-btn" onClick={handleSave}>
            <FaSave /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
