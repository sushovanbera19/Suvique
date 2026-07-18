import express from "express";
import {
  fetchAllContacts,
  fetchContactById,
  fetchContactsByStatus,
  createContact,
  updateStatus,
  removeContact,
  bulkRemoveContacts,
  fetchContactStats,
} from "../controllers/contact.controller.js";

const router = express.Router();

router.get("/", fetchAllContacts);
router.get("/stats", fetchContactStats);
router.get("/status/:status", fetchContactsByStatus);
router.get("/:id", fetchContactById);
router.post("/", createContact);
router.post("/bulk-delete", bulkRemoveContacts);
router.put("/:id/status", updateStatus);
router.delete("/:id", removeContact);

export default router;
