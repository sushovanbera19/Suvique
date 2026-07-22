import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { fetchAllVendors, fetchActiveVendors, fetchVendorById, addVendor, editVendor, toggleStatus, removeVendor, bulkRemoveVendors } from "../controllers/vendor.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/vendors")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    cb(null, extOk && mimeOk);
  },
});

const router = express.Router();

router.get("/", fetchAllVendors);
router.get("/active", fetchActiveVendors);
router.get("/:id", fetchVendorById);
router.post("/", upload.single("logo"), addVendor);
router.put("/:id", upload.single("logo"), editVendor);
router.put("/:id/status", toggleStatus);
router.delete("/:id", removeVendor);
router.post("/bulk-delete", bulkRemoveVendors);

export default router;
