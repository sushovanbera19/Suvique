import { addCart, getCart, removeCart, updateCartQuantity } from "../models/cartModel.js";

// Add to cart
export const addToCart = (req, res) => {
  const user_id = req.user.userId;
  const { product_id, variation_id } = req.body;

  addCart(user_id, product_id, variation_id || null, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result?.alreadyExists) {
      return res.json({
        success: true,
        message: "Cart quantity updated",
      });
    }

    res.json({
      success: true,
      message: "Added to cart",
    });
  });
};

// Get cart
export const fetchCart = (req, res) => {
  const user_id = req.user.userId;

  getCart(user_id, (err, rows) => {
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

// Remove cart
export const deleteCart = (req, res) => {
  const user_id = req.user.userId;
  const { product_id, variation_id } = req.body;

  removeCart(user_id, product_id, variation_id || null, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      message: "Removed from cart",
    });
  });
};

// Update cart quantity
export const updateQuantity = (req, res) => {
  const user_id = req.user.userId;
  const { cart_id, quantity } = req.body;

  if (!cart_id || !quantity || quantity < 1) {
    return res.status(400).json({ success: false, message: "Invalid cart_id or quantity" });
  }

  updateCartQuantity(user_id, cart_id, quantity, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json({ success: true, message: "Quantity updated" });
  });
};