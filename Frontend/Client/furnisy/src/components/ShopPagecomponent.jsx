import React, { useState, useEffect } from "react";
import BlogSearch from "../Common/BlogSearch";
import BlogCategories from "../Common/BlogCategories";
import LatestPosts from "../Common/LatestPosts";
import BlogTags from "../Common/BlogTags";
import ProductCard from "../Common/ProductCard";
import Pagination from "../Common/Pagination";
import "../assets/style/ShopPage.css";
import AccountHeader from "./AccountHeader";
import image5 from "../../public/images/img-5.webp";
import { useCountry } from "../context/CountryContext";
import { useTranslation } from "../context/LanguageContext";
import { FiSearch } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toastSuccess, toastError, toastLoginRequired } from "../utils/toast";


// Best sellers
// const bestSellers = [
//   { id: 2, name: "Modular Sofa With Wood", price: 399, img: image5 },
//   { id: 6, name: "Modern Accent Chair", price: 299, img: image5 },
// ];

const ShopPagecomponent = ({ defaultView = "grid", selectedCategoryId = "", onCategoryChange }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [colors, setColors] = useState([]);
  const [tags, setTags] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [maxPrice, setMaxPrice] = useState(0);
  const [priceRange, setPriceRange] = useState({
    minPrice: 0,
    maxPrice: 0
  });

  const [selectedCategory, setSelectedCategory] = useState(selectedCategoryId || searchParams.get("category") || "");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (selectedCategoryId) {
      setSelectedCategory(selectedCategoryId);
      setCurrentPage(1);
    }
  }, [selectedCategoryId]);

  const [view, setView] = useState(defaultView);
  const [sortBy, setSortBy] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");

  const productsPerPage = 6;
  const { formatPrice } = useCountry();
  const { t } = useTranslation();



  useEffect(() => {

    fetch("http://localhost:5000/api/products/shop/sidebar")
      .then(res => res.json())
      .then(data => {

        if (data.success) {

          setCategories(data.data.categories);

          setColors(data.data.colors);

          setBestSellers(data.data.bestSellers);

          setTags(data.data.tags || []);

          setPriceRange(data.data.price);

          setMaxPrice(data.data.price.maxPrice);

        }

      });

  }, []);


  useEffect(() => {

    loadProducts();

  }, [
    currentPage,
    selectedCategory,
    selectedColor,
    searchTerm,
    maxPrice,
    sortBy
  ]);

  const loadProducts = async () => {

    const url =
      `http://localhost:5000/api/products/shop?page=${currentPage}&limit=9&category=${selectedCategory}&color=${selectedColor}&search=${searchTerm}&maxPrice=${maxPrice}&sort=${sortBy}`;

    const res = await fetch(url);

    const data = await res.json();
    console.log(data);
    console.log(data.data);

    if (data.success) {

      setProducts(data.data);

      setTotalPages(data.pagination.totalPages);

    }

  };

  const addToCartList = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { toastLoginRequired(); return; }
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });
      const data = await res.json();
      if (data.success) {
        toastSuccess(t("product.addedToCart"));
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        toastError(data.message || t("product.failedToAdd"));
      }
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <>
      <div className="shop-page">
        {/* ================= SIDEBAR ================= */}
        <aside className="shop-sidebar">
          <div className="sidebar-widget"><BlogCategories selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setCurrentPage={setCurrentPage} /></div>

          <div className="sidebar-widget price-filter">
            <h3>{t("shop.filterByPrice")}</h3>
            <input
              type="range"
              min={priceRange.minPrice}
              max={priceRange.maxPrice}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
            />
            <span>{formatPrice(priceRange.minPrice)}   -  {formatPrice(maxPrice)}</span>
          </div>

          <div className="sidebar-widget color-filter">
            <h3>{t("shop.filterByColor")}</h3>
            <div className="color-options">
              {colors.map((color) => (
                <span
                  key={color.variation_id}
                  className={selectedColor === color.color_code ? "active" : ""}
                  style={{
                    backgroundColor: color.color_code,
                    cursor: "pointer",
                  }}
                  title={color.color_code}
                  onClick={() => {
                    setSelectedColor(
                      selectedColor === color.color_code ? "" : color.color_code
                    );
                    setCurrentPage(1);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="sidebar-widget best-sellers">
            <h3 className="sidebar-title">{t("shop.bestSellers")}</h3>
            {bestSellers.map((item) => (
              <div key={item.id} className="best-seller-item">
                <img src={`http://localhost:5000/${item.main_image}`} alt={item.product_name} />
                <div className="best-seller-text">
                  <p className="best-seller-name">{item.product_name}</p>
                  <p className="best-seller-price">{formatPrice(item.sale_price || item.base_price)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-widget"><BlogTags tags={tags} onTagClick={(tag) => { setSearchTerm(tag); setCurrentPage(1); }} /></div>
        </aside>

        {/* ================= PRODUCTS ================= */}
        <main className="shop-products">
          {/* TOP BAR */}
          <div className="shop-topbar">
            <div className="shop-search">
              <input
                type="text"
                placeholder={t("shop.searchProducts")}
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
                <option value="default">{t("shop.defaultSort")}</option>
                <option value="low">{t("shop.priceLowHigh")}</option>
                <option value="high">{t("shop.priceHighLow")}</option>
                <option value="new">{t("shop.newest")}</option>
              </select>
            </div>
          </div>

          {/* PRODUCT GRID / LIST */}
          <div className={view === "grid" ? "product-grid" : "product-list"}>
            {products.map((product) => (
              view === "grid" ? (
                <ProductCard key={product.id} product={product} />
              ) : (
                <div key={product.id} className="product-list-card" onClick={() => navigate(`/product-details-1/${product.id}`)}>
                  <div className="product-list-image">
                    <img
                      src={`http://localhost:5000/${product.main_image?.replace(/\\/g, "/")}`}
                      alt={product.product_name}
                    />
                  </div>
                  <div className="product-list-info">
                    <h3 className="product-list-name">{product.product_name}</h3>
                    <p className="product-list-category">{product.category_name || ""}</p>
                    <p className="product-list-desc">{product.short_description || product.description || ""}</p>
                    <div className="product-list-price-row">
                      <span className="product-list-price">{formatPrice(product.sale_price || product.base_price)}</span>
                      {product.sale_price && product.base_price && product.sale_price < product.base_price && (
                        <span className="product-list-original-price">{formatPrice(product.base_price)}</span>
                      )}
                    </div>
                    <button className="product-list-cart-btn" onClick={(e) => { e.stopPropagation(); addToCartList(product.id); }}>
                      {t("product.addToCart")}
                    </button>
                  </div>
                </div>
              )
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
