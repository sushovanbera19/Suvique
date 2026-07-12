import { addWishlist, getWishlist, removeWishlist, } from "../models/wishlistModel.js";

// Add to Wishlist
export const addToWishlist = (req, res) => {
  const user_id = req.user.userId;
  const { product_id } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({
      success: false,
      message: "Missing data",
    });
  }

  addWishlist(user_id, product_id, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result?.alreadyExists) {
      return res.json({
        success: false,
        message: "Product already exists in wishlist",
      });
    }

    res.json({
      success: true,
      message: "Product added to wishlist",
    });
  });
};
// Get Wishlist
export const fetchWishlist = (req, res) => {
  const user_id = req.user.userId;

  getWishlist(user_id, (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      data: rows,
    });
  });
};

// Remove Wishlist
export const deleteWishlist = (req, res) => {
  const user_id = req.user.userId;
  const { product_id } = req.body;

  removeWishlist(user_id, product_id, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      message: "Product removed from wishlist",
    });
  });
};