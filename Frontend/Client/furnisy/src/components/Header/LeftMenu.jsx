import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toastError } from "../../utils/toast";
import { useTranslation } from "../../context/LanguageContext";

import Dropdown from "./Dropdown";
import MegaMenu from "./MegaMenu";

const LeftMenu = ({ menuItems }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleProductPage = async (layout) => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();

    if (data.success && data.data.length > 0) {
      navigate(`/product-details-${layout}/${data.data[0].id}`);
    } else {
      toastError(t("common.noProducts"));
    }
  };
  return (
    <nav className="left-menu">
      <ul>
        {menuItems.map((item, idx) => (
          <li key={idx} className={item.subMenu || item.megaMenu ? "has-dropdown" : ""}
            onMouseEnter={() => setOpenMenu(item.name)}
            onMouseLeave={() => setOpenMenu(null)}>
            {item.path ? (
              <Link to={item.path}>{item.name}</Link>
            ) : (
              item.name
            )}

            {(item.subMenu || item.megaMenu) && (
              <FontAwesomeIcon icon={faAngleDown} className="arrow" />
            )}

            {item.subMenu &&
              openMenu === item.name && (
                <Dropdown items={item.subMenu} />
              )}

            {item.megaMenu &&
              openMenu === item.name && (
                <MegaMenu megaMenu={item.megaMenu} />
              )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default LeftMenu;