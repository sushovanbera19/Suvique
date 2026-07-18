import { Router } from "express";
import { fetchAllVideos, fetchActiveVideos, createVideoCtrl, updateVideoCtrl, deleteVideoCtrl } from "../controllers/video.controller.js";

const router = Router();

router.get("/", fetchAllVideos);
router.get("/active", fetchActiveVideos);
router.post("/", createVideoCtrl);
router.put("/:id", updateVideoCtrl);
router.delete("/:id", deleteVideoCtrl);

export default router;
