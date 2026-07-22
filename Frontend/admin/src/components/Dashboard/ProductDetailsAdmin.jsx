import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../common/Breadcrumb";
import { FiPackage, FiArrowLeft, FiEdit2, FiTag, FiTruck, FiInfo, FiImage, FiStar, FiCheck, FiX } from "react-icons/fi";
import "../../assets/style/ShopAdmin.css";

const API = "http://localhost:5000";

const ProductDetailsAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variations, setVariations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products`);
        if (res.ok) {
          const json = await res.json();
          setProducts(json?.data || (Array.isArray(json) ? json : []));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (id && products.length > 0) {
      const prod = products.find((p) => String(p.id) === String(id));
      if (prod) selectProduct(prod);
    }
  }, [id, products]);

  const selectProduct = async (prod) => {
    setSelectedProduct(prod);
    try {
      const [varRes, revRes] = await Promise.allSettled([
        fetch(`${API}/api/product-variation/all`),
        fetch(`${API}/api/reviews/product/${prod.id}`),
      ]);
      if (varRes.status === "fulfilled" && varRes.value.ok) {
        const varJson = await varRes.value.json();
        const allVars = varJson?.variations || (Array.isArray(varJson) ? varJson : []);
        setVariations(allVars.filter((v) => v.status === "active" || v.status === 1));
      }
      if (revRes.status === "fulfilled" && revRes.value.ok) {
        const revJson = await revRes.value.json();
        setReviews(revJson?.data || (Array.isArray(revJson) ? revJson : []));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = products.filter((p) =>
    p.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="shop-admin-wrap">
        <div className="settings-page-top">
          <h1 className="settings-page-title">Product Details</h1>
          <Breadcrumb />
        </div>
        <div className="shop-loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="shop-admin-wrap">
      <div className="settings-page-top">
        <h1 className="settings-page-title">Product Details</h1>
        <Breadcrumb />
      </div>

      {!selectedProduct ? (
        <>
          <div className="pd-search-bar">
            <FiPackage />
            <input type="text" placeholder="Search products by name or SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="pd-product-list">
            {filtered.length === 0 && <p className="shop-empty">No products found</p>}
            {filtered.map((prod) => (
              <div className="pd-product-row" key={prod.id} onClick={() => selectProduct(prod)}>
                <div className="pd-row-img">
                  {prod.main_image ? (
                    <img src={`${API}/${prod.main_image.replace(/\\/g, "/")}`} alt={prod.product_name} />
                  ) : (
                    <div className="pd-row-placeholder"><FiPackage /></div>
                  )}
                </div>
                <div className="pd-row-info">
                  <h4>{prod.product_name}</h4>
                  <span className="pd-row-sku">SKU: {prod.sku || "N/A"}</span>
                  <span className="pd-row-cat">{prod.category_name || "Uncategorized"}</span>
                </div>
                <div className="pd-row-meta">
                  <span className="pd-row-price">₹{Number(prod.base_price || 0).toLocaleString()}</span>
                  <span className="pd-row-stock">Stock: {prod.quantity ?? "N/A"}</span>
                  <span className={`pd-row-status ${prod.status === 1 || prod.status === "active" ? "active" : "inactive"}`}>
                    {prod.status === 1 || prod.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <FiEdit2 className="pd-row-arrow" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="pd-detail-view">
          <button className="pd-back-btn" onClick={() => { setSelectedProduct(null); navigate("/dashboard/product-details"); }}>
            <FiArrowLeft /> Back to Products
          </button>

          <div className="pd-detail-grid">
            <div className="pd-detail-main">
              <div className="pd-detail-images">
                {selectedProduct.main_image ? (
                  <img src={`${API}/${selectedProduct.main_image.replace(/\\/g, "/")}`} alt={selectedProduct.product_name} className="pd-detail-img" />
                ) : (
                  <div className="pd-detail-no-img"><FiImage /></div>
                )}
              </div>

              <div className="pd-detail-section">
                <h3><FiInfo /> Description</h3>
                <p className="pd-detail-desc">{selectedProduct.description || "No description available."}</p>
              </div>

              <div className="pd-detail-section">
                <h3><FiStar /> Reviews ({reviews.length})</h3>
                {reviews.length === 0 && <p className="shop-empty">No reviews yet</p>}
                {reviews.map((rev) => (
                  <div className="pd-review-card" key={rev.id}>
                    <div className="pd-review-header">
                      <span className="pd-review-name">{rev.user_name || rev.name || "Anonymous"}</span>
                      <span className="pd-review-rating">{"★".repeat(rev.rating || 0)}{"☆".repeat(5 - (rev.rating || 0))}</span>
                    </div>
                    <p className="pd-review-text">{rev.comment || rev.review_text}</p>
                    <span className="pd-review-date">{rev.created_at ? new Date(rev.created_at).toLocaleDateString() : ""}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pd-detail-sidebar">
              <div className="pd-sidebar-card">
                <h3>{selectedProduct.product_name}</h3>
                <span className="pd-sidebar-price">₹{Number(selectedProduct.base_price || 0).toLocaleString()}</span>
                {selectedProduct.sale_price && <span className="pd-sidebar-sale">Sale: ₹{Number(selectedProduct.sale_price).toLocaleString()}</span>}
              </div>

              <div className="pd-sidebar-card">
                <h4><FiTag /> Product Info</h4>
                <div className="pd-info-row"><span>SKU</span><span>{selectedProduct.sku || "N/A"}</span></div>
                <div className="pd-info-row"><span>Category</span><span>{selectedProduct.category_name || "N/A"}</span></div>
                <div className="pd-info-row"><span>Sub Category</span><span>{selectedProduct.sub_category_name || "N/A"}</span></div>
                <div className="pd-info-row"><span>Stock</span><span>{selectedProduct.quantity ?? "N/A"}</span></div>
                <div className="pd-info-row"><span>Sold</span><span>{selectedProduct.sold ?? 0}</span></div>
                <div className="pd-info-row"><span>VAT</span><span>{selectedProduct.vat ? `${selectedProduct.vat}%` : "N/A"}</span></div>
                <div className="pd-info-row"><span>Status</span>
                  <span className={`pd-status-badge ${selectedProduct.status === 1 || selectedProduct.status === "active" ? "active" : "inactive"}`}>
                    {selectedProduct.status === 1 || selectedProduct.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="pd-sidebar-card">
                <h4><FiTruck /> Shipping</h4>
                <div className="pd-info-row"><span>Width</span><span>{selectedProduct.width || "N/A"}</span></div>
                <div className="pd-info-row"><span>Height</span><span>{selectedProduct.height || "N/A"}</span></div>
                <div className="pd-info-row"><span>Weight</span><span>{selectedProduct.weight || "N/A"}</span></div>
                <div className="pd-info-row"><span>Shipping Cost</span><span>₹{Number(selectedProduct.shipping_cost || 0).toLocaleString()}</span></div>
              </div>

              {selectedProduct.tags && (
                <div className="pd-sidebar-card">
                  <h4><FiTag /> Tags</h4>
                  <div className="pd-tags">
                    {(Array.isArray(selectedProduct.tags) ? selectedProduct.tags : typeof selectedProduct.tags === "string" ? (() => { try { return JSON.parse(selectedProduct.tags); } catch { return selectedProduct.tags.split(","); } })() : []).map((tag, i) => (
                      <span className="pd-tag" key={i}>{typeof tag === "string" ? tag.trim() : tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsAdmin;
