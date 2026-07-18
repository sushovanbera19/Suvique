import express from "express";
import { fetchProductInfo, fetchProductInfoById, createProductInfoCtrl, updateProductInfoCtrl, deleteProductInfoCtrl } from "../controllers/productInfo.controller.js";

const router = express.Router();

router.get("/product/:productId", fetchProductInfo);
router.get("/:id", fetchProductInfoById);
router.post("/", createProductInfoCtrl);
router.put("/:id", updateProductInfoCtrl);
router.delete("/:id", deleteProductInfoCtrl);

export default router;
