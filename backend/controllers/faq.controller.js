import {
  getAllFaqs, getActiveFaqs, getFaqById,
  createFaq, updateFaq, deleteFaq, bulkDeleteFaqs,
} from "../models/faq.model.js";

export const fetchAllFaqs = async (req, res) => {
  try {
    const lang = req.query.lang || undefined;
    const [rows] = await getAllFaqs(lang);
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchActiveFaqs = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const [rows] = await getActiveFaqs(lang);
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchFaqById = async (req, res) => {
  try {
    const [rows] = await getFaqById(req.params.id);
    if (rows.length === 0) return res.json({ success: false, message: "FAQ not found" });
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addFaq = async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) return res.json({ success: false, message: "Question and answer are required" });
  try {
    const data = { ...req.body, lang: req.body.lang || 'en' };
    const [result] = await createFaq(data);
    return res.json({ success: true, message: "FAQ created", id: result.insertId });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const editFaq = async (req, res) => {
  try {
    await updateFaq(req.params.id, req.body);
    return res.json({ success: true, message: "FAQ updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFaq = async (req, res) => {
  try {
    await deleteFaq(req.params.id);
    return res.json({ success: true, message: "FAQ deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkRemoveFaqs = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !ids.length) return res.json({ success: false, message: "No IDs provided" });
    await bulkDeleteFaqs([ids]);
    return res.json({ success: true, message: "FAQs deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
