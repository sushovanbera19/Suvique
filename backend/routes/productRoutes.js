import express from "express";
import { addProduct, fetchAllProducts, fetchProductById, editProduct, removeProduct, updateOfferSettings, searchProductController, shopProducts, shopSidebar, bulkAddProducts, toggleStatus } from "../controllers/productController.js";
import { upload } from "../config/multerConfig.js";
const router = express.Router();


router.post(
  "/add",
  upload.fields([
    {
      name: "mainImage",
      maxCount: 1,
    },
    {
      name: "galleryImages",
      maxCount: 20,
    },
  ]),
  addProduct
);
router.post("/bulk-add", bulkAddProducts);
router.get("/", fetchAllProducts);
router.get("/shop", shopProducts);
router.get("/shop/sidebar", shopSidebar);
router.get("/search", searchProductController);
router.put("/offer-settings", updateOfferSettings);
router.put("/:id/status", toggleStatus);
router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 20 },
  ]),
  editProduct
);
router.delete("/:id", removeProduct);
router.get("/:id", fetchProductById);



export default router;
