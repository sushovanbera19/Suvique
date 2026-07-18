import { getAllReviews, getActiveReviews, getReviewsByProduct, createReview, updateReview, deleteReview } from "../models/review.model.js";

export const fetchAllReviews = async (req, res) => {
  try { const [rows] = await getAllReviews(); res.json({ success: true, data: rows }); }
  catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const fetchActiveReviews = async (req, res) => {
  try { const [rows] = await getActiveReviews(); res.json({ success: true, data: rows }); }
  catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const fetchReviewsByProduct = async (req, res) => {
  try {
    const [rows] = await getReviewsByProduct(req.params.productId);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const createReviewCtrl = async (req, res) => {
  try {
    const { name, role, text, rating, avatar, sort_order, status, product_id } = req.body;
    if (!name?.trim() || !text?.trim()) return res.status(400).json({ success: false, message: "Name and review text are required" });
    const [result] = await createReview({ name, role, text, rating, avatar, sort_order, status, product_id });
    res.status(201).json({ success: true, message: "Review created", id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const updateReviewCtrl = async (req, res) => {
  try {
    const { name, role, text, rating, avatar, sort_order, status, product_id } = req.body;
    await updateReview(req.params.id, { name, role, text, rating, avatar, sort_order, status, product_id });
    res.json({ success: true, message: "Review updated" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const deleteReviewCtrl = async (req, res) => {
  try { await deleteReview(req.params.id); res.json({ success: true, message: "Review deleted" }); }
  catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
