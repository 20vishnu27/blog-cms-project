import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getMyProfile,
  updateMyProfile
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();


// 👤 USER ROUTES (NO ADMIN CHECK)
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);


// 👑 ADMIN ROUTES (ONLY THESE USE adminOnly)
router.get("/", protect, adminOnly, getAllUsers);
router.get("/:id", protect, adminOnly, getUserById);
router.put("/:id/role", protect, adminOnly, updateUserRole);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;