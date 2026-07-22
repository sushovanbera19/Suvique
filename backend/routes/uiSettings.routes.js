import { Router } from "express";
import { fetchAllUISettings, fetchUISettingsByType, saveUISettings, resetUISettings } from "../controllers/uiSettingsController.js";

const router = Router();

router.get("/", fetchAllUISettings);
router.get("/:type", fetchUISettingsByType);
router.post("/", saveUISettings);
router.post("/reset/:type", resetUISettings);

export default router;
