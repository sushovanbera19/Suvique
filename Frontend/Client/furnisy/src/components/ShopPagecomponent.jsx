import React, { useState } from "react";
import BlogSearch from "../Common/BlogSearch";
import BlogCategories from "../Common/BlogCategories";
import LatestPosts from "../Common/LatestPosts";
import BlogTags from "../Common/BlogTags";
import ProductCard from "../Common/ProductCard";
import Pagination from "../Common/Pagination";
import "../assets/style/ShopPage.css";
import AccountHeader from "./AccountHeader";
import image5 from "../../public/images/img-5.webp";
import { FiSearch } from "react-icons/fi"; // Feather search icon

// Dummy product data
const allProducts = [
  { id: 1, name: "Modern Dark Wood Chair", price: 299, img: image5, new: false, discount: 0, color: "brown" },
  { id: 2, name: "Modular Sofa With Wood", price: 399, img: image5, new: true, discount: 0, color: "brown" },
  { id: 3, name: "Modern Tolk Chair", price: 799, img: image5, new: false, discount: 0, color: "black" },
  { id: 4, name: "Ergonomic Cabinet", price: 149, img: image5, new: false, discount: 25, color: "white" },
  { id: 5, name: "Baxter Colette Chair", price: 299, img: image5, new: true, discount: 0, color: "gray" },
  { id: 6, name: "Modern Accent Chair", price: 199, img: image5, new: false, discount: 0, color: "gray" },
  { id: 7, name: "Wooden Table Lamp", price: 149, img: image5, new: false, discount: 25, color: "brown" },
  { id: 8, name: "Cherie Chair", price: 199, img: image5, new: false, discount: 0, color: "yellow" },
];

// Best sellers
const bestSellers = [
  { id: 2, name: "Modular Sofa With Wood", price: 399, img: image5 },
  { id: 6, name: "Modern Accent Chair", price: 299, img: image5 },
];

const ShopPagecomponent = () => {
  const [products] = useState(allProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedColor, setSelectedColor] = useState("");
  const [view, setView] = useState("grid"); // grid | list
  const [sortBy, setSortBy] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");

  const productsPerPage = 6;

  // Formatter for Indian Rupees
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });

  /* ===========================
     FILTER + SEARCH + SORT
  =========================== */
  const filteredProducts = products
    .filter(
      (p) =>
        p.price <= maxPrice &&
        (selectedColor === "" || p.color === selectedColor) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "low") return a.price - b.price;
      if (sortBy === "high") return b.price - a.price;
      if (sortBy === "new") return b.new - a.new;
      return 0;
    });

  /* ===========================
     PAGINATION
  =========================== */
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <>
      <div className="shop-page">
        {/* ================= SIDEBAR ================= */}
        <aside className="shop-sidebar">
          <div className="sidebar-widget"><BlogCategories /></div>

          <div className="sidebar-widget price-filter">
            <h3>Filter by Price</h3>
            <input
              type="range"
              min="0"
              max="1000"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
            />
            <span>{formatter.format(0)} - {formatter.format(maxPrice)}</span>
          </div>

          <div className="sidebar-widget color-filter">
            <h3>Filter by Color</h3>
            <div className="color-options">
              {["black", "gray", "white", "yellow", "brown"].map((color) => (
                <span
                  key={color}
                  className={selectedColor === color ? "active" : ""}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setSelectedColor(color === selectedColor ? "" : color);
                    setCurrentPage(1);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="sidebar-widget best-sellers">
            <h3 className="sidebar-title">BEST SELLERS</h3>
            {bestSellers.map((item) => (
              <div key={item.id} className="best-seller-item">
                <img src={item.img} alt={item.name} />
                <div className="best-seller-text">
                  <p className="best-seller-name">{item.name}</p>
                  <p className="best-seller-price">{formatter.format(item.price)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-widget"><BlogTags /></div>
        </aside>

        {/* ================= PRODUCTS ================= */}
        <main className="shop-products">
          {/* TOP BAR */}
          <div className="shop-topbar">
            <div className="shop-search">
              <input
                type="text"
                placeholder="Search Products"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <span className="search-icon"><FiSearch /></span>
            </div>

            <div className="shop-actions">
              {/* VIEW ICONS */}
              <div className="view-icons">
                <button
                  className={view === "grid" ? "active" : ""}
                  onClick={() => setView("grid")}
                >☷</button>
                <button
                  className={view === "list" ? "active" : ""}
                  onClick={() => setView("list")}
                >☰</button>
              </div>

              {/* SORTING */}
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="default">Default sorting</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
                <option value="new">Newest</option>
              </select>
            </div>
          </div>

          {/* PRODUCT GRID / LIST */}
          <div className={view === "grid" ? "product-grid" : "product-list"}>
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  price: formatter.format(product.price), // ✅ INR format
                }}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            align="left"
          />
        </main>
      </div>
    </>
  );
};

export default ShopPagecomponent;
