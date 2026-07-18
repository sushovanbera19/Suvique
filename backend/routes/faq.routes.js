import express from "express";
import {
  fetchAllFaqs, fetchActiveFaqs, fetchFaqById,
  addFaq, editFaq, removeFaq, bulkRemoveFaqs,
} from "../controllers/faq.controller.js";

const router = express.Router();

router.get("/", fetchAllFaqs);
router.get("/active", fetchActiveFaqs);
router.get("/:id", fetchFaqById);
router.post("/", addFaq);
router.post("/bulk-delete", bulkRemoveFaqs);
router.put("/:id", editFaq);
router.delete("/:id", removeFaq);

export default router;
