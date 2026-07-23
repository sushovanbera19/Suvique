import { getActiveBrand, getAllBrands, createBrand, activateBrand, deleteBrand } from "../models/siteBrand.model.js";

export const fetchActiveBrand = async (req, res) => {
  try {
    const brand = await getActiveBrand();
    res.json({ success: true, data: brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchAllBrands = async (req, res) => {
  try {
    const brands = await getAllBrands();
    res.json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBrandCtrl = async (req, res) => {
  try {
    const { brand_name } = req.body;
    if (!brand_name || !brand_name.trim()) {
      return res.status(400).json({ success: false, message: "Brand name is required" });
    }
    const logoPath = req.file ? `/uploads/brand/${req.file.filename}` : null;
    await createBrand(logoPath, brand_name.trim());
    const brands = await getAllBrands();
    res.json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const activateBrandCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    await activateBrand(id);
    const brands = await getAllBrands();
    res.json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBrandCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteBrand(id);
    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: "Cannot delete active brand" });
    }
    const brands = await getAllBrands();
    res.json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
