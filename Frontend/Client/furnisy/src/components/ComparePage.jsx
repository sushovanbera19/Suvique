import React from "react";
import "../assets/style/ComparePage.css";
import AccountHeader from "./AccountHeader";
import { FiEye } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import { useCountry } from "../context/CountryContext";
import { useTranslation } from "../context/LanguageContext";

const ProductCompare = () => {
  const navigate = useNavigate();
  const { compareIds, removeFromCompare, clearCompare } = useCompare();
  const { formatPrice } = useCountry();
  const { t } = useTranslation();

  if (compareIds.length === 0) {
    return (
      <>
        <AccountHeader title="Compare" breadcrumb="Home → Compare" />
        <section className="compare-section">
          <div className="compare-empty">
            <h2>{t("compare.noProducts")}</h2>
            <p>{t("compare.desc")}</p>
            <button className="cart-btn" onClick={() => navigate("/Shop-1")}>
              {t("compare.goToShop")}
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <AccountHeader title="Compare" breadcrumb="Home → Compare" />
      <section className="compare-section">
        <div className="compare-container">
          <div className="compare-topbar">
            <span>{compareIds.length} {t("compare.selected")}</span>
            <button className="clear-compare-btn" onClick={clearCompare}>{t("compare.clearAll")}</button>
          </div>

          <table className="compare-table">
            <tbody>
              <tr>
                <td className="compare-label">{t("cart.products")}</td>
                {compareIds.map((product) => (
                  <td key={product.id} className="product-column">
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCompare(product.id)}
                    >
                      <FaTrash /> {t("compare.remove")}
                    </button>

                    <div className="product-card">
                      <div className="product-image">
                        <img
                          src={`http://localhost:5000/${product.main_image?.replace(/\\/g, "/")}`}
                          alt={product.product_name}
                          loading="lazy"
                        />
                      </div>

                      <div className="product-info">
                        <span className="product-title">{product.product_name}</span>
                        <button
                          className="view-btn"
                          onClick={() => navigate(`/product-details-1/${product.id}`)}
                        >
                          <FiEye />
                        </button>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="compare-label">{t("compare.sku")}</td>
                {compareIds.map((product) => (
                  <td key={product.id}>{product.sku || "N/A"}</td>
                ))}
              </tr>

              <tr>
                <td className="compare-label">{t("compare.price")}</td>
                {compareIds.map((product) => (
                  <td key={product.id}>
                    {formatPrice(product.base_price)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="compare-label">{t("compare.availability")}</td>
                {compareIds.map((product) => (
                  <td key={product.id} className={product.quantity > 0 ? "stock" : "out-of-stock"}>
                    {product.quantity > 0 ? t("product.inStock") : t("product.outOfStock")}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="compare-label">{t("compare.category")}</td>
                {compareIds.map((product) => (
                  <td key={product.id}>{product.category_name || "N/A"}</td>
                ))}
              </tr>

              <tr>
                <td className="compare-label">{t("compare.addToCart")}</td>
                {compareIds.map((product) => (
                  <td key={product.id}>
                    <button
                      className="cart-btn"
                      onClick={() => navigate(`/product-details-1/${product.id}`)}
                    >
                      {t("compare.viewProduct")}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default ProductCompare;
