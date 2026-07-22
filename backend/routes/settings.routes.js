import { Router } from "express";
import { fetchAllSettings, fetchSettingsByGroup, saveSettings } from "../controllers/settingsController.js";

const router = Router();

router.get("/", fetchAllSettings);
router.get("/:group", fetchSettingsByGroup);
router.post("/", saveSettings);

export default router;
