import express from "express";
import { fetchAboutPage, updateAboutPage } from "../controllers/about.controller.js";

const router = express.Router();

router.get("/", fetchAboutPage);
router.put("/", updateAboutPage);

export default router;
