import express from "express";
import path from "path";
import cors from "cors";
import "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import productCategoryRoutes from "./routes/productCategory.routes.js";
import productSubCategoryRoutes from "./routes/productSubCategory.routes.js";
import productVariationRoutes from "./routes/productVariation.routes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";



const app = express();

// middlewares

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


// routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/product-category", productCategoryRoutes);
app.use("/api/product-subcategory", productSubCategoryRoutes);
app.use("/api/product-variation", productVariationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});