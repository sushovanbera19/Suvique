import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import ProductCard from "../Common/ProductCard";
import { useTranslation } from "../context/LanguageContext";
import "../assets/style/SearchPage.css";

const API = "http://localhost:5000";

const SearchPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/product-category/all`)
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(console.error);
  }, []);

  // Re-sync state when URL params change (e.g. from SearchModal navigation)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("category") || "";
    setKeyword(q);
    setSelectedCategory(cat);
    if (q || cat) {
      doSearch(q, cat);
    }
  }, [searchParams]);

  const doSearch = async (q, cat) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `${API}/api/products/search?category=${cat || ""}&keyword=${encodeURIComponent(q || "")}`
      );
      const data = await res.json();
      setProducts(data.success ? data.data : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (keyword.trim()) params.q = keyword.trim();
    if (selectedCategory) params.category = selectedCategory;
    setSearchParams(params);
  };

  const handleClear = () => {
    setKeyword("");
    setSelectedCategory("");
    setSearchParams({});
    setProducts([]);
    setSearched(false);
  };

  return (
    <div className="search-page">
      <div className="search-page-container">
        <h1 className="search-page-title">{t("menu.searchProducts") || "Search Products"}</h1>

        <form className="search-page-form" onSubmit={handleSearch}>
          <div className="search-page-input-group">
            <FaSearch className="search-page-icon" />
            <input
              type="text"
              placeholder={t("menu.searchProducts") || "Search products..."}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="search-page-input"
              autoFocus
            />
            {keyword && (
              <button type="button" className="search-page-clear" onClick={handleClear}>
                <FaTimes />
              </button>
            )}
          </div>

          <select
            className="search-page-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">{t("shop.allCategories") || "All Categories"}</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>

          <button type="submit" className="search-page-btn">
            {t("common.search") || "Search"}
          </button>
        </form>

        {/* Results */}
        {loading ? (
          <div className="search-page-loading">
            <FaSpinner className="search-spinner" />
            <p>{t("common.loading")}</p>
          </div>
        ) : searched ? (
          products.length > 0 ? (
            <>
              <p className="search-page-count">
                {products.length} {products.length === 1 ? "product" : "products"} found
              </p>
              <div className="search-page-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="search-page-empty">
              <FaSearch />
              <p>{t("shop.noProducts") || "No products found matching your search."}</p>
              <button onClick={handleClear}>{t("common.search") || "Clear Search"}</button>
            </div>
          )
        ) : (
          <div className="search-page-hint">
            <FaSearch />
            <p>Search by product name, category, or keywords</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
