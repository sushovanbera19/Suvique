import {
  getAllBlogs,
  getPublishedBlogs,
  getBlogById,
  getBlogBySlug,
  getBlogBySlugFallback,
  createBlog,
  updateBlog,
  deleteBlog,
  bulkDeleteBlogs,
} from "../models/blog.model.js";

// GET all blogs (admin)
export const fetchAllBlogs = async (req, res) => {
  try {
    const [rows] = await getAllBlogs();
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET published blogs (client)
export const fetchPublishedBlogs = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const [rows] = await getPublishedBlogs(lang);
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET blog by ID
export const fetchBlogById = async (req, res) => {
  try {
    const [rows] = await getBlogById(req.params.id);
    if (rows.length === 0) {
      return res.json({ success: false, message: "Blog not found" });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET blog by slug
export const fetchBlogBySlug = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const slug = req.params.slug;
    let [rows] = await getBlogBySlug(slug, lang);

    if (rows.length === 0) {
      [rows] = await getBlogBySlugFallback(slug);
    }

    if (rows.length === 0) {
      return res.json({ success: false, message: "Blog not found" });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST create blog
export const addBlog = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.json({ success: false, message: "Title is required" });
    }

    // Auto-generate slug from title
    if (!req.body.slug) {
      req.body.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }

    req.body.lang = req.body.lang || 'en';
    const [result] = await createBlog(req.body);
    return res.json({
      success: true,
      message: "Blog created successfully",
      id: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT update blog
export const editBlog = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.json({ success: false, message: "Title is required" });
    }
    await updateBlog(req.params.id, req.body);
    return res.json({ success: true, message: "Blog updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE blog
export const removeBlog = async (req, res) => {
  try {
    await deleteBlog(req.params.id);
    return res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// BULK DELETE blogs
export const bulkRemoveBlogs = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.json({ success: false, message: "No blog IDs provided" });
    }
    await bulkDeleteBlogs(ids);
    return res.json({ success: true, message: `${ids.length} blog(s) deleted successfully` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
