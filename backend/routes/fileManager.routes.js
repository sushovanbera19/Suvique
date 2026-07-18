import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.query.folder || "";
    const dest = path.join(UPLOADS_DIR, folder);
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Recursively get all files
const getAllFiles = (dir, baseDir = dir) => {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath, baseDir));
    } else {
      const stat = fs.statSync(fullPath);
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      results.push({
        name: entry.name,
        path: `/uploads/${relativePath}`,
        size: stat.size,
        modified: stat.mtime,
        created: stat.birthtime,
        type: path.extname(entry.name).toLowerCase().slice(1),
      });
    }
  }
  return results;
};

// Get subfolders
const getFolders = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
};

// GET /api/files — list all files
router.get("/", (req, res) => {
  try {
    const files = getAllFiles(UPLOADS_DIR);
    const folders = getFolders(UPLOADS_DIR);
    const sorted = files.sort((a, b) => new Date(b.modified) - new Date(a.modified));
    res.json({
      success: true,
      data: {
        files: sorted,
        total: sorted.length,
        folders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/files/recent?limit=20 — recent files
router.get("/recent", (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const files = getAllFiles(UPLOADS_DIR);
    const sorted = files.sort((a, b) => new Date(b.modified) - new Date(a.modified));
    res.json({ success: true, data: sorted.slice(0, limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/files/stats — storage stats
router.get("/stats", (req, res) => {
  try {
    const files = getAllFiles(UPLOADS_DIR);
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const images = files.filter((f) => ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(f.type));
    const videos = files.filter((f) => ["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv"].includes(f.type));
    const docs = files.filter((f) => ["pdf", "doc", "docx", "txt", "csv"].includes(f.type));
    res.json({
      success: true,
      data: {
        totalFiles: files.length,
        totalSize,
        images: images.length,
        videos: videos.length,
        documents: docs.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/files/upload — upload file
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  const folder = req.query.folder || "";
  const url = `/uploads/${folder ? folder + "/" : ""}${req.file.filename}`;
  res.json({ success: true, url, file: { name: req.file.filename, size: req.file.size, path: url } });
});

// DELETE /api/files/delete — delete file
router.delete("/delete", (req, res) => {
  try {
    const { filePath } = req.query;
    if (!filePath) return res.status(400).json({ success: false, message: "No file path" });

    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) return res.status(404).json({ success: false, message: "File not found" });

    fs.unlinkSync(fullPath);
    res.json({ success: true, message: "File deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/files/delete-folder — delete folder and contents
router.delete("/delete-folder", (req, res) => {
  try {
    const { folderPath } = req.query;
    if (!folderPath) return res.status(400).json({ success: false, message: "No folder path" });

    const fullPath = path.join(process.cwd(), folderPath);
    if (!fs.existsSync(fullPath)) return res.status(404).json({ success: false, message: "Folder not found" });

    fs.rmSync(fullPath, { recursive: true, force: true });
    res.json({ success: true, message: "Folder deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
