import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiX,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiFileText,
  FiTag,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import CommonModal from "../common/CommonModal";

const API = "http://localhost:5000";
const RECENT_KEY = "admin_search_recent";

const SearchIcon = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_KEY);
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setActiveFilter("all");
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => performSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const saveRecent = (term) => {
    const updated = [term, ...recentSearches.filter((r) => r !== term)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const performSearch = async (term) => {
    setLoading(true);
    try {
      const q = term.toLowerCase();
      const [productsRes, ordersRes, usersRes, blogsRes] = await Promise.allSettled([
        fetch(`${API}/api/products`),
        fetch(`${API}/api/orders`),
        fetch(`${API}/api/users/all-users`),
        fetch(`${API}/api/blogs`),
      ]);

      const found = [];

      if (productsRes.status === "fulfilled") {
        const json = await productsRes.value.json();
        const products = json?.data || (Array.isArray(json) ? json : []);
        products.forEach((p) => {
          if (
            p.name?.toLowerCase().includes(q) ||
            p.sku?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.tags?.toLowerCase().includes(q)
          ) {
            found.push({
              type: "product",
              icon: <FiPackage />,
              title: p.name,
              subtitle: p.sku || `Product #${p.id}`,
              image: p.main_image,
              path: `/dashboard/product-details/${p.id}`,
            });
          }
        });
      }

      if (ordersRes.status === "fulfilled") {
        const json = await ordersRes.value.json();
        const orders = json?.data || (Array.isArray(json) ? json : []);
        orders.forEach((o) => {
          const searchStr = `${o.id} ${o.customer_name || ""} ${o.email || ""} ${o.order_status || ""}`.toLowerCase();
          if (searchStr.includes(q)) {
            found.push({
              type: "order",
              icon: <FiShoppingCart />,
              title: `Order #${o.id}`,
              subtitle: `${o.customer_name || "Customer"} • ${o.order_status || "Pending"}`,
              path: "/dashboard/orders",
            });
          }
        });
      }

      if (usersRes.status === "fulfilled") {
        const userList = await usersRes.value.json();
        const users = Array.isArray(userList) ? userList : (userList?.data || []);
        users.forEach((u) => {
          const searchStr = `${u.name || ""} ${u.email || ""} ${u.phone || ""}`.toLowerCase();
          if (searchStr.includes(q)) {
            found.push({
              type: "user",
              icon: <FiUsers />,
              title: u.name || u.email,
              subtitle: u.email || "Customer",
              path: "/dashboard/customers",
            });
          }
        });
      }

      if (blogsRes.status === "fulfilled") {
        const json = await blogsRes.value.json();
        const blogs = json?.data || (Array.isArray(json) ? json : []);
        blogs.forEach((b) => {
          if (
            b.title?.toLowerCase().includes(q) ||
            b.category?.toLowerCase().includes(q) ||
            b.author?.toLowerCase().includes(q)
          ) {
            found.push({
              type: "blog",
              icon: <FiFileText />,
              title: b.title,
              subtitle: `${b.category || "Blog"} • ${b.author || "Admin"}`,
              path: "/dashboard/blogs",
            });
          }
        });
      }

      const pageMatch = searchPages(q);
      found.push(...pageMatch);

      setResults(found);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchPages = (q) => {
    const pages = [
      { name: "Overview", path: "/dashboard/overview", keywords: "overview dashboard home" },
      { name: "Products", path: "/dashboard/products", keywords: "products items inventory" },
      { name: "Orders", path: "/dashboard/orders", keywords: "orders purchases" },
      { name: "Customers", path: "/dashboard/customers", keywords: "customers users people" },
      { name: "Categories", path: "/dashboard/categories", keywords: "categories groups" },
      { name: "Sub Categories", path: "/dashboard/sub-categories", keywords: "sub categories" },
      { name: "Vendors", path: "/dashboard/vendors", keywords: "vendors brands" },
      { name: "Blogs", path: "/dashboard/blogs", keywords: "blogs articles posts" },
      { name: "FAQs", path: "/dashboard/faqs", keywords: "faqs questions" },
      { name: "Reviews", path: "/dashboard/reviews", keywords: "reviews ratings" },
      { name: "Banners", path: "/dashboard/banners", keywords: "banners sliders" },
      { name: "Videos", path: "/dashboard/videos", keywords: "videos media" },
      { name: "Showrooms", path: "/dashboard/showrooms", keywords: "showrooms stores" },
      { name: "Product Info", path: "/dashboard/product-info", keywords: "product info additional" },
      { name: "About Us", path: "/dashboard/about-us", keywords: "about page" },
      { name: "Static Pages", path: "/dashboard/static-pages", keywords: "static pages content" },
      { name: "Settings", path: "/dashboard/settings", keywords: "settings config" },
      { name: "Variations", path: "/dashboard/inventory", keywords: "variations inventory stock" },
      { name: "Shop", path: "/dashboard/shop", keywords: "shop ecommerce store" },
      { name: "Cart", path: "/dashboard/cart", keywords: "cart shopping" },
      { name: "Contacts", path: "/dashboard/contacts", keywords: "contacts messages" },
      { name: "File Manager", path: "/dashboard/files", keywords: "files manager uploads" },
      { name: "Analytics", path: "/dashboard/analytics", keywords: "analytics charts data" },
      { name: "Buttons", path: "/dashboard/buttons", keywords: "buttons ui components" },
      { name: "Cards", path: "/dashboard/cards", keywords: "cards ui components" },
      { name: "Modals", path: "/dashboard/modal", keywords: "modals dialogs" },
      { name: "Form Elements", path: "/dashboard/form-elements", keywords: "form elements inputs" },
      { name: "Form Validation", path: "/dashboard/form-validation", keywords: "form validation rules" },
      { name: "ApexCharts", path: "/dashboard/apex-charts", keywords: "charts apex" },
      { name: "Chart.js", path: "/dashboard/chartjs", keywords: "charts chartjs" },
      { name: "Basic Tables", path: "/dashboard/basic-tables", keywords: "tables basic" },
      { name: "Data Tables", path: "/dashboard/data-tables", keywords: "tables data sorting" },
    ];

    return pages
      .filter((p) => p.name.toLowerCase().includes(q) || p.keywords.includes(q))
      .map((p) => ({
        type: "page",
        icon: <FiFileText />,
        title: p.name,
        subtitle: "Page",
        path: p.path,
      }));
  };

  const handleNavigate = (item) => {
    saveRecent(query);
    navigate(item.path);
    setOpen(false);
  };

  const handleRecentClick = (term) => {
    setQuery(term);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_KEY);
  };

  const filteredResults = activeFilter === "all"
    ? results
    : results.filter((r) => r.type === activeFilter);

  const filterCounts = {
    all: results.length,
    product: results.filter((r) => r.type === "product").length,
    order: results.filter((r) => r.type === "order").length,
    user: results.filter((r) => r.type === "user").length,
    page: results.filter((r) => r.type === "page").length,
    blog: results.filter((r) => r.type === "blog").length,
  };

  const typeColors = {
    product: { bg: "#eff6ff", color: "#2563eb" },
    order: { bg: "#f0fdf4", color: "#16a34a" },
    user: { bg: "#fef3c7", color: "#d97706" },
    page: { bg: "#f3e8ff", color: "#9333ea" },
    blog: { bg: "#ffe4e6", color: "#e11d48" },
  };

  return (
    <>
      <div className="header-icon" onClick={() => setOpen(true)}>
        <FiSearch />
      </div>

      <CommonModal isOpen={open} onClose={() => setOpen(false)} width="640px">
        <div className="search-input-box">
          <FiSearch className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, orders, customers, pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) saveRecent(query);
              if (e.key === "Escape") setOpen(false);
            }}
          />
          {query && (
            <FiX className="more-icon" style={{ cursor: "pointer" }} onClick={() => setQuery("")} />
          )}
        </div>

        {results.length > 0 && (
          <div className="search-tags">
            {Object.entries(filterCounts)
              .filter(([, count]) => count > 0)
              .map(([key, count]) => (
                <button
                  key={key}
                  style={{
                    background: activeFilter === key ? "#1e293b" : undefined,
                    color: activeFilter === key ? "#fff" : undefined,
                  }}
                  onClick={() => setActiveFilter(key)}
                >
                  {key === "all" ? "All" : key.charAt(0).toUpperCase() + key.slice(1)}s ({count})
                </button>
              ))}
          </div>
        )}

        {query && filteredResults.length > 0 && (
          <div className="search-results-list">
            {filteredResults.slice(0, 12).map((item, idx) => (
              <div className="search-result-item" key={idx} onClick={() => handleNavigate(item)}>
                <div className="search-result-icon" style={{ background: typeColors[item.type]?.bg, color: typeColors[item.type]?.color }}>
                  {item.icon}
                </div>
                <div className="search-result-info">
                  <span className="search-result-title">{item.title}</span>
                  <span className="search-result-subtitle">{item.subtitle}</span>
                </div>
                <span className="search-result-type" style={{ background: typeColors[item.type]?.bg, color: typeColors[item.type]?.color }}>
                  {item.type}
                </span>
                <FiArrowRight className="search-result-arrow" />
              </div>
            ))}
          </div>
        )}

        {query && !loading && filteredResults.length === 0 && (
          <div className="search-no-results">
            <FiSearch style={{ fontSize: 32, color: "#cbd5e1", marginBottom: 8 }} />
            <p>No results found for "{query}"</p>
          </div>
        )}

        {!query && recentSearches.length > 0 && (
          <div className="recent-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h4><FiClock style={{ verticalAlign: "middle", marginRight: 6 }} /> Recent Searches</h4>
              <button onClick={clearRecent} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 12 }}>Clear All</button>
            </div>
            {recentSearches.map((term, i) => (
              <div className="recent-item" key={i} onClick={() => handleRecentClick(term)}>
                <span>{term}</span>
                <FiX style={{ color: "#94a3b8", fontSize: 14 }} onClick={(e) => {
                  e.stopPropagation();
                  const updated = recentSearches.filter((_, idx) => idx !== i);
                  setRecentSearches(updated);
                  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
                }} />
              </div>
            ))}
          </div>
        )}

        {!query && recentSearches.length === 0 && (
          <div className="recent-section">
            <h4>Quick Links</h4>
            {[
              { name: "Products", path: "/dashboard/products", icon: <FiPackage /> },
              { name: "Orders", path: "/dashboard/orders", icon: <FiShoppingCart /> },
              { name: "Customers", path: "/dashboard/customers", icon: <FiUsers /> },
              { name: "Blogs", path: "/dashboard/blogs", icon: <FiFileText /> },
              { name: "Vendors", path: "/dashboard/vendors", icon: <FiTag /> },
            ].map((item) => (
              <div className="recent-item" key={item.path} onClick={() => navigate(item.path)}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>{item.icon} {item.name}</span>
                <FiArrowRight style={{ color: "#94a3b8", fontSize: 14 }} />
              </div>
            ))}
          </div>
        )}

        <div className="modal-footer">
          <span style={{ fontSize: 12, color: "#94a3b8", marginRight: "auto" }}>
            {query ? `${filteredResults.length} result${filteredResults.length !== 1 ? "s" : ""}` : "Start typing to search"}
          </span>
          <button className="clear-btn" onClick={() => setOpen(false)}>Close</button>
        </div>
      </CommonModal>
    </>
  );
};

export default SearchIcon;
