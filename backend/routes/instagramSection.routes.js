import express from "express";
import {
  fetchSection, updateSectionCtrl,
  fetchAllItems, fetchActiveItems,
  fetchFromInstagram, saveFetchedItems, addItem,
  toggleItem, reorderItem, deleteItemCtrl, clearAllItems,
} from "../controllers/instagramSection.controller.js";

const router = express.Router();

// Public: section + active items (client)
router.get("/", fetchActiveItems);

// Admin: section settings
router.get("/section", fetchSection);
router.put("/section", updateSectionCtrl);

// Admin: items
router.get("/items", fetchAllItems);
router.post("/items", addItem);
router.delete("/items", clearAllItems);

// Instagram fetch
router.post("/fetch", fetchFromInstagram);
router.post("/save", saveFetchedItems);

// Single item actions
router.put("/items/:id/toggle", toggleItem);
router.put("/items/:id/reorder", reorderItem);
router.delete("/items/:id", deleteItemCtrl);

export default router;
