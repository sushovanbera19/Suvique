import { getSiteBrand, updateSiteBrand } from "../models/siteBrand.model.js";

export const fetchSiteBrand = async (req, res) => {
  try {
    const brand = await getSiteBrand();
    res.json({ success: true, data: brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSiteBrandCtrl = async (req, res) => {
  try {
    const { brand_name } = req.body;
    const logoPath = req.file ? `/uploads/brand/${req.file.filename}` : undefined;
    await updateSiteBrand(logoPath, brand_name);
    const brand = await getSiteBrand();
    res.json({ success: true, data: brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
