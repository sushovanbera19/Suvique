import db from "../config/db.js";

// CREATE
export const createSubCategory = (data) => {
    const sql = `INSERT INTO product_subcategory(category_id, subcategory_name, slug, description, image, status)VALUES (?, ?, ?, ?, ?, ?)`;
    return db.promise().query(sql, [data.category_id, data.subcategory_name, data.slug, data.description, data.image, data.status,]);
};

// GET ALL (JOIN CATEGORY NAME)
export const getAllSubCategories = () => {
    const sql = `SELECT  sc.*,  pc.category_name FROM product_subcategory sc JOIN product_category pc ON sc.category_id = pc.category_id`;
    return db.promise().query(sql);
};

// GET BY ID
export const getSubCategoryById = (id) => {
    const sql = `SELECT * FROM product_subcategory WHERE subcategory_id = ?`;
    return db.promise().query(sql, [id]);
};

// UPDATE
export const updateSubCategory = (id, data) => {
    if (data.image) {
        const sql = `UPDATE product_subcategory SET category_id = ?, subcategory_name = ?, slug = ?, description = ?, image = ?, status = ? WHERE subcategory_id = ?`;
        return db.promise().query(sql, [data.category_id, data.subcategory_name, data.slug, data.description, data.image, data.status, id]);
    } else {
        const sql = `UPDATE product_subcategory SET category_id = ?, subcategory_name = ?, slug = ?, description = ?, status = ? WHERE subcategory_id = ?`;
        return db.promise().query(sql, [data.category_id, data.subcategory_name, data.slug, data.description, data.status, id]);
    }
};

// DELETE
export const deleteSubCategory = (id) => {
    const sql = `DELETE FROM product_subcategory WHERE subcategory_id = ?`;
    return db.promise().query(sql, [id]);
};