import express from "express";
import { adminLogin, registerAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

// admin login
router.post("/login", adminLogin);
router.post("/register", registerAdmin);

export default router;