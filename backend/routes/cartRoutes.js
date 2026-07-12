import express from "express";
import { addToCart, fetchCart, deleteCart } from "../controllers/cart.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.get("/", verifyToken, fetchCart);
router.delete("/remove", verifyToken, deleteCart);

export default router;