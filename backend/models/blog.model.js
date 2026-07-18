import db from "../config/db.js";

// Get all blogs
export const getAllBlogs = () => {
  const sql = "SELECT * FROM blogs ORDER BY created_at DESC";
  return db.promise().query(sql);
};

// Get published blogs (for client)
export const getPublishedBlogs = (lang) => {
  const sql = "SELECT * FROM blogs WHERE status = 'published' AND (lang = ? OR lang = 'en') ORDER BY created_at DESC";
  return db.promise().query(sql, [lang]);
};

// Get blog by ID
export const getBlogById = (id) => {
  const sql = "SELECT * FROM blogs WHERE id = ?";
  return db.promise().query(sql, [id]);
};

// Get blog by slug
export const getBlogBySlug = (slug, lang) => {
  const sql = "SELECT * FROM blogs WHERE slug = ? AND lang = ?";
  return db.promise().query(sql, [slug, lang]);
};

// Get blog by slug fallback
export const getBlogBySlugFallback = (slug) => {
  const sql = "SELECT * FROM blogs WHERE slug = ? AND lang = 'en'";
  return db.promise().query(sql, [slug]);
};

// Create blog
export const createBlog = (data) => {
  const sql = `INSERT INTO blogs (title, description, content, category, author, image, slug, status, tags, meta_title, meta_description, lang)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    data.title,
    data.description || "",
    data.content || "",
    data.category || "",
    data.author || "",
    data.image || "",
    data.slug || "",
    data.status || "draft",
    data.tags || "",
    data.meta_title || "",
    data.meta_description || "",
    data.lang || "en",
  ];
  return db.promise().query(sql, values);
};

// Update blog
export const updateBlog = (id, data) => {
  const sql = `UPDATE blogs SET title=?, description=?, content=?, category=?, author=?, image=?, slug=?, status=?, tags=?, meta_title=?, meta_description=? WHERE id=?`;
  const values = [
    data.title,
    data.description || "",
    data.content || "",
    data.category || "",
    data.author || "",
    data.image || "",
    data.slug || "",
    data.status || "draft",
    data.tags || "",
    data.meta_title || "",
    data.meta_description || "",
    id,
  ];
  return db.promise().query(sql, values);
};

// Delete blog
export const deleteBlog = (id) => {
  const sql = "DELETE FROM blogs WHERE id = ?";
  return db.promise().query(sql, [id]);
};

// Bulk delete blogs
export const bulkDeleteBlogs = (ids) => {
  const sql = `DELETE FROM blogs WHERE id IN (?)`;
  return db.promise().query(sql, [ids]);
};
