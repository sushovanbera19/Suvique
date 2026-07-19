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
import newsletterRoutes from "./routes/newsletter.routes.js";
import aboutRoutes from "./routes/about.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import staticPageRoutes from "./routes/staticPage.routes.js";
import fileManagerRoutes from "./routes/fileManager.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import showroomRoutes from "./routes/showroom.routes.js";
import productInfoRoutes from "./routes/productInfo.routes.js";
import bannerRoutes from "./routes/banner.routes.js";
import videoRoutes from "./routes/video.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import couponRoutes from "./routes/coupon.routes.js";


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
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/static-pages", staticPageRoutes);
app.use("/api/files", fileManagerRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/showrooms", showroomRoutes);
app.use("/api/product-info", productInfoRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupons", couponRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// global error handler (returns JSON, never HTML)
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
});

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});