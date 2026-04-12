import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from "../controllers/blogController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

// PROTECTED ROUTES
router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

export default router;