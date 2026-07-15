import express from "express";
import {
  subscribe,
  unsubscribe,
  getSubscribers,
} from "../controllers/newsletter.controller.js";

const router = express.Router();

// Public
router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

// Admin
router.get("/subscribers", getSubscribers);

export default router;
