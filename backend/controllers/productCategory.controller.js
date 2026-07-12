import { createProductCategory, getAllProductCategories, getProductCategoryById, updateProductCategory, deleteProductCategory, } from "../models/productCategory.model.js";
import XLSX from "xlsx";
import path from "path";
// Add Category
export const addCategory = async (req, res) => {
    try {

        const {
            categoryName,
            slug,
            description,
            status
        } = req.body;

        const image = req.file ? req.file.filename : null;

        await createProductCategory(
            categoryName,
            slug,
            description,
            image,
            status
        );

        res.status(201).json({
            success: true,
            message: "Category Created Successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const importCategories = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an Excel file",
            });
        }

        const workbook = XLSX.readFile(req.file.path);

        const sheetName = workbook.SheetNames[0];

        const rows = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName]
        );

        for (const row of rows) {
            await createProductCategory(
                row["Category Name"],
                row["Slug"],
                row["Description"],
                row["Image"] || null,
                row["Status"]
            );
        }

        res.status(200).json({
            success: true,
            message: "Categories Imported Successfully",
            total: rows.length,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get All Categories
export const getCategories = async (req, res) => {
    try {
        const [rows] = await getAllProductCategories();

        res.status(200).json({
            success: true,
            categories: rows,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Category By ID
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await getProductCategoryById(id);

        res.status(200).json({
            success: true,
            category: rows[0],
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            categoryName,
            slug,
            description,
            status,
        } = req.body;

        const image = req.file ? req.file.filename : (req.body.image || null);

        await updateProductCategory(
            id,
            categoryName,
            slug,
            description,
            image,
            status
        );

        res.status(200).json({
            success: true,
            message: "Category Updated Successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        await deleteProductCategory(id);

        res.status(200).json({
            success: true,
            message: "Category Deleted Successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};