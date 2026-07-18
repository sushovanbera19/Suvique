import { getAllBanners, getActiveBanners, createBanner, updateBanner, deleteBanner } from "../models/banner.model.js";

export const fetchAllBanners = async (req, res) => {
  try {
    const [rows] = await getAllBanners();
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const fetchActiveBanners = async (req, res) => {
  try {
    const [rows] = await getActiveBanners();
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const createBannerCtrl = async (req, res) => {
  try {
    const { title, subtitle, image, link, sort_order, status } = req.body;
    const [result] = await createBanner({ title, subtitle, image, link, sort_order, status });
    res.status(201).json({ success: true, message: "Banner created", id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const updateBannerCtrl = async (req, res) => {
  try {
    const { title, subtitle, image, link, sort_order, status } = req.body;
    await updateBanner(req.params.id, { title, subtitle, image, link, sort_order, status });
    res.json({ success: true, message: "Banner updated" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const deleteBannerCtrl = async (req, res) => {
  try {
    await deleteBanner(req.params.id);
    res.json({ success: true, message: "Banner deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
