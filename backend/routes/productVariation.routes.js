import express from "express";

import { addVariation, getVariations, getVariation, editVariation, removeVariation, } from "../controllers/productVariation.controller.js";

const router = express.Router();

router.post("/add", addVariation);
router.get("/all", getVariations);
router.get("/:id", getVariation);
router.put("/update/:id", editVariation);
router.delete("/delete/:id", removeVariation);

export default router;