import db from "../config/db.js";

// Create Category
export const createProductCategory = (categoryName, slug, description, image, status) => {
    const sql = ` INSERT INTO product_category(category_name, slug, description, image, status) VALUES (?, ?, ?, ?, ?)`;
    return db.promise().query(sql, [categoryName, slug, description, image, status,]);
};

// Get All Categories
export const getAllProductCategories = () => {
    const sql = ` SELECT * FROM product_category ORDER BY category_id DESC `;
    return db.promise().query(sql);
};

// Get Category By ID
export const getProductCategoryById = (id) => {
    const sql = ` SELECT * FROM product_category WHERE category_id = ? `;
    return db.promise().query(sql, [id]);
};

// Update Category
export const updateProductCategory = (id, categoryName, slug, description, image, status) => {
    const sql = `UPDATE product_category SET category_name = ?,  slug = ?, description = ?, image = ?, status = ? WHERE category_id = ?`;
    return db.promise().query(sql, [categoryName, slug, description, image, status, id,]);
};

// Delete Category
export const deleteProductCategory = (id) => {
    const sql = ` DELETE FROM product_category  WHERE category_id = ?`;
    return db.promise().query(sql, [id]);
};