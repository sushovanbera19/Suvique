import { getAdminProfile, updateAdminProfile, updateAdminAvatar, updateAdminCoverPhoto, updateAdminPassword } from "../models/adminProfile.model.js";

export const fetchProfile = async (req, res) => {
  try {
    const email = req.query.email || req.body.email;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    const profile = await getAdminProfile(email);
    if (!profile) return res.status(404).json({ success: false, message: "Admin not found" });
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { email, name, phone, bio, role } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    await updateAdminProfile(email, { name, phone, bio, role });
    const profile = await getAdminProfile(email);
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await updateAdminAvatar(email, avatarUrl);
    res.json({ success: true, avatar: avatarUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadCoverPhoto = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const coverUrl = `/uploads/avatars/${req.file.filename}`;
    await updateAdminCoverPhoto(email, coverUrl);
    res.json({ success: true, cover_photo: coverUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const profile = await getAdminProfile(email);
    if (!profile) return res.status(404).json({ success: false, message: "Admin not found" });
    if (profile.password !== currentPassword) {
      return res.json({ success: false, message: "Current password is incorrect" });
    }
    await updateAdminPassword(email, newPassword);
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
