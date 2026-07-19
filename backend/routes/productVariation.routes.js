import express from "express";

import { addVariation, getVariations, getVariation, editVariation, removeVariation, bulkImportVariations } from "../controllers/productVariation.controller.js";

const router = express.Router();

router.post("/add", addVariation);
router.post("/bulk-import", bulkImportVariations);
router.get("/all", getVariations);
router.get("/:id", getVariation);
router.put("/update/:id", editVariation);
router.delete("/delete/:id", removeVariation);

export default router;