import express from "express";
import { fetchAllShowrooms, fetchActiveShowrooms, fetchShowroomById, createShowroomCtrl, updateShowroomCtrl, deleteShowroomCtrl, bulkDeleteShowroomsCtrl } from "../controllers/showroom.controller.js";

const router = express.Router();

router.get("/", fetchAllShowrooms);
router.get("/active", fetchActiveShowrooms);
router.get("/:id", fetchShowroomById);
router.post("/", createShowroomCtrl);
router.put("/:id", updateShowroomCtrl);
router.delete("/:id", deleteShowroomCtrl);
router.post("/bulk-delete", bulkDeleteShowroomsCtrl);

export default router;
