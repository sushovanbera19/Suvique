import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "./Dropdown";
import CartSidebar from "./CartSidebar";
import { useCountry } from "../../context/CountryContext";
import { useTranslation } from "../../context/LanguageContext";

const RightMenu = ({ rightMenuItems, openSearchModal }) => {
    const [openRightMenu, setOpenRightMenu] = useState(null);
    const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [countrySearch, setCountrySearch] = useState("");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {
        countries,
        selectedCountry,
        setSelectedCountry,
        selectedLanguage,
        setSelectedLanguage,
        languages,
    } = useCountry();

    const fetchCartCount = async () => {
        try {
            const t = token || localStorage.getItem("token");
            if (!t) return;
            const res = await fetch("http://localhost:5000/api/cart", {
                headers: { Authorization: `Bearer ${t}` },
            });
            const data = await res.json();
            if (data.success) {
                const count = data.data.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                );
                setCartCount(count);
            }
        } catch {
            /* silently fail */
        }
    };

    useEffect(() => {
        fetchCartCount();
        const handleStorageChange = () => fetchCartCount();
        const handleCartUpdate = () => fetchCartCount();
        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("cartUpdated", handleCartUpdate);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("cartUpdated", handleCartUpdate);
        };
    }, []);

    useEffect(() => {
        if (!openRightMenu) return;
        const handleClickOutside = (e) => {
            if (!e.target.closest(".has-dropdown")) {
                setOpenRightMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openRightMenu]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setCartCount(0);
        navigate("/");
        window.location.reload();
    };

    const filteredCountries = countries.filter(
        (c) =>
            c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
            c.iso2.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const renderDropdownContent = (item) => {
        if (item.subMenu === "country") {
            return (
                <div className="dropdown country-dropdown">
                    <div className="country-search-wrapper">
                        <input
                            type="text"
                            className="country-search-input"
                            placeholder={t("menu.searchCountry")}
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <ul className="country-list">
                        {filteredCountries.map((c) => (
                            <li
                                key={c.iso2}
                                className={
                                    selectedCountry.iso2 === c.iso2
                                        ? "country-item active"
                                        : "country-item"
                                }
                                onClick={() => {
                                    setSelectedCountry(c);
                                    setOpenRightMenu(null);
                                    setCountrySearch("");
                                }}
                            >
                                <img
                                    src={c.flag}
                                    alt={c.name}
                                    className="country-flag-img"
                                />
                                <span className="country-name">{c.name}</span>
                                <span className="country-currency">
                                    {c.currency}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }

        if (item.subMenu === "language") {
            return (
                <ul className="dropdown">
                    {languages.map((lang) => (
                        <li
                            key={lang.code}
                            className={
                                selectedLanguage === lang.code
                                    ? "lang-item active"
                                    : "lang-item"
                            }
                            onClick={() => {
                                setSelectedLanguage(lang.code);
                                setOpenRightMenu(null);
                            }}
                        >
                            {lang.name}
                        </li>
                    ))}
                </ul>
            );
        }

        return <Dropdown items={item.subMenu} />;
    };

    return (
        <>
            <nav className="right-menu">
                <ul>
                    <li className="search-item">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="search-icon"
                            onClick={openSearchModal}
                        />
                    </li>
                    {rightMenuItems.map((item, index) => (
                        <li
                            key={index}
                            className={
                                item.subMenu ? "has-dropdown" : ""
                            }
                            onMouseEnter={() =>
                                item.subMenu && setOpenRightMenu(item.name)
                            }
                            onMouseLeave={() => {
                                if (item.subMenu === "country") return;
                                setOpenRightMenu(null);
                            }}
                        >
                            {item.flag && (
                                <img
                                    src={item.flag}
                                    className="currency-flag"
                                    alt="flag"
                                />
                            )}
                            {item.img && item.path ? (
                                item.path === "/login" ? (
                                    token && user ? (
                                        <div
                                            className="profile-wrapper"
                                            onMouseEnter={() =>
                                                setOpenRightMenu("profile")
                                            }
                                            onMouseLeave={() =>
                                                setOpenRightMenu(null)
                                            }
                                        >
                                            <img
                                                src={
                                                    user.profileImage ||
                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                        user.name || "User"
                                                    )}`
                                                }
                                                className="right-icon-image profile-image"
                                                alt="profile"
                                            />
                                            {openRightMenu === "profile" && (
                                                <div className="profile-dropdown">
                                                    <Link to="/profile">
                                                        {t("menu.profile")}
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                    >
                                                        {t("menu.logout")}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link to="/login">
                                            <img
                                                src={item.img}
                                                className="right-icon-image"
                                                alt="login"
                                            />
                                        </Link>
                                    )
                                ) : item.path === "/cart" ? (
                                    <div
                                        className="cart-icon-wrapper"
                                        onClick={() =>
                                            setCartSidebarOpen(true)
                                        }
                                    >
                                        <img
                                            src={item.img}
                                            className="right-icon-image cart-icon"
                                            alt="cart"
                                        />
                                        {cartCount > 0 && (
                                            <span className="cart-badge">
                                                {cartCount}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <Link to={item.path}>
                                        <img
                                            src={item.img}
                                            className="right-icon-image"
                                            alt="icon"
                                        />
                                    </Link>
                                )
                            ) : (
                                item.name
                            )}
                            {item.subMenu && (
                                <FontAwesomeIcon
                                    icon={faAngleDown}
                                    className="arrow"
                                />
                            )}
                            {item.subMenu &&
                                openRightMenu === item.name &&
                                renderDropdownContent(item)}
                        </li>
                    ))}
                </ul>
            </nav>
            <CartSidebar
                open={cartSidebarOpen}
                onClose={() => setCartSidebarOpen(false)}
                onUpdate={fetchCartCount}
            />
        </>
    );
};

export default RightMenu;
