import {createSubCategory,getAllSubCategories, getSubCategoryById, updateSubCategory,deleteSubCategory,} from "../models/productSubCategory.model.js";

// CREATE
export const addSubCategory = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      category_id,
      subcategory_name,
      slug,
      description,
      status
    } = req.body;

    const image = req.file ? req.file.filename : null;

    await createSubCategory({
      category_id,
      subcategory_name,
      slug,
      description,
      image,
      status,
    });

    res.json({
      success: true,
      message: "Sub Category Created",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL
export const getSubCategories = async (req, res) => {
  try {
    const [rows] = await getAllSubCategories();

    res.json({
      success: true,
      subcategories: rows,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// GET BY ID
export const getSubCategory = async (req, res) => {
  try {
    const [rows] = await getSubCategoryById(req.params.id);

    res.json({
      success: true,
      subcategory: rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// UPDATE
export const editSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, subcategory_name, slug, description, status } = req.body;

    const image = req.file ? req.file.filename : (req.body.image || null);

    await updateSubCategory(id, {
      category_id,
      subcategory_name,
      slug,
      description,
      image,
      status,
    });

    res.json({
      success: true,
      message: "Updated Successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
export const removeSubCategory = async (req, res) => {
  try {
    await deleteSubCategory(req.params.id);

    res.json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};