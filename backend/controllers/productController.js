import db from "../config/db.js";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, updateOfferSettingsModel, getShopProducts, getShopSidebar, bulkCreateProducts, toggleProductStatus } from "../models/productModel.js";

// =========================
// CREATE PRODUCT + VARIATIONS (FIXED)
// =========================

export const addProduct = (req, res) => {

  // Keep form fields
  const body = req.body;

  // Convert JSON strings back to arrays
  body.tags = JSON.parse(body.tags || "[]");
  body.sizes = JSON.parse(body.sizes || "[]");
  body.colors = JSON.parse(body.colors || "[]");

  // Store uploaded image paths
  body.mainImage =
    req.files?.mainImage?.[0]?.path || null;

  body.galleryImages =
    req.files?.galleryImages?.map(
      (file) => file.path
    ) || [];

  const { basePrice, quantity, sizes, colors } = body;

  // STEP 1: INSERT PRODUCT
  createProduct(body, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Product insert failed",
        error: err
      });
    }

    const productId = result.insertId;

    // STEP 2: VALIDATION
    if (!sizes?.length || !colors?.length) {
      return res.status(400).json({
        success: false,
        message: "Sizes and Colors required"
      });
    }

    // STEP 3: GET ALL VARIATIONS FROM MASTER TABLE
    const sql = `SELECT * FROM product_variation`;

    db.query(sql, (err2, variations) => {
      if (err2) {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch variations",
          error: err2
        });
      }

      let variationData = [];

      // STEP 4: MATCH SELECTED SIZE + COLOR WITH DB VARIATIONS
      colors.forEach((color) => {
        sizes.forEach((size) => {

          const match = variations.find(
            (v) =>
              String(v.color_code).trim().toLowerCase() ===
              String(color).trim().toLowerCase() &&
              String(v.size).trim().toLowerCase() ===
              String(size).trim().toLowerCase()
          );

          if (match) {
            variationData.push([
              productId,
              match.variation_id,
              quantity,
              basePrice
            ]);
          }
        });
      });

      if (variationData.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No matching variations found in DB"
        });
      }

      // STEP 5: INSERT INTO VARIATION MAP
      const insertSql = `
        INSERT INTO product_variation_map
        (product_id, variation_id, quantity, base_price)
        VALUES ?
      `;

      db.query(insertSql, [variationData], (err3) => {
        if (err3) {
          return res.status(500).json({
            success: false,
            message: "Variation mapping insert failed",
            error: err3
          });
        }

        return res.status(201).json({
          success: true,
          message: "Product created successfully with variations",
          productId
        });
      });
    });
  });
};

// =========================
// BULK ADD PRODUCTS (from Excel)
// =========================
export const bulkAddProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: "No products provided" });
    }

    await bulkCreateProducts(products);

    res.json({ success: true, message: `${products.length} products imported successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Bulk import failed" });
  }
};

// =========================
// GET ALL PRODUCTS
// =========================
export const fetchAllProducts = (req, res) => {
  getAllProducts((err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error fetching products",
        error: err
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  });
};


// =========================
// GET SINGLE PRODUCT
// =========================
export const fetchProductById = (req, res) => {
  const { id } = req.params;

  getProductById(id, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error fetching product",
        error: err
      });
    }

    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const product = result[0];

    const varSql = `
      SELECT pv.size, pv.color_code
      FROM product_variation_map pvm
      INNER JOIN product_variation pv ON pvm.variation_id = pv.variation_id
      WHERE pvm.product_id = ?
    `;

    db.query(varSql, [id], (err2, variations) => {
      if (err2) {
        return res.status(200).json({ success: true, data: product });
      }

      const sizes = [...new Set(variations.map((v) => v.size))];
      const colors = [...new Set(variations.map((v) => v.color_code))];

      product.sizes = sizes;
      product.colors = colors;

      res.status(200).json({
        success: true,
        data: product
      });
    });
  });
};


// =========================
// UPDATE PRODUCT
// =========================
export const editProduct = (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };

  if (req.files?.mainImage?.[0]) {
    data.mainImage = req.files.mainImage[0].path;
  }
  if (req.files?.galleryImages?.length) {
    const existing = JSON.parse(data.existingGallery || "[]");
    data.galleryImages = [...existing, ...req.files.galleryImages.map((f) => f.path)];
  } else if (data.existingGallery) {
    data.galleryImages = JSON.parse(data.existingGallery);
  }

  try {
    data.tags = JSON.parse(data.tags || "[]");
    data.sizes = JSON.parse(data.sizes || "[]");
    data.colors = JSON.parse(data.colors || "[]");
  } catch (e) { /* already parsed */ }

  updateProduct(id, data, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error updating product",
        error: err
      });
    }

    const { sizes, colors, quantity, basePrice } = data;
    if (sizes?.length && colors?.length) {
      const delSql = `DELETE FROM product_variation_map WHERE product_id = ?`;
      db.query(delSql, [id], (err2) => {
        if (err2) {
          return res.status(200).json({ success: true, message: "Product updated but variations failed" });
        }
        const varSql = `SELECT * FROM product_variation`;
        db.query(varSql, (err3, variations) => {
          if (err3) {
            return res.status(200).json({ success: true, message: "Product updated but variation mapping failed" });
          }
          let rows = [];
          colors.forEach((color) => {
            sizes.forEach((size) => {
              const match = variations.find(
                (v) => String(v.color_code).trim().toLowerCase() === String(color).trim().toLowerCase() &&
                       String(v.size).trim().toLowerCase() === String(size).trim().toLowerCase()
              );
              if (match) {
                rows.push([id, match.variation_id, quantity || 0, basePrice || 0]);
              }
            });
          });
          if (rows.length === 0) {
            return res.status(200).json({ success: true, message: "Product updated" });
          }
          const insSql = `INSERT INTO product_variation_map (product_id, variation_id, quantity, base_price) VALUES ?`;
          db.query(insSql, [rows], () => {
            res.status(200).json({ success: true, message: "Product updated successfully" });
          });
        });
      });
    } else {
      res.status(200).json({ success: true, message: "Product updated successfully" });
    }
  });
};


// =========================
// DELETE PRODUCT
// =========================
export const removeProduct = (req, res) => {
  const { id } = req.params;

  deleteProduct(id, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error deleting product",
        error: err
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  });
};

// =========================
// TOGGLE PRODUCT STATUS
// =========================
export const toggleStatus = (req, res) => {
  const { id } = req.params;

  toggleProductStatus(id, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error toggling status",
        error: err
      });
    }

    res.status(200).json({
      success: true,
      message: "Status toggled successfully"
    });
  });
};

// =========================
// UPDATE OFFER SETTINGS
// =========================
export const updateOfferSettings = (req, res) => {
  const products = req.body;

  if (!Array.isArray(products)) {
    return res.status(400).json({
      success: false,
      message: "Products must be an array",
    });
  }

  updateOfferSettingsModel(products, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to update offer settings",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer settings updated successfully",
    });
  });
};

// search=======
export const searchProductController = (req, res) => {

  const categoryId = req.query.category || "";
  const keyword = req.query.keyword || "";

  searchProducts(categoryId, keyword, (err, rows) => {

    if (err) {

      return res.status(500).json({
        success: false,
        message: err.message
      });

    }

    res.json({
      success: true,
      data: rows
    });

  });

};

export const shopProducts = (req, res) => {

  getShopProducts(req.query, (err, result, totalCount) => {

    if (err) {

      return res.status(500).json({
        success: false,
        message: err.message
      });

    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const totalPages = Math.ceil((totalCount || 0) / limit);

    res.json({

      success: true,
      data: result,
      pagination: {
        page,
        limit,
        totalPages,
        total: totalCount || 0
      }

    });

  });

};
export const shopSidebar = (req, res) => {

    getShopSidebar((err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        res.json({

            success: true,
            data: result

        });

    });

};