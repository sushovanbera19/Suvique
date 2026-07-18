import { useState, useEffect, useRef } from "react";
import Breadcrumb from "../common/Breadcrumb";
import "../../assets/style/FileManager.css";
import {
  FaFolder, FaFileImage, FaFilePdf, FaFileAlt, FaFile,
  FaTrash, FaUpload, FaSpinner, FaCheck, FaSearch,
  FaTh, FaList, FaTimes, FaDownload, FaEye,
  FaHdd, FaFolderOpen, FaImage, FaCalendarAlt, FaArrowUp, FaFilm
} from "react-icons/fa";

const API = "http://localhost:5000";

const FILE_ICONS = {
  jpg: FaFileImage, jpeg: FaFileImage, png: FaFileImage,
  gif: FaFileImage, webp: FaFileImage, svg: FaFileImage,
  pdf: FaFilePdf, doc: FaFileAlt, docx: FaFileAlt,
  txt: FaFileAlt, csv: FaFileAlt,
  mp4: FaFilm, webm: FaFilm, mov: FaFilm,
  avi: FaFilm, mkv: FaFilm, flv: FaFilm,
  default: FaFile,
};

const IMAGE_TYPES = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
const VIDEO_TYPES = ["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv"];

const formatSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const FileManager = ({ recentOnly = false }) => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentFolder, setCurrentFolder] = useState("");
  const fileRef = useRef(null);

  useEffect(() => { fetchFiles(); fetchStats(); }, []);

  const fetchFiles = async () => {
    try {
      const url = recentOnly ? `${API}/api/files/recent?limit=20` : `${API}/api/files`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        if (recentOnly) {
          setFiles(data.data);
        } else {
          setFiles(data.data.files);
          setFolders(data.data.folders);
        }
      }
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/api/files/stats`);
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) { console.log(err); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const url = currentFolder ? `?folder=${currentFolder}` : "";
      const res = await fetch(`${API}/api/files/upload${url}`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        fetchFiles();
        fetchStats();
      }
    } catch (err) { console.log(err); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const handleDelete = async (filePath) => {
    try {
      const res = await fetch(`${API}/api/files/delete?filePath=${encodeURIComponent(filePath)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setDeleteConfirm(null);
        setPreviewFile(null);
        fetchFiles();
        fetchStats();
      }
    } catch (err) { console.log(err); }
  };

  const filtered = files.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchFolder = currentFolder ? f.path.includes(`/${currentFolder}/`) : true;
    return matchSearch && matchFolder;
  });

  const getFileIcon = (type) => {
    const Icon = FILE_ICONS[type] || FILE_ICONS.default;
    return <Icon />;
  };

  const isImage = (type) => IMAGE_TYPES.includes(type);
  const isVideo = (type) => VIDEO_TYPES.includes(type);

  if (loading) {
    return (
      <div className="content">
        <div className="page-top">
          <h1 className="page-title">{recentOnly ? "Recent Files" : "File Manager"}</h1>
          <Breadcrumb />
        </div>
        <div className="fm-loading"><FaSpinner className="fm-spinner" /><p>Loading files...</p></div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-top">
        <h1 className="page-title">{recentOnly ? "Recent Files" : "File Manager"}</h1>
        <Breadcrumb />
      </div>

      {/* HERO */}
      <div className="fm-hero">
        <div className="fm-hero-overlay">
          <h2>{recentOnly ? "Recently Uploaded Files" : "All Files & Uploads"}</h2>
          <p>Manage, upload, preview and delete files from your server</p>
        </div>
      </div>

      {/* STATS */}
      {stats && (
        <div className="fm-stats-row">
          <div className="fm-stat-card fm-stat-blue">
            <div className="fm-stat-icon"><FaFolderOpen /></div>
            <div className="fm-stat-info">
              <span className="fm-stat-value">{stats.totalFiles}</span>
              <span className="fm-stat-label">Total Files</span>
            </div>
          </div>
          <div className="fm-stat-card fm-stat-green">
            <div className="fm-stat-icon"><FaHdd /></div>
            <div className="fm-stat-info">
              <span className="fm-stat-value">{formatSize(stats.totalSize)}</span>
              <span className="fm-stat-label">Storage Used</span>
            </div>
          </div>
          <div className="fm-stat-card fm-stat-purple">
            <div className="fm-stat-icon"><FaImage /></div>
            <div className="fm-stat-info">
              <span className="fm-stat-value">{stats.images}</span>
              <span className="fm-stat-label">Images</span>
            </div>
          </div>
          <div className="fm-stat-card fm-stat-red">
            <div className="fm-stat-icon"><FaFilm /></div>
            <div className="fm-stat-info">
              <span className="fm-stat-value">{stats.videos || 0}</span>
              <span className="fm-stat-label">Videos</span>
            </div>
          </div>
        </div>
      )}

      {/* TOOLBAR */}
      <div className="fm-toolbar">
        <div className="fm-search-wrap">
          <FaSearch className="fm-search-icon" />
          <input type="text" placeholder="Search files..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button className="fm-search-clear" onClick={() => setSearch("")}><FaTimes /></button>}
        </div>

        <div className="fm-toolbar-actions">
          <div className="fm-view-toggle">
            <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}><FaTh /></button>
            <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}><FaList /></button>
          </div>

          <button className="fm-upload-btn" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <FaSpinner className="fm-spinner-btn" /> : <><FaArrowUp /> Upload</>}
          </button>
          <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleUpload} />
        </div>
      </div>

      {/* FOLDERS */}
      {!recentOnly && folders.length > 0 && (
        <div className="fm-folders">
          <button className={`fm-folder ${currentFolder === "" ? "active" : ""}`} onClick={() => setCurrentFolder("")}>
            <FaFolder /> All Files
          </button>
          {folders.map((f) => (
            <button key={f} className={`fm-folder ${currentFolder === f ? "active" : ""}`} onClick={() => setCurrentFolder(f)}>
              <FaFolder /> {f}
            </button>
          ))}
        </div>
      )}

      {/* FILE GRID/LIST */}
      {filtered.length === 0 ? (
        <div className="fm-empty">
          <FaFolder />
          <p>No files found</p>
        </div>
      ) : view === "grid" ? (
        <div className="fm-grid">
          {filtered.map((file, i) => (
            <div className="fm-card" key={i} onClick={() => setPreviewFile(file)}>
              <div className="fm-card-thumb">
                {isImage(file.type) ? (
                  <img src={`${API}${file.path}`} alt={file.name} />
                ) : isVideo(file.type) ? (
                  <video src={`${API}${file.path}`} muted className="fm-card-video" />
                ) : (
                  <div className="fm-card-icon">{getFileIcon(file.type)}</div>
                )}
              </div>
              <div className="fm-card-info">
                <span className="fm-card-name" title={file.name}>{file.name}</span>
                <span className="fm-card-meta">{formatSize(file.size)} · {formatDate(file.modified)}</span>
              </div>
              <button className="fm-card-delete" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(file); }}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="fm-list">
          <div className="fm-list-header">
            <span className="fm-list-col-name">Name</span>
            <span className="fm-list-col-size">Size</span>
            <span className="fm-list-col-date">Modified</span>
            <span className="fm-list-col-type">Type</span>
            <span className="fm-list-col-actions">Actions</span>
          </div>
          {filtered.map((file, i) => (
            <div className="fm-list-row" key={i} onClick={() => setPreviewFile(file)}>
              <span className="fm-list-col-name">
                {isImage(file.type) ? <FaFileImage className="fm-list-icon img" /> : isVideo(file.type) ? <FaFilm className="fm-list-icon video" /> : <FaFile className="fm-list-icon" />}
                {file.name}
              </span>
              <span className="fm-list-col-size">{formatSize(file.size)}</span>
              <span className="fm-list-col-date">{formatDate(file.modified)}</span>
              <span className="fm-list-col-type"><span className="fm-type-badge">{file.type}</span></span>
              <span className="fm-list-col-actions">
                <button onClick={(e) => { e.stopPropagation(); setPreviewFile(file); }}><FaEye /></button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(file); }}><FaTrash /></button>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewFile && (
        <div className="fm-modal" onClick={() => setPreviewFile(null)}>
          <div className="fm-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="fm-modal-close" onClick={() => setPreviewFile(null)}><FaTimes /></button>
            <div className="fm-modal-preview">
              {isImage(previewFile.type) ? (
                <img src={`${API}${previewFile.path}`} alt={previewFile.name} />
              ) : isVideo(previewFile.type) ? (
                <video src={`${API}${previewFile.path}`} controls className="fm-modal-video" />
              ) : (
                <div className="fm-modal-icon">{getFileIcon(previewFile.type)}</div>
              )}
            </div>
            <div className="fm-modal-info">
              <h3>{previewFile.name}</h3>
              <div className="fm-modal-details">
                <span><strong>Size:</strong> {formatSize(previewFile.size)}</span>
                <span><strong>Type:</strong> {previewFile.type.toUpperCase()}</span>
                <span><strong>Modified:</strong> {formatDate(previewFile.modified)}</span>
                <span><strong>Path:</strong> {previewFile.path}</span>
              </div>
              <div className="fm-modal-actions">
                <a href={`${API}${previewFile.path}`} download className="fm-modal-download"><FaDownload /> Download</a>
                <button className="fm-modal-delete" onClick={() => setDeleteConfirm(previewFile)}><FaTrash /> Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div className="fm-modal" onClick={() => setDeleteConfirm(null)}>
          <div className="fm-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <FaTrash className="fm-confirm-icon" />
            <h3>Delete File?</h3>
            <p>{deleteConfirm.name}</p>
            <div className="fm-confirm-actions">
              <button className="fm-confirm-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="fm-confirm-delete" onClick={() => handleDelete(deleteConfirm.path)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* SAVE STATUS */}
      {saved && (
        <div className="fm-toast"><FaCheck /> File uploaded successfully</div>
      )}
    </div>
  );
};

export default FileManager;
