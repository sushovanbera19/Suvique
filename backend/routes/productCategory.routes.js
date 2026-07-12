import express from "express";
import { upload } from "../config/multerConfig.js";

import {addCategory,getCategories, importCategories, getCategoryById, updateCategory, deleteCategory,} from "../controllers/productCategory.controller.js";

const router = express.Router();
router.post("/add", upload.single("image"), addCategory);
// Import Categories (Excel/Word/PDF)
router.post("/import", upload.single("file"), importCategories);
// router.post("/add", addCategory);
router.get("/all", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;