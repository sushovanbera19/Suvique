import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useCountry } from "../../context/CountryContext";
import { useTranslation } from "../../context/LanguageContext";

const MobileSidebar = ({ open, menuItems, rightMenuItems, onClose }) => {
    const [active, setActive] = useState(null);
    const [countrySearch, setCountrySearch] = useState("");
    const { countries, selectedCountry, setSelectedCountry, selectedLanguage, setSelectedLanguage, languages } = useCountry();
    const { t } = useTranslation();

    const toggleMenu = (name) => {
        setActive(active === name ? null : name);
    };

    const filteredCountries = countries.filter(
        (c) =>
            c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
            c.iso2.toLowerCase().includes(countrySearch.toLowerCase())
    );

    return (
        <>
            <div className={`sidebar-overlay ${open ? "active" : ""}`} onClick={onClose} />
            <div className={`mobile-sidebar ${open ? "open" : ""}`}>
                <div className="close-sidebar" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <div className="mobile-menu-title" onClick={() => (item.subMenu || item.megaMenu) && toggleMenu(item.name)}>
                                {
                                    item.path ?
                                        <Link to={item.path} onClick={onClose}>
                                            {item.name}
                                        </Link>
                                        :
                                        item.name
                                }
                                {
                                    (item.subMenu || item.megaMenu)
                                    &&
                                    <FontAwesomeIcon icon={faAngleDown} className={active === item.name ? "rotate" : ""} />
                                }
                            </div>
                            {
                                active === item.name &&
                                <ul className="sidebar-submenu open">
                                    {
                                        item.subMenu &&
                                        item.subMenu.map((sub, i) => (
                                            <li key={i}>
                                                <Link to={sub.path} onClick={onClose}>
                                                    {sub.label}
                                                </Link>
                                            </li>
                                        ))
                                    }
                                    {
                                        item.megaMenu &&
                                        item.megaMenu.map((col, i) => (
                                            <li key={i}>
                                                {col.title && <strong>{col.title}</strong>}
                                                {col.links && (
                                                    <ul>
                                                        {col.links.map((link, j) => (
                                                            <li key={j}>
                                                                <Link to={link.path} onClick={onClose}>
                                                                    {link.label}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))
                                    }
                                </ul>
                            }
                        </li>
                    ))}
                    <hr />

                    {rightMenuItems
                        .filter((item) => item.subMenu)
                        .map((item, index) => (
                            <li key={index}>
                                <div className="mobile-menu-title" onClick={() => toggleMenu(item.name)}>
                                    {item.flag && (
                                        <img
                                            src={item.flag}
                                            alt="flag"
                                            className="currency-flag"
                                            style={{ width: 20, height: 14, marginRight: 8, borderRadius: 2 }}
                                        />
                                    )}
                                    {item.name}
                                    <FontAwesomeIcon
                                        icon={faAngleDown}
                                        className={active === item.name ? "rotate" : ""}
                                    />
                                </div>
                                {active === item.name && (
                                    <>
                                        {item.subMenu === "country" && (
                                            <ul className="sidebar-submenu open">
                                                <li style={{ padding: "8px 16px" }}>
                                                    <input
                                                        type="text"
                                                        placeholder={t("menu.searchCountry") || "Search country..."}
                                                        value={countrySearch}
                                                        onChange={(e) => setCountrySearch(e.target.value)}
                                                        style={{
                                                            width: "100%",
                                                            padding: "8px 12px",
                                                            border: "1px solid #e2e8f0",
                                                            borderRadius: 8,
                                                            fontSize: 14,
                                                        }}
                                                    />
                                                </li>
                                                <li style={{ maxHeight: 250, overflowY: "auto" }}>
                                                    <ul>
                                                        {filteredCountries.map((c) => (
                                                            <li
                                                                key={c.iso2}
                                                                onClick={() => {
                                                                    setSelectedCountry(c);
                                                                    setCountrySearch("");
                                                                    setActive(null);
                                                                }}
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: 10,
                                                                    padding: "8px 16px",
                                                                    cursor: "pointer",
                                                                    background: selectedCountry.iso2 === c.iso2 ? "#f0f0ff" : "transparent",
                                                                }}
                                                            >
                                                                <img
                                                                    src={c.flag}
                                                                    alt={c.name}
                                                                    style={{ width: 20, height: 14, borderRadius: 2 }}
                                                                />
                                                                <span>{c.name}</span>
                                                                <span style={{ color: "#94a3b8", fontSize: 12, marginLeft: "auto" }}>
                                                                    {c.currency}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            </ul>
                                        )}

                                        {item.subMenu === "language" && (
                                            <ul className="sidebar-submenu open" style={{ maxHeight: 250, overflowY: "auto" }}>
                                                {languages.map((lang) => (
                                                    <li
                                                        key={lang.code}
                                                        onClick={() => {
                                                            setSelectedLanguage(lang.code);
                                                            setActive(null);
                                                        }}
                                                        style={{
                                                            padding: "10px 16px",
                                                            cursor: "pointer",
                                                            background: selectedLanguage === lang.code ? "#f0f0ff" : "transparent",
                                                            fontWeight: selectedLanguage === lang.code ? 600 : 400,
                                                        }}
                                                    >
                                                        {lang.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                )}
                            </li>
                        ))}
                </ul>
            </div>
        </>
    );
};

export default MobileSidebar;
