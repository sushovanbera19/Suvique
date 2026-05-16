import { useState } from "react";
import {
  FiImage,
  FiX,
} from "react-icons/fi";

import Breadcrumb from "../common/Breadcrumb";
import Card from "../common/Card"; // IMPORT CARD
import "../../assets/style/products.css";

const Products = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      productName: "Nike Air Max",
      description: "Comfortable running shoes for men.",
      mainImage:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    },

    {
      id: 2,
      productName: "Apple Watch",
      description: "Smart watch with fitness tracking.",
      mainImage:
        "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500",
    },

    {
      id: 3,
      productName: "Gaming Headphone",
      description: "RGB gaming headset with deep bass.",
      mainImage:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    },
  ]);

  const [form, setForm] = useState({
    productName: "",
    description: "",
    category: "",
    subCategory: "",
    tags: "",
    basePrice: "",
    sku: "",
    quantity: "",
    vat: "",
    discountType: "",
    width: "",
    height: "",
    weight: "",
    shippingCost: "",
    sizes: [],
    colors: [],
    mainImage: null,
    galleryImages: [],
  });

  const sizeOptions = ["XS", "SM", "LG", "XL"];

  const colorOptions = [
    "#2563eb",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#7c3aed",
  ];

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // MAIN IMAGE
  const handleMainImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm({
        ...form,
        mainImage: URL.createObjectURL(file),
      });
    }
  };

  // GALLERY
  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files);

    const imageUrls = files.map((file) =>
      URL.createObjectURL(file)
    );

    setForm({
      ...form,
      galleryImages: [...form.galleryImages, ...imageUrls],
    });
  };

  // SIZE
  const handleSize = (size) => {
    if (form.sizes.includes(size)) {
      setForm({
        ...form,
        sizes: form.sizes.filter((item) => item !== size),
      });
    } else {
      setForm({
        ...form,
        sizes: [...form.sizes, size],
      });
    }
  };

  // COLOR
  const handleColor = (color) => {
    if (form.colors.includes(color)) {
      setForm({
        ...form,
        colors: form.colors.filter((item) => item !== color),
      });
    } else {
      setForm({
        ...form,
        colors: [...form.colors, color],
      });
    }
  };

  // REMOVE GALLERY IMAGE
  const removeGalleryImage = (index) => {
    const updated = [...form.galleryImages];

    updated.splice(index, 1);

    setForm({
      ...form,
      galleryImages: updated,
    });
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      ...form,
      id: Date.now(),
      tags: form.tags.split(","),
    };

    setProducts([newProduct, ...products]);

    alert("Product Added Successfully");
  };

  return (
    <div className="products-page">

      {/* HEADER */}
      <div className="page-top">
        <h1 className="page-title">
           Products
        </h1>

        <Breadcrumb />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="product-layout">

          {/* LEFT SIDE */}
          <div className="left-side">

            {/* MAIN IMAGE */}
            <Card>
              <h3>Upload Main Image</h3>

              <div className="upload-box">
                {form.mainImage ? (
                  <img
                    src={form.mainImage}
                    alt=""
                    className="preview-image"
                  />
                ) : (
                  <FiImage size={60} />
                )}
              </div>

              <label className="upload-btn">
                Upload Main Image

                <input
                  type="file"
                  hidden
                  onChange={handleMainImage}
                />
              </label>
            </Card>

            {/* GALLERY */}
            <Card>
              <h3>Gallery Images</h3>

              <div className="gallery-grid">
                {form.galleryImages.map((img, index) => (
                  <div
                    className="gallery-item"
                    key={index}
                  >
                    <img src={img} alt="" />

                    <button
                      type="button"
                      onClick={() =>
                        removeGalleryImage(index)
                      }
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>

              <label className="upload-btn">
                Upload Gallery

                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleGalleryImages}
                />
              </label>
            </Card>

            {/* PRODUCT DETAILS */}
            <Card>
              <h3>Product Details</h3>

              <div className="form-group">
                <label>Category</label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option>Fashion</option>
                  <option>Electronics</option>
                  <option>Clothing</option>
                </select>
              </div>

              <div className="form-group">
                <label>Sub Category</label>

                <select
                  name="subCategory"
                  value={form.subCategory}
                  onChange={handleChange}
                >
                  <option>Men</option>
                  <option>Women</option>
                  <option>Mobiles</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tags</label>

                <input
                  type="text"
                  name="tags"
                  placeholder="shirt, fashion"
                  value={form.tags}
                  onChange={handleChange}
                />
              </div>
            </Card>

            {/* ATTRIBUTES */}
            <Card>
              <h3>Product Attribute</h3>

              <div className="attribute-section">
                <label>Sizes</label>

                <div className="size-wrap">
                  {sizeOptions.map((size) => (
                    <button
                      type="button"
                      key={size}
                      className={`size-btn ${form.sizes.includes(size)
                        ? "active-size"
                        : ""
                        }`}
                      onClick={() =>
                        handleSize(size)
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="attribute-section">
                <label>Colors</label>

                <div className="color-wrap">
                  {colorOptions.map((color, i) => (
                    <div
                      key={i}
                      className={`color-box ${form.colors.includes(color)
                        ? "active-color"
                        : ""
                        }`}
                      style={{
                        background: color,
                      }}
                      onClick={() =>
                        handleColor(color)
                      }
                    ></div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div className="right-side">

            {/* PRODUCT INFO */}
            <Card>
              <h3>Product Information</h3>

              <div className="form-group">
                <label>Product Name</label>

                <input
                  type="text"
                  name="productName"
                  placeholder="Product Name"
                  value={form.productName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  rows="6"
                  name="description"
                  placeholder="Product Description"
                  value={form.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </Card>

            {/* DETAILS */}
            <Card>
              <h3>Details</h3>

              <div className="details-grid">

                <div className="form-group">
                  <label>Base Price</label>

                  <input
                    type="number"
                    name="basePrice"
                    placeholder="Product Price"
                    value={form.basePrice}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>SKU</label>

                  <input
                    type="text"
                    name="sku"
                    placeholder="SKU"
                    value={form.sku}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Quantity</label>

                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={form.quantity}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>VAT Amount (%)</label>

                  <input
                    type="number"
                    name="vat"
                    placeholder="VAT"
                    value={form.vat}
                    onChange={handleChange}
                  />
                </div>

              </div>
            </Card>

            {/* SHIPPING */}
            <Card>
              <h3>Shipping</h3>

              <div className="details-grid">

                <div className="form-group">
                  <label>Width</label>

                  <input
                    type="text"
                    name="width"
                    value={form.width}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Height</label>

                  <input
                    type="text"
                    name="height"
                    value={form.height}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Weight</label>

                  <input
                    type="text"
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Shipping Cost</label>

                  <input
                    type="number"
                    name="shippingCost"
                    value={form.shippingCost}
                    onChange={handleChange}
                  />
                </div>

              </div>
            </Card>

            {/* BUTTONS */}
            <div className="product-btns">
              <button
                type="submit"
                className="publish-btn"
              >
                Publish
              </button>

              <button
                type="button"
                className="draft-btn"
              >
                Save Draft
              </button>
              <button
                type="button"
                className="draft-btn"
              >
              Import Excel
              </button>
            </div>

          </div>
        </div>
      </form>

      {/* PRODUCT LIST */}
      <div className="product-show-list">
        {products.map((item) => (
          <Card key={item.id}>
            <div className="saved-product">

              <img
                src={item.mainImage}
                alt=""
              />

              <div className="saved-product-content">
                <h4>{item.productName}</h4>

                <p>{item.description}</p>

                <div className="product-meta-info">
                  <span>${item.basePrice}</span>
                  <span>{item.category}</span>
                  <span>{item.quantity} Stock</span>
                </div>
              </div>

            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default Products;