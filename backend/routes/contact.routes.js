import express from "express";
import { createContact } from "../controllers/contact.controller.js";

const router = express.Router();

// store contact message
router.post("/", createContact);

export default router;