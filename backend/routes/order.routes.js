import express from "express";

import { placeOrder, fetchOrders, fetchOrderDetails, fetchOrderStatus, deleteOrder, editOrder, fetchUserOrders, cancelUserOrder } from "../controllers/order.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
    "/place-order",
    verifyToken,
    placeOrder
);
router.get("/user/me", verifyToken, fetchUserOrders);
router.get("/", fetchOrders);

router.get("/:id/status", fetchOrderStatus);
router.get("/:id", fetchOrderDetails);
router.put("/:id", editOrder);
router.put("/:id/cancel", verifyToken, cancelUserOrder);
router.delete("/:id", deleteOrder);
export default router;
