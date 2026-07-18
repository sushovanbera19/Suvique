import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FiUser, FiPackage, FiTruck, FiLogOut } from "react-icons/fi";
import Dropdown from "./Dropdown";
import CartSidebar from "./CartSidebar";
import { useCountry } from "../../context/CountryContext";
import { useTranslation } from "../../context/LanguageContext";

const API = "http://localhost:5000";

const RightMenu = ({ rightMenuItems, openSearchModal }) => {
    const [openRightMenu, setOpenRightMenu] = useState(null);
    const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [countrySearch, setCountrySearch] = useState("");
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
    const [imgVersion, setImgVersion] = useState(Date.now());
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { t } = useTranslation();
    const profileRef = useRef(null);
    const {
        countries,
        selectedCountry,
        setSelectedCountry,
        selectedLanguage,
        setSelectedLanguage,
        languages,
    } = useCountry();

    const profileImgSrc = user?.id
        ? `${API}/api/users/profile/image/${user.id}?v=${imgVersion}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}`;

    const fetchCartCount = async () => {
        try {
            const tk = token || localStorage.getItem("token");
            if (!tk) return;
            const res = await fetch(`${API}/api/cart`, {
                headers: { Authorization: `Bearer ${tk}` },
            });
            const data = await res.json();
            if (data.success) {
                const count = data.data.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(count);
            }
        } catch { /* silent */ }
    };

    useEffect(() => {
        fetchCartCount();
        window.addEventListener("storage", fetchCartCount);
        window.addEventListener("cartUpdated", fetchCartCount);
        return () => {
            window.removeEventListener("storage", fetchCartCount);
            window.removeEventListener("cartUpdated", fetchCartCount);
        };
    }, []);

    useEffect(() => {
        const sync = () => setUser(JSON.parse(localStorage.getItem("user") || "null"));
        const onProfileUpdate = () => {
            setUser(JSON.parse(localStorage.getItem("user") || "null"));
            setImgVersion(Date.now());
        };
        window.addEventListener("storage", sync);
        window.addEventListener("profileUpdated", onProfileUpdate);
        return () => {
            window.removeEventListener("storage", sync);
            window.removeEventListener("profileUpdated", onProfileUpdate);
        };
    }, []);

    useEffect(() => {
        if (!openRightMenu) return;
        const handleClickOutside = (e) => {
            if (!e.target.closest(".right-menu")) {
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
        setOpenRightMenu(null);
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
                                className={selectedCountry.iso2 === c.iso2 ? "country-item active" : "country-item"}
                                onClick={() => {
                                    setSelectedCountry(c);
                                    setOpenRightMenu(null);
                                    setCountrySearch("");
                                }}
                            >
                                <img src={c.flag} alt={c.name} className="country-flag-img" />
                                <span className="country-name">{c.name}</span>
                                <span className="country-currency">{c.currency}</span>
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
                            className={selectedLanguage === lang.code ? "lang-item active" : "lang-item"}
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
                        <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={openSearchModal} />
                    </li>
                    {rightMenuItems.map((item, index) => (
                        <li
                            key={index}
                            className={item.subMenu ? "has-dropdown" : ""}
                            onMouseEnter={() => item.subMenu && setOpenRightMenu(item.name)}
                            onMouseLeave={() => {
                                if (item.subMenu === "country") return;
                                setOpenRightMenu(null);
                            }}
                        >
                            {item.flag && (
                                <img src={item.flag} className="currency-flag" alt="flag" />
                            )}
                            {item.img && item.path ? (
                                item.path === "/login" ? (
                                    token && user ? (
                                        <div
                                            ref={profileRef}
                                            className="profile-wrapper"
                                            onMouseEnter={() => setOpenRightMenu("profile")}
                                            onMouseLeave={() => setOpenRightMenu(null)}
                                        >
                                            <img
                                                src={profileImgSrc}
                                                className="right-icon-image profile-image"
                                                alt="profile"
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}`;
                                                }}
                                            />
                                            {openRightMenu === "profile" && (
                                                <ul className="dropdown">
                                                    <li className="profile-header-item">
                                                        {/* <img
                                                            src={profileImgSrc}
                                                            className="profile-dropdown-avatar"
                                                            alt="profile"
                                                            onError={(e) => {
                                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}`;
                                                            }}
                                                        />*/}
                                                        {/* <div>
                                                            <p className="profile-dropdown-name">{user.name}</p>
                                                             <p className="profile-dropdown-email">{user.email}</p>
                                                        </div>*/}
                                                    </li>
                                                    {/* <li className="profile-divider-item"></li>*/}
                                                    <li>
                                                        <Link to="/profile" onClick={() => setOpenRightMenu(null)}>
                                                            <FiUser /> {t("menu.profile")}
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/orders" onClick={() => setOpenRightMenu(null)}>
                                                            <FiPackage /> {t("menu.myOrders")}
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/track-order" onClick={() => setOpenRightMenu(null)}>
                                                            <FiTruck /> {t("menu.trackOrder")}
                                                        </Link>
                                                    </li>
                                                    <li className="profile-divider-item"></li>
                                                    <li>
                                                        <button className="profile-logout-btn" onClick={handleLogout}>
                                                            <FiLogOut /> {t("menu.logout")}
                                                        </button>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    ) : (
                                        <Link to="/login">
                                            <img src={item.img} className="right-icon-image" alt="login" />
                                        </Link>
                                    )
                                ) : item.path === "/cart" ? (
                                    <div className="cart-icon-wrapper" onClick={() => setCartSidebarOpen(true)}>
                                        <img src={item.img} className="right-icon-image cart-icon" alt="cart" />
                                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                                    </div>
                                ) : (
                                    <Link to={item.path}>
                                        <img src={item.img} className="right-icon-image" alt="icon" />
                                    </Link>
                                )
                            ) : (
                                item.name
                            )}
                            {item.subMenu && <FontAwesomeIcon icon={faAngleDown} className="arrow" />}
                            {item.subMenu && openRightMenu === item.name && renderDropdownContent(item)}
                        </li>
                    ))}
                </ul>
            </nav>
            <CartSidebar open={cartSidebarOpen} onClose={() => setCartSidebarOpen(false)} onUpdate={fetchCartCount} />
        </>
    );
};

export default RightMenu;
