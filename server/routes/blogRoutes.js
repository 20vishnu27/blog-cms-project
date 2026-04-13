import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from "../controllers/blogController.js";

import {
  addComment,
  getComments,
  deleteComment,
} from "../controllers/blogController.js";

import { protect , adminOnly} from "../middleware/auth.js";
import { likeBlog, unlikeBlog } from "../controllers/blogController.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.get("/:id/comments", getComments);

// PROTECTED ROUTES
router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);
router.put("/:id/like", protect, likeBlog);
router.put("/:id/unlike", protect, unlikeBlog);
router.post("/:id/comment", protect, addComment);
router.delete("/:id/comment/:commentId", protect, deleteComment);
router.delete("/admin/blog/:id", protect, adminOnly, deleteBlog);

export default router;