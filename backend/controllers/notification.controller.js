import {
  getAllNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
} from "../models/notification.model.js";

export const fetchAllNotifications = async (req, res) => {
  try {
    const notifications = await getAllNotifications();
    const unreadCount = await getUnreadCount();
    res.json({ success: true, data: notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchUnreadCount = async (req, res) => {
  try {
    const count = await getUnreadCount();
    res.json({ success: true, unreadCount: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    await markAsRead(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllRead = async (req, res) => {
  try {
    await markAllAsRead();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeNotification = async (req, res) => {
  try {
    await deleteNotification(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addNotification = async (req, res) => {
  try {
    const { type, title, description, link } = req.body;
    if (!title) return res.json({ success: false, message: "Title is required" });
    const result = await createNotification({ type, title, description, link });
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
