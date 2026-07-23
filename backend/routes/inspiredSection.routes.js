import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  fetchAllSections,
  fetchActiveSections,
  fetchSectionById,
  createSection,
  updateSection,
  deleteSection,
  toggleSection,
} from "../controllers/inspiredSection.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/inspired")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `inspired-${Date.now()}${ext}`);
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

router.get("/", fetchActiveSections);
router.get("/all", fetchAllSections);
router.get("/:id", fetchSectionById);
router.post("/", upload.single("image"), createSection);
router.put("/:id", upload.single("image"), updateSection);
router.put("/:id/toggle", toggleSection);
router.delete("/:id", deleteSection);

export default router;
