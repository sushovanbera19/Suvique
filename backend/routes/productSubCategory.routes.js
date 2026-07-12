import express from "express";
import { addSubCategory, getSubCategories, getSubCategory, editSubCategory, removeSubCategory, } from "../controllers/productSubCategory.controller.js";
import { upload } from "../config/multerConfig.js";


const router = express.Router();

router.post("/create", upload.single("image"), addSubCategory);
router.get("/all", getSubCategories);
router.get("/:id", getSubCategory);
router.put("/:id", upload.single("image"), editSubCategory);
router.delete("/:id", removeSubCategory);

export default router;