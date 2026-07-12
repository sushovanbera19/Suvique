import express from "express";
import {
  fetchAddresses,
  createAddress,
} from "../controllers/address.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, fetchAddresses);
router.post("/add", verifyToken, createAddress);

export default router;