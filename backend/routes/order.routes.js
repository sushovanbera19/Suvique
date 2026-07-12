import express from "express";

import { placeOrder, fetchOrders, fetchOrderDetails, deleteOrder, editOrder } from "../controllers/order.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
    "/place-order",
    verifyToken,
    placeOrder
);
router.get("/", fetchOrders);

router.get("/:id", fetchOrderDetails);
router.put("/:id", editOrder);
router.delete("/:id", deleteOrder);
export default router;