import express from "express";
import { adminLogin } from "../controllers/admin.controller.js";

const router = express.Router();

// admin login
router.post("/login", adminLogin);

export default router;