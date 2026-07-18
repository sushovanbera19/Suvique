import { useState, useEffect, useRef } from "react";
import { FaImage, FaFilm, FaUpload, FaTimes, FaSearch, FaSpinner, FaCheck } from "react-icons/fa";
import "../../assets/style/FilePicker.css";

const API = "http://localhost:5000";

const IMAGE_TYPES = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
const VIDEO_TYPES = ["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv"];

const FilePicker = ({ value, onChange, type = "image", label, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const allowedTypes = type === "video" ? VIDEO_TYPES : IMAGE_TYPES;
  const accept = type === "video" ? "video/*" : "image/*";
  const icon = type === "video" ? <FaFilm /> : <FaImage />;

  useEffect(() => {
    if (open) fetchFiles();
  }, [open]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/files`);
      const data = await res.json();
      if (data.success) setFiles(data.data.files);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API}/api/files/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        onChange(data.url);
        setOpen(false);
      }
    } catch (err) { console.log(err); }
    finally { setUploading(false); }
  };

  const filtered = files.filter((f) => {
    if (!allowedTypes.includes(f.type)) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div className="fp-field" onClick={() => setOpen(true)}>
        {value ? (
          <div className="fp-field-selected">
            {type === "image" ? (
              <img src={value.startsWith("/") ? value : `/images/${value}`} alt="" className="fp-field-thumb" onError={(e) => e.target.style.display = "none"} />
            ) : (
              <div className="fp-field-video-icon"><FaFilm /></div>
            )}
            <span className="fp-field-path">{value.split("/").pop()}</span>
            <button className="fp-field-clear" onClick={(e) => { e.stopPropagation(); onChange(""); }}><FaTimes /></button>
          </div>
        ) : (
          <div className="fp-field-empty">
            {icon}
            <span>{placeholder || "Click to select file"}</span>
          </div>
        )}
      </div>

      {open && (
        <div className="fp-overlay" onClick={() => setOpen(false)}>
          <div className="fp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fp-modal-header">
              <h3>{icon} Select {type === "video" ? "Video" : "Image"}</h3>
              <button className="fp-close" onClick={() => setOpen(false)}><FaTimes /></button>
            </div>
            <div className="fp-modal-toolbar">
              <div className="fp-search">
                <FaSearch />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." />
              </div>
              <label className="fp-upload-btn">
                <FaUpload /> Upload New
                <input type="file" accept={accept} onChange={handleUpload} hidden />
              </label>
            </div>
            <div className="fp-modal-body">
              {loading ? (
                <div className="fp-loading"><FaSpinner className="fa-spin" /> Loading files...</div>
              ) : filtered.length === 0 ? (
                <div className="fp-empty">No {type === "video" ? "video" : "image"} files found</div>
              ) : (
                <div className="fp-grid">
                  {filtered.map((f) => (
                    <div key={f.path} className={`fp-card ${value === f.path ? "fp-card-selected" : ""}`} onClick={() => { onChange(f.path); setOpen(false); }}>
                      {IMAGE_TYPES.includes(f.type) ? (
                        <img src={`http://localhost:5000${f.path}`} alt={f.name} className="fp-card-img" />
                      ) : (
                        <div className="fp-card-video"><FaFilm /></div>
                      )}
                      <div className="fp-card-name" title={f.name}>{f.name}</div>
                      {value === f.path && <div className="fp-card-check"><FaCheck /></div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="fp-modal-footer">
              <span className="fp-count">{filtered.length} file(s)</span>
              <button className="fp-cancel-btn" onClick={() => setOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilePicker;
