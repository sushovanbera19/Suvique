import { getAllStaticPages, getStaticPageBySlug, getStaticPageBySlugFallback, upsertStaticPage } from "../models/staticPage.model.js";

export const fetchAllPages = async (req, res) => {
  try {
    const [rows] = await getAllStaticPages();
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchPageBySlug = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const { slug } = req.params;
    let [rows] = await getStaticPageBySlug(slug, lang);

    if (rows.length === 0) {
      [rows] = await getStaticPageBySlugFallback(slug);
    }

    if (rows.length === 0) {
      return res.json({ success: true, data: null });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePage = async (req, res) => {
  try {
    const lang = req.query.lang || req.body.lang || 'en';
    const { slug } = req.params;
    const data = req.body;
    await upsertStaticPage(slug, data, lang);
    return res.json({ success: true, message: "Page updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
