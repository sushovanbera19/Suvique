import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  fetchSection, updateSectionCtrl,
  fetchAllItems, fetchActiveItems,
  createItemCtrl, updateItemCtrl, deleteItemCtrl,
} from "../controllers/instagramSection.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/instagram")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `insta-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error("Only images allowed"));
  },
});

const router = express.Router();

// Public: section + active items (for client)
router.get("/", fetchActiveItems);

// Admin: section settings
router.get("/section", fetchSection);
router.put("/section", updateSectionCtrl);

// Admin: items CRUD
router.get("/items", fetchAllItems);
router.post("/items", upload.single("image"), createItemCtrl);
router.put("/items/:id", upload.single("image"), updateItemCtrl);
router.delete("/items/:id", deleteItemCtrl);

export default router;
