import db from "../config/db.js";

/* =========================
   CREATE PRODUCT
========================= */
export const createProduct = (data, callback) => {

  const sql = `
    INSERT INTO products (
      product_name,
      description,
      category_id,
      sub_category_id,
      base_price,
      sku,
      quantity,
      vat,
      width,
      height,
      weight,
      shipping_cost,
      tags,
      main_image,
      gallery_images
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      data.productName || "",
      data.description || "",
      data.category || null,
      data.subCategory || null,
      data.basePrice || 0,
      data.sku || "",
      data.quantity || 0,
      data.vat || 0,
      data.width || null,
      data.height || null,
      data.weight || null,
      data.shippingCost || 0,
      JSON.stringify(data.tags || []),
      data.mainImage || null,
      JSON.stringify(data.galleryImages || []),
    ],
    callback
  );
};

/* =========================
   GET ALL PRODUCTS
========================= */
export const getAllProducts = (callback) => {
  const sql = `SELECT * FROM products ORDER BY id DESC`;
  db.query(sql, callback);
};

/* =========================
   BULK CREATE PRODUCTS
========================= */
export const bulkCreateProducts = (products) => {
  return new Promise((resolve, reject) => {
    if (products.length === 0) return resolve([]);

    const sql = `
      INSERT INTO products (
        product_name, description, category_id, sub_category_id,
        base_price, sku, quantity, vat, width, height, weight,
        shipping_cost, tags, main_image, gallery_images
      ) VALUES ?
    `;

    const values = products.map((p) => [
      p.productName || "",
      p.description || "",
      p.category || null,
      p.subCategory || null,
      p.basePrice || 0,
      p.sku || "",
      p.quantity || 0,
      p.vat || 0,
      p.width || null,
      p.height || null,
      p.weight || null,
      p.shippingCost || 0,
      JSON.stringify(p.tags || []),
      null,
      JSON.stringify([]),
    ]);

    db.query(sql, [values], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

/* =========================
   GET PRODUCT BY ID
========================= */
export const getProductById = (id, callback) => {
  const sql = `
    SELECT p.*,
           pc.category_name,
           sc.subcategory_name
    FROM products p
    LEFT JOIN product_category pc ON p.category_id = pc.category_id
    LEFT JOIN product_subcategory sc ON p.sub_category_id = sc.subcategory_id
    WHERE p.id = ?
  `;
  db.query(sql, [id], callback);
};

/* =========================
   UPDATE PRODUCT
========================= */
export const updateProduct = (id, data, callback) => {
  const sql = ` UPDATE products SET  product_name = ?, description = ?,  category_id = ?,  sub_category_id = ?,  base_price = ?,  sku = ?,  quantity = ?,  vat = ?,  width = ?,  height = ?, weight = ?,  shipping_cost = ?,  tags = ?,  main_image = ?,  gallery_images = ?  WHERE id = ?`;

  db.query(
    sql,
    [
      data.productName || "",
      data.description || "",
      data.category || null,
      data.subCategory || null,
      data.basePrice || 0,
      data.sku || "",
      data.quantity || 0,
      data.vat || 0,
      data.width || null,
      data.height || null,
      data.weight || null,
      data.shippingCost || 0,
      JSON.stringify(data.tags || []),
      data.mainImage || null,
      JSON.stringify(data.galleryImages || []),
      id
    ],
    callback
  );
};

/* =========================
   DELETE PRODUCT
========================= */
export const deleteProduct = (id, callback) => {
  const sql = ` DELETE FROM products  WHERE id = ? `;
  db.query(sql, [id], callback);
};

/* =========================
   TOGGLE PRODUCT STATUS
========================= */
export const toggleProductStatus = (id, callback) => {
  const sql = `UPDATE products SET status = CASE WHEN status = 'active' THEN 'inactive' ELSE 'active' END WHERE id = ?`;
  db.query(sql, [id], callback);
};
/* =========================
   UPDATE OFFER SETTINGS
========================= */
export const updateOfferSettingsModel = (products, callback) => {
  if (!Array.isArray(products)) {
    return callback(new Error("Products must be array"));
  }

  if (products.length === 0) {
    return callback(null);
  }

  db.beginTransaction((err) => {
    if (err) return callback(err);

    const sql = `
      UPDATE products
      SET
        is_best_seller = ?,
        is_new_arrival = ?,
        is_on_sale = ?,
        sale_price = ?,
        sale_tag = ?
      WHERE id = ?
    `;

    let i = 0;

    const next = () => {
      if (i >= products.length) {
        return db.commit((err) => {
          if (err) return db.rollback(() => callback(err));
          callback(null);
        });
      }

      const p = products[i];

      const id = Number(p.id);
      if (!id) {
        i++;
        return next(); // skip invalid row instead of rollback
      }

      const values = [
        p.is_best_seller ? 1 : 0,
        p.is_new_arrival ? 1 : 0,
        p.is_on_sale ? 1 : 0,
        p.sale_price !== "" && p.sale_price != null ? Number(p.sale_price) : null,
        p.sale_tag || null,
        id,
      ];

      db.query(sql, values, (err) => {
        if (err) {
          return db.rollback(() => callback(err));
        }

        i++;
        next();
      });
    };

    next();
  });
};


// search 
export const searchProducts = (categoryId, keyword, callback) => {

  let sql = `
        SELECT
            p.*,
            c.category_name,
            s.subcategory_name
        FROM products p

        LEFT JOIN product_category c
            ON p.category_id = c.category_id

        LEFT JOIN product_subcategory s
            ON p.sub_category_id = s.subcategory_id

        WHERE 1=1
    `;

  const values = [];

  // Category Filter
  if (categoryId) {
    sql += ` AND p.category_id = ?`;
    values.push(categoryId);
  }

  // Keyword Filter
  if (keyword && keyword.trim() !== "") {

    sql += `
        AND(
            p.product_name LIKE ?
            OR p.description LIKE ?
            OR p.sku LIKE ?
            OR p.tags LIKE ?
            OR c.category_name LIKE ?
            OR s.subcategory_name LIKE ?
        )
        `;

    const search = `%${keyword}%`;

    values.push(
      search,
      search,
      search,
      search,
      search,
      search
    );
  }

  sql += ` ORDER BY p.id DESC`;

  db.query(sql, values, callback);

};


/* =========================
   SHOP PRODUCTS
========================= */

export const getShopProducts = (filters, callback) => {

  let sql = `
    SELECT
      p.*,
      c.category_name,
      s.subcategory_name
    FROM products p

    LEFT JOIN product_category c
      ON p.category_id = c.category_id

    LEFT JOIN product_subcategory s
      ON p.sub_category_id = s.subcategory_id

    LEFT JOIN product_variation_map pvm
      ON p.id = pvm.product_id

    LEFT JOIN product_variation pv
      ON pvm.variation_id = pv.variation_id

    WHERE 1=1
  `;

  const values = [];

  // Category
  if (filters.category) {
    sql += ` AND p.category_id = ?`;
    values.push(filters.category);
  }

  // Sub Category
  if (filters.subcategory) {
    sql += ` AND p.sub_category_id = ?`;
    values.push(filters.subcategory);
  }

  // Search
  if (filters.search) {

    sql += `
      AND (
        p.product_name LIKE ?
        OR p.description LIKE ?
        OR p.tags LIKE ?
        OR p.sku LIKE ?
      )
    `;

    const keyword = `%${filters.search}%`;

    values.push(
      keyword,
      keyword,
      keyword,
      keyword
    );
  }

  // Color
  if (filters.color) {
    sql += ` AND pv.color_code = ?`;
    values.push(filters.color);
  }

  // Size
  if (filters.size) {
    sql += ` AND pv.size = ?`;
    values.push(filters.size);
  }

  // Price
  if (filters.minPrice) {
    sql += ` AND p.base_price >= ?`;
    values.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    sql += ` AND p.base_price <= ?`;
    values.push(filters.maxPrice);
  }

  // Sorting
  switch (filters.sort) {

    case "price_low":
      sql += ` ORDER BY p.base_price ASC`;
      break;

    case "price_high":
      sql += ` ORDER BY p.base_price DESC`;
      break;

    case "newest":
      sql += ` ORDER BY p.created_at DESC`;
      break;

    case "oldest":
      sql += ` ORDER BY p.created_at ASC`;
      break;

    default:
      sql += ` ORDER BY p.id DESC`;
  }

  // Pagination
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 9;

  const offset = (page - 1) * limit;

  sql += ` LIMIT ?, ?`;

  values.push(offset, limit);

  db.query(sql, values, callback);

};

/* =========================
   SHOP SIDEBAR
========================= */

export const getShopSidebar = (callback) => {

  const data = {};

  // Categories
  const categorySql = `
        SELECT
            category_id,
            category_name
        FROM product_category
        WHERE status='Active'
        ORDER BY category_name ASC
    `;

  db.query(categorySql, (err, categories) => {

    if (err) return callback(err);

    data.categories = categories;

    // Colors
    const colorSql = `
    SELECT DISTINCT
        pv.variation_id,
        pv.color_code
    FROM product_variation pv
    INNER JOIN product_variation_map pvm
        ON pv.variation_id = pvm.variation_id
    WHERE
        pv.color_code IS NOT NULL
        AND pv.color_code <> ''
        AND pv.status = 'Active'
    ORDER BY pv.color_code ASC
`;

    db.query(colorSql, (err, colors) => {

      if (err) return callback(err);

      data.colors = colors;

      // Sizes
      const sizeSql = `
    SELECT DISTINCT
        pv.variation_id,
        pv.size
    FROM product_variation pv
    INNER JOIN product_variation_map pvm
        ON pv.variation_id = pvm.variation_id
    WHERE
        pv.size IS NOT NULL
        AND pv.size <> ''
        AND pv.status = 'Active'
    ORDER BY pv.size ASC
`;
      db.query(sizeSql, (err, sizes) => {

        if (err) return callback(err);

        data.sizes = sizes;

        // Best Sellers
        const bestSellerSql = `
                    SELECT
                        id,
                        product_name,
                        base_price,
                        sale_price,
                        main_image
                    FROM products
                    WHERE is_best_seller=1
                    LIMIT 5
                `;

        db.query(bestSellerSql, (err, bestSellers) => {

          if (err) return callback(err);

          data.bestSellers = bestSellers;

          // Price Range
          const priceSql = `
                        SELECT
                            MIN(base_price) AS minPrice,
                            MAX(base_price) AS maxPrice
                        FROM products
                    `;

          db.query(priceSql, (err, price) => {

            if (err) return callback(err);

            data.price = price[0];

            callback(null, data);

          });

        });

      });

    });

  });

};