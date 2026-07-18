import { Router } from "express";
import { fetchAllReviews, fetchActiveReviews, fetchReviewsByProduct, createReviewCtrl, updateReviewCtrl, deleteReviewCtrl } from "../controllers/review.controller.js";

const router = Router();
router.get("/", fetchAllReviews);
router.get("/active", fetchActiveReviews);
router.get("/product/:productId", fetchReviewsByProduct);
router.post("/", createReviewCtrl);
router.put("/:id", updateReviewCtrl);
router.delete("/:id", deleteReviewCtrl);

export default router;
