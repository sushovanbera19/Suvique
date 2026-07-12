import express from "express";
import { createUser, loginUser, fetchUsers, deleteUserController, updateUserController} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/all-users", fetchUsers);
router.put("/:userId", updateUserController);
router.delete("/:userId", deleteUserController);

export default router;