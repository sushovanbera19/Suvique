import express from "express";
import {
  createUser,
  loginUser,
  fetchUsers,
  deleteUserController,
  updateUserController,
  getUserProfile,
  getUserProfileImage,
  updateUserProfileController,
  updateUserProfileImage,
  getUserCoverImageCtrl,
  updateUserCoverImageCtrl,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/all-users", fetchUsers);

router.get("/profile", verifyToken, getUserProfile);
router.get("/profile/image/:id", getUserProfileImage);
router.put("/profile/update", verifyToken, updateUserProfileController);
router.put("/profile/image", verifyToken, (req, res, next) => {
  upload.single("profileImage")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ success: false, message: "File too large. Max 5MB." });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, updateUserProfileImage);

router.get("/profile/cover/:id", getUserCoverImageCtrl);
router.put("/profile/cover", verifyToken, (req, res, next) => {
  upload.single("coverPhoto")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ success: false, message: "File too large. Max 5MB." });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, updateUserCoverImageCtrl);

router.put("/:userId", updateUserController);
router.delete("/:userId", deleteUserController);

export default router;
