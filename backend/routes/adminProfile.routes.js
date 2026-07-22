import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { fetchProfile, updateProfile, uploadAvatar, uploadCoverPhoto, changePassword } from "../controllers/adminProfile.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/avatars")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `admin-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error("Only images allowed"));
  },
});

const router = express.Router();

router.get("/profile", fetchProfile);
router.put("/profile", updateProfile);
router.post("/avatar", upload.single("avatar"), uploadAvatar);
router.post("/cover-photo", upload.single("cover_photo"), uploadCoverPhoto);
router.put("/change-password", changePassword);

export default router;
