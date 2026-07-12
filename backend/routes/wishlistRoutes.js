import express from "express";
import { addToWishlist, fetchWishlist, deleteWishlist, } from "../controllers/wishlist.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", verifyToken, addToWishlist);
router.get("/", verifyToken, fetchWishlist);
router.delete("/remove", verifyToken, deleteWishlist);

export default router;