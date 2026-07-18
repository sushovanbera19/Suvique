import db from "../config/db.js";

export const getAllFaqs = (lang) => {
  let sql = "SELECT * FROM faqs";
  const params = [];
  if (lang) {
    sql += " WHERE lang = ?";
    params.push(lang);
  }
  sql += " ORDER BY sort_order ASC, created_at DESC";
  return db.promise().query(sql, params);
};

export const getActiveFaqs = (lang) => {
  const sql = "SELECT * FROM faqs WHERE status = 'active' AND (lang = ? OR lang = 'en') ORDER BY sort_order ASC";
  return db.promise().query(sql, [lang]);
};

export const getFaqById = (id) => {
  const sql = "SELECT * FROM faqs WHERE id = ?";
  return db.promise().query(sql, [id]);
};

export const createFaq = (data) => {
  const sql = "INSERT INTO faqs (question, answer, category, sort_order, status, lang) VALUES (?, ?, ?, ?, ?, ?)";
  return db.promise().query(sql, [
    data.question,
    data.answer,
    data.category || "general",
    data.sort_order || 0,
    data.status || "active",
    data.lang || "en",
  ]);
};

export const updateFaq = (id, data) => {
  const sql = "UPDATE faqs SET question=?, answer=?, category=?, sort_order=?, status=? WHERE id=?";
  return db.promise().query(sql, [
    data.question,
    data.answer,
    data.category || "general",
    data.sort_order || 0,
    data.status || "active",
    id,
  ]);
};

export const deleteFaq = (id) => {
  const sql = "DELETE FROM faqs WHERE id = ?";
  return db.promise().query(sql, [id]);
};

export const bulkDeleteFaqs = (ids) => {
  const sql = "DELETE FROM faqs WHERE id IN (?)";
  return db.promise().query(sql, [ids]);
};
