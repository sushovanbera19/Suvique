import { Router } from "express";
import { fetchAllBanners, fetchActiveBanners, createBannerCtrl, updateBannerCtrl, deleteBannerCtrl } from "../controllers/banner.controller.js";

const router = Router();

router.get("/", fetchAllBanners);
router.get("/active", fetchActiveBanners);
router.post("/", createBannerCtrl);
router.put("/:id", updateBannerCtrl);
router.delete("/:id", deleteBannerCtrl);

export default router;
