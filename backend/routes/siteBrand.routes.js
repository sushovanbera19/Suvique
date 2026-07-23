import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  fetchActiveBrand,
  fetchAllBrands,
  createBrandCtrl,
  activateBrandCtrl,
  deleteBrandCtrl,
} from "../controllers/siteBrand.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/brand")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `brand-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error("Only images allowed"));
  },
});

const router = express.Router();

router.get("/", fetchActiveBrand);
router.get("/all", fetchAllBrands);
router.post("/", upload.single("logo"), createBrandCtrl);
router.put("/:id/activate", activateBrandCtrl);
router.delete("/:id", deleteBrandCtrl);

export default router;
