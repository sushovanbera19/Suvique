import express from "express";
import {
  fetchAllBlogs,
  fetchPublishedBlogs,
  fetchBlogById,
  fetchBlogBySlug,
  addBlog,
  editBlog,
  removeBlog,
  bulkRemoveBlogs,
} from "../controllers/blog.controller.js";

const router = express.Router();

router.get("/", fetchAllBlogs);
router.get("/published", fetchPublishedBlogs);
router.get("/slug/:slug", fetchBlogBySlug);
router.get("/:id", fetchBlogById);
router.post("/", addBlog);
router.post("/bulk-delete", bulkRemoveBlogs);
router.put("/:id", editBlog);
router.delete("/:id", removeBlog);

export default router;
