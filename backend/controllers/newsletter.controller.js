import {
  subscribeEmail,
  findSubscriber,
  reactivateSubscriber,
  getAllSubscribers,
  unsubscribeEmail,
} from "../models/newsletter.model.js";

// Subscribe
export const subscribe = (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email",
    });
  }

  findSubscriber(email, (err, existing) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (existing.length > 0) {
      if (existing[0].status === "active") {
        return res.status(409).json({
          success: false,
          message: "This email is already subscribed",
        });
      }

      // Reactivate if previously unsubscribed
      reactivateSubscriber(email, (err2) => {
        if (err2) {
          return res.status(500).json({
            success: false,
            message: "Failed to reactivate subscription",
          });
        }

        return res.json({
          success: true,
          message: "Welcome back! You've been resubscribed successfully",
        });
      });
      return;
    }

    // New subscriber
    subscribeEmail(email, (err2) => {
      if (err2) {
        return res.status(500).json({
          success: false,
          message: "Failed to subscribe",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Subscribed successfully! Welcome aboard",
      });
    });
  });
};

// Unsubscribe
export const unsubscribe = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  unsubscribeEmail(email, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    return res.json({
      success: true,
      message: "Unsubscribed successfully",
    });
  });
};

// Get all subscribers (admin)
export const getSubscribers = (req, res) => {
  getAllSubscribers((err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    return res.json({
      success: true,
      data: result,
      total: result.length,
    });
  });
};
