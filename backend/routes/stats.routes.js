import { Router } from "express";
import { getOverviewStats, getAnalyticsStats } from "../controllers/statsController.js";

const router = Router();

router.get("/overview", getOverviewStats);
router.get("/analytics", getAnalyticsStats);

export default router;
