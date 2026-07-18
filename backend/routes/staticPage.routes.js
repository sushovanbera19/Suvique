import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fetchAllPages, fetchPageBySlug, updatePage } from "../controllers/staticPage.controller.js";

const router = express.Router();

// Multer config
const uploadDir = path.join(process.cwd(), "uploads", "static-pages");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `sp-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype.split("/")[1]);
    cb(null, !!ok);
  },
});

// Upload single image
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  const url = `/uploads/static-pages/${req.file.filename}`;
  return res.json({ success: true, url });
});

// Upload multiple images
router.post("/upload-many", upload.array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: "No files uploaded" });
  }
  const urls = req.files.map((f) => `/uploads/static-pages/${f.filename}`);
  return res.json({ success: true, urls });
});

// Delete uploaded image
router.delete("/delete-image", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, message: "No URL" });

  const filePath = path.join(process.cwd(), url);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  return res.json({ success: true });
});

// CRUD
router.get("/", fetchAllPages);
router.get("/:slug", fetchPageBySlug);
router.put("/:slug", updatePage);

export default router;
