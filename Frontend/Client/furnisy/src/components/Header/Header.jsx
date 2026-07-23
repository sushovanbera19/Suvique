import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "../../assets/style/Header.css";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import SearchModal from "./SearchModal";
import MobileSidebar from "./MobileSidebar";
import { getMenuItems, rightMenuItems } from "./menuData";
import { useCountry } from "../../context/CountryContext";
import { useTranslation } from "../../context/LanguageContext";

const API = "http://localhost:5000";

const Header = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { selectedCountry, selectedLanguage } = useCountry();
    const { t } = useTranslation();
    const menuItems = getMenuItems(t);
    const [brand, setBrand] = useState(null);

    useEffect(() => {
        fetch(`${API}/api/site-brand`)
            .then((res) => res.json())
            .then((json) => { if (json.success && json.data) setBrand(json.data); })
            .catch(() => {});
    }, []);

    const dynamicRight = [
        {
            name: selectedCountry.iso2 || "IN",
            flag: selectedCountry.flag,
            subMenu: "country",
        },
        {
            name: selectedLanguage?.toUpperCase() || "EN",
            flag: null,
            subMenu: "language",
        },
        ...rightMenuItems,
    ];

    return (
        <header className="topHeader">
            <div className="hamburger" onClick={() => setSidebarOpen(true)}>
                <FontAwesomeIcon icon={faBars} />
            </div>
            <LeftMenu menuItems={menuItems} />
            <div className="center-logo">
                <Link to="/">
                    {brand?.logo_path ? (
                        <img src={`${API}${brand.logo_path}`} alt={brand.brand_name || "Suvique"} />
                    ) : (
                        <img src="/images/logo.png" alt="logo" />
                    )}
                </Link>
            </div>
            <RightMenu
                rightMenuItems={dynamicRight}
                openSearchModal={() => setSearchOpen(true)}
            />
            <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
            <MobileSidebar
                open={sidebarOpen}
                menuItems={menuItems}
                rightMenuItems={dynamicRight}
                onClose={() => setSidebarOpen(false)}
            />
        </header>
    );
};

export default Header;
