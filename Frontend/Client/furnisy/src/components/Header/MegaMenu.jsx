import { Link, useNavigate } from "react-router-dom";
import { toastError } from "../../utils/toast";
import { useTranslation } from "../../context/LanguageContext";

const MegaMenu = ({ megaMenu }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLayoutClick = async (layout) => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        navigate(`/product-details-${layout}/${data.data[0].id}`);
      } else {
        toastError(t("common.noProducts"));
      }
    } catch (err) {
      console.error(err);
      toastError("Failed to load product");
    }
  };

  return (
    <div className="mega-dropdown">
      {megaMenu.map((col, idx) => (
        <div key={idx} className="mega-column">
          {col.title && <h4>{col.title}</h4>}

          {col.links && (
            <ul className="mega-links">
              {col.links.map((link, lIdx) => (
                <li key={lIdx}>
                  {link.layout ? (
                    <button
                      className="mega-layout-btn"
                      onClick={() => handleLayoutClick(link.layout)}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link to={link.path}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          )}

          {col.products && (
            <ul className="mega-products">
              {col.products.map((p, pIdx) => (
                <li key={pIdx} className="mega-product-item">
                  <img src={p.img} alt={p.name} />

                  <div className="product-info">
                    <p className="product-name">{p.name}</p>
                    <span className="product-price">
                      {p.price}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {col.offer && (
            <div className="mega-offer">
              {col.offer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MegaMenu;
