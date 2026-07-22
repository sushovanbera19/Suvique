import express from "express";
import {
  fetchAllNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllRead,
  removeNotification,
  addNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", fetchAllNotifications);
router.get("/unread-count", fetchUnreadCount);
router.post("/", addNotification);
router.put("/read-all", markAllRead);
router.put("/:id/read", markNotificationRead);
router.delete("/:id", removeNotification);

export default router;
