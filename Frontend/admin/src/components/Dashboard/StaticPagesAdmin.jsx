import { useState, useEffect, useRef } from "react";
import Breadcrumb from "../common/Breadcrumb";
import "../../assets/style/StaticPages.css";
import {
  FaSave, FaCheck, FaImage, FaPenFancy, FaListUl, FaLink,
  FaStar, FaArrowRight, FaSpinner, FaUpload, FaTimes, FaTrash
} from "react-icons/fa";

const API = "http://localhost:5000";

const PAGE_OPTIONS = [
  { slug: "interior-designer", label: "Interior Designer", color: "#667eea" },
  { slug: "analytics", label: "Furniture Analytics", color: "#f093fb" },
  { slug: "boutique-store", label: "Boutique Store", color: "#4facfe" },
  { slug: "careers", label: "Careers", color: "#43e97b" },
  { slug: "customers", label: "Customers", color: "#fa709a" },
  { slug: "smart-finance", label: "Smart Finance", color: "#fccb90" },
  { slug: "guides", label: "Design Guides", color: "#a18cd1" },
];

const EMPTY_FORM = {
  hero_title: "", hero_subtitle: "", hero_image: "",
  section1_title: "", section1_text1: "", section1_text2: "", section1_image: "",
  section2_title: "", section2_text1: "", section2_text2: "", section2_image: "",
  features_title: "",
  feature1_title: "", feature1_desc: "", feature1_icon: "",
  feature2_title: "", feature2_desc: "", feature2_icon: "",
  feature3_title: "", feature3_desc: "", feature3_icon: "",
  feature4_title: "", feature4_desc: "", feature4_icon: "",
  stat1_value: "", stat1_label: "", stat2_value: "", stat2_label: "", stat3_value: "", stat3_label: "",
  cta_title: "", cta_text: "", cta_btn: "", cta_link: "",
};

const ImageField = ({ label, name, value, onChange }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`${API}/api/static-pages/upload`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.success && data.url) {
        onChange({ target: { name, value: data.url } });
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.log(err);
      alert("Upload error");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemove = () => {
    onChange({ target: { name, value: "" } });
  };

  return (
    <div className="sp-img-field">
      <label>{label}</label>
      <div className="sp-img-actions">
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder="Paste image URL or upload below"
          className="sp-url-input"
        />
        <button
          type="button"
          className="sp-upload-btn"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <FaSpinner className="sp-spinner-btn" /> : <><FaUpload /> Upload</>}
        </button>
        {value && (
          <button type="button" className="sp-remove-btn" onClick={handleRemove}>
            <FaTimes />
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
      {value && (
        <div className="sp-img-preview">
          <img src={value} alt={label} />
          <button type="button" className="sp-img-delete" onClick={handleRemove}>
            <FaTrash /> Remove
          </button>
        </div>
      )}
    </div>
  );
};

const StaticPagesAdmin = () => {
  const [pages, setPages] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => { fetchPages(); }, []);

  useEffect(() => {
    if (selectedSlug) fetchPageData(selectedSlug);
  }, [selectedSlug]);

  const fetchPages = async () => {
    try {
      const res = await fetch(`${API}/api/static-pages`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setPages(data.data);
        setSelectedSlug(data.data[0].slug);
      }
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const fetchPageData = async (slug) => {
    try {
      const res = await fetch(`${API}/api/static-pages/${slug}`);
      const data = await res.json();
      if (data.success && data.data) {
        const d = data.data;
        const filled = {};
        Object.keys(EMPTY_FORM).forEach((k) => { filled[k] = d[k] || ""; });
        setForm(filled);
      } else {
        setForm({ ...EMPTY_FORM });
      }
      setSaved(false);
    } catch (err) { console.log(err); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/static-pages/${selectedSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        alert(data.message || "Save failed");
      }
    } catch (err) { console.log(err); alert("Server error"); }
    finally { setSaving(false); }
  };

  const currentPage = PAGE_OPTIONS.find((p) => p.slug === selectedSlug);

  if (loading) {
    return (
      <div className="content">
        <div className="page-top">
          <h1 className="page-title">Static Pages</h1>
          <Breadcrumb />
        </div>
        <div className="sp-loading">
          <FaSpinner className="sp-spinner" />
          <p>Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-top">
        <h1 className="page-title">Static Pages</h1>
        <Breadcrumb />
      </div>

      {/* HERO */}
      <div className="sp-hero" style={{ background: `linear-gradient(135deg, ${currentPage?.color || "#667eea"} 0%, #333 100%)` }}>
        <div className="sp-hero-overlay">
          <h2>Page Content Editor</h2>
          <p>Manage images, text, features, stats & CTA — upload or paste URLs</p>
        </div>
      </div>

      {/* PAGE SELECTOR */}
      <div className="sp-page-selector">
        <label>Select Page:</label>
        <div className="sp-page-pills">
          {PAGE_OPTIONS.map((p) => (
            <button
              key={p.slug}
              className={`sp-pill ${selectedSlug === p.slug ? "active" : ""}`}
              style={selectedSlug === p.slug ? { background: p.color } : {}}
              onClick={() => setSelectedSlug(p.slug)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div className="sp-tabs">
        {[
          { id: "hero", label: "Hero", icon: <FaImage /> },
          { id: "sections", label: "Sections", icon: <FaPenFancy /> },
          { id: "features", label: "Features", icon: <FaListUl /> },
          { id: "stats", label: "Stats", icon: <FaStar /> },
          { id: "cta", label: "CTA", icon: <FaArrowRight /> },
        ].map((tab) => (
          <button key={tab.id} className={`sp-tab ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            {tab.icon}<span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* PANELS */}
      <div className="sp-panel">

        {/* HERO TAB */}
        {activeTab === "hero" && (
          <div className="sp-grid">
            <div className="sp-card">
              <div className="sp-card-header"><FaPenFancy /><h3>Hero Banner</h3></div>
              <div className="sp-field"><label>Title</label><input name="hero_title" value={form.hero_title} onChange={handleChange} placeholder="Page hero title" /></div>
              <div className="sp-field"><label>Subtitle</label><input name="hero_subtitle" value={form.hero_subtitle} onChange={handleChange} placeholder="Hero subtitle text" /></div>
              <ImageField label="Hero Image" name="hero_image" value={form.hero_image} onChange={handleChange} />
            </div>
          </div>
        )}

        {/* SECTIONS TAB */}
        {activeTab === "sections" && (
          <div className="sp-grid">
            {["1", "2"].map((num) => (
              <div className="sp-card" key={num}>
                <div className="sp-card-header"><FaPenFancy /><h3>Section {num}</h3></div>
                <div className="sp-field"><label>Title</label><input name={`section${num}_title`} value={form[`section${num}_title`]} onChange={handleChange} placeholder={`Section ${num} title`} /></div>
                <div className="sp-field"><label>Paragraph 1</label><textarea name={`section${num}_text1`} value={form[`section${num}_text1`]} onChange={handleChange} rows="3" placeholder="First paragraph" /></div>
                <div className="sp-field"><label>Paragraph 2</label><textarea name={`section${num}_text2`} value={form[`section${num}_text2`]} onChange={handleChange} rows="3" placeholder="Second paragraph" /></div>
                <ImageField label={`Section ${num} Image`} name={`section${num}_image`} value={form[`section${num}_image`]} onChange={handleChange} />
              </div>
            ))}
          </div>
        )}

        {/* FEATURES TAB */}
        {activeTab === "features" && (
          <div className="sp-grid">
            <div className="sp-card sp-card-full">
              <div className="sp-card-header"><FaListUl /><h3>Features Section Title</h3></div>
              <div className="sp-field"><label>Section Heading</label><input name="features_title" value={form.features_title} onChange={handleChange} placeholder="e.g. Our Design Services" /></div>
            </div>
            {[1, 2, 3, 4].map((n) => (
              <div className="sp-card" key={n}>
                <div className="sp-card-header"><span className="sp-feature-badge">{n}</span><h3>Feature {n}</h3></div>
                <div className="sp-field"><label>Icon (emoji)</label><input name={`feature${n}_icon`} value={form[`feature${n}_icon`]} onChange={handleChange} placeholder="e.g. 🏠" /></div>
                <div className="sp-field"><label>Title</label><input name={`feature${n}_title`} value={form[`feature${n}_title`]} onChange={handleChange} placeholder={`Feature ${n} title`} /></div>
                <div className="sp-field"><label>Description</label><textarea name={`feature${n}_desc`} value={form[`feature${n}_desc`]} onChange={handleChange} rows="3" placeholder={`Feature ${n} description`} /></div>
              </div>
            ))}
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === "stats" && (
          <div className="sp-grid">
            <div className="sp-card sp-card-full">
              <div className="sp-card-header"><FaStar /><h3>Statistics</h3></div>
              <div className="sp-stats-grid">
                {[1, 2, 3].map((n) => (
                  <div className="sp-stat-group" key={n}>
                    <h4>Stat {n}</h4>
                    <div className="sp-field"><label>Value</label><input name={`stat${n}_value`} value={form[`stat${n}_value`]} onChange={handleChange} placeholder="e.g. 500+" /></div>
                    <div className="sp-field"><label>Label</label><input name={`stat${n}_label`} value={form[`stat${n}_label`]} onChange={handleChange} placeholder="e.g. Projects Completed" /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA TAB */}
        {activeTab === "cta" && (
          <div className="sp-grid">
            <div className="sp-card sp-card-full">
              <div className="sp-card-header"><FaArrowRight /><h3>Call to Action</h3></div>
              <div className="sp-field"><label>CTA Title</label><input name="cta_title" value={form.cta_title} onChange={handleChange} placeholder="e.g. Ready to Get Started?" /></div>
              <div className="sp-field"><label>CTA Text</label><textarea name="cta_text" value={form.cta_text} onChange={handleChange} rows="3" placeholder="CTA description text" /></div>
              <div className="sp-cta-row">
                <div className="sp-field"><label>Button Text</label><input name="cta_btn" value={form.cta_btn} onChange={handleChange} placeholder="e.g. Shop Now" /></div>
                <div className="sp-field"><label>Button Link</label><input name="cta_link" value={form.cta_link} onChange={handleChange} placeholder="e.g. /Shop-1" /></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SAVE BAR */}
      <div className="sp-save-bar">
        <span className={`sp-save-status ${saved ? "saved" : ""}`}>
          {saved ? <><FaCheck /> Saved</> : "Unsaved changes"}
        </span>
        <button className="sp-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? <FaSpinner className="sp-spinner-btn" /> : <><FaSave /> Save Changes</>}
        </button>
      </div>
    </div>
  );
};

export default StaticPagesAdmin;
