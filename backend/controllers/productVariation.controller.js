import { createVariation, getAllVariations, getVariationById, updateVariation, deleteVariation, bulkCreateVariations } from "../models/productVariation.model.js";

// Create
export const addVariation = async (req, res) => {
  try {
    const { color_code, size, status, } = req.body;
    await createVariation(color_code, size, status);

    res.status(201).json({
      success: true,
      message:
        "Variation Created Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All
export const getVariations = async (req, res) => {
  try {
    const [rows] =
      await getAllVariations();

    res.status(200).json({
      success: true,
      variations: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get By ID
export const getVariation = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] =
      await getVariationById(id);

    res.status(200).json({
      success: true,
      variation: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update
export const editVariation = async (req, res) => {
  try {
    const { id } = req.params;
    const { color_code, size, status, } = req.body;
    await updateVariation(id, color_code, size, status);

    res.status(200).json({
      success: true,
      message:
        "Variation Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete
export const removeVariation = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    await deleteVariation(id);

    res.status(200).json({
      success: true,
      message:
        "Variation Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Bulk Import
export const bulkImportVariations = async (req, res) => {
  try {
    const { variations } = req.body;

    if (!variations?.length) {
      return res.status(400).json({ success: false, message: "No variations provided" });
    }

    const rows = variations.map((v) => [
      v.color_code || "#000000",
      v.size || "M",
      v.status || "Active",
    ]);

    const result = await bulkCreateVariations(rows);

    res.status(200).json({
      success: true,
      message: `Imported ${result.inserted} variations (${result.skipped} duplicates skipped)`,
      inserted: result.inserted,
      skipped: result.skipped,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};