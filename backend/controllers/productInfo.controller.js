import { getProductInfo, getProductInfoById, createProductInfo, updateProductInfo, deleteProductInfo } from "../models/productInfo.model.js";

export const fetchProductInfo = async (req, res) => {
  try {
    const info = await getProductInfo(req.params.productId);
    res.json({ success: true, data: info });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const fetchProductInfoById = async (req, res) => {
  try {
    const info = await getProductInfoById(req.params.id);
    if (!info) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: info });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createProductInfoCtrl = async (req, res) => {
  try {
    const { product_id, heading, content, info_type, sort_order } = req.body;
    if (!product_id || !heading) {
      return res.status(400).json({ success: false, message: "Product ID and heading are required" });
    }
    const result = await createProductInfo({ product_id, heading, content, info_type, sort_order });
    res.status(201).json({ success: true, message: "Info added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProductInfoCtrl = async (req, res) => {
  try {
    const { heading, content, info_type, sort_order } = req.body;
    await updateProductInfo(req.params.id, { heading, content, info_type, sort_order });
    res.json({ success: true, message: "Info updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProductInfoCtrl = async (req, res) => {
  try {
    await deleteProductInfo(req.params.id);
    res.json({ success: true, message: "Info deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
