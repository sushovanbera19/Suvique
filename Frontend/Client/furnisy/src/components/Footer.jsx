import React, { useState, useEffect } from "react";
import "../assets/style/Footer.css";
import Visa from "../../public/images/visa.jfif";
import Mastercard from "../../public/images/mastercard.png";
import paypal from "../../public/images/paypal.png";
import Discover from "../../public/images/discover.png";
import { useTranslation } from "../context/LanguageContext";

const API = "http://localhost:5000";

const Footer = () => {
    const { t } = useTranslation();
    const [brand, setBrand] = useState(null);

    useEffect(() => {
        fetch(`${API}/api/site-brand`)
            .then((res) => res.json())
            .then((json) => { if (json.success && json.data) setBrand(json.data); })
            .catch(() => {});
    }, []);
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Column 1 */}
                <div className="footer-column">
                    {brand?.logo_path ? (
                        <img src={`${API}${brand.logo_path}`} alt={brand.brand_name || "Logo"} style={{ height: "100px", objectFit: "contain" }} />
                    ) : (
                        <img src="/images/logo.png" alt="Logo" style={{ height: "100px" }} />
                    )}
                    <div className="footer-text">
                        <p>{t("footer.aboutText1")}</p>
                        <p>{t("footer.aboutText2")}</p>
                        <p>{t("footer.aboutText3")}</p>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="footer-column">
                    <h4>{t("footer.homeDecor")}</h4>
                    <ul>
                        <li><a href="/interior-designer">{t("footer.interiorDesigner")}</a></li>
                        <li><a href="/analytics">{t("footer.furnitureAnalytics")}</a></li>
                        <li><a href="/boutique-store">{t("footer.boutiqueStore")}</a></li>
                    </ul>
                </div>

                {/* Column 3 */}
                <div className="footer-column">
                    <h4>{brand?.brand_name || "Suvique"}</h4>
                    <ul>
                        <li><a href="/about">{t("footer.aboutSuvique")}</a></li>
                        <li><a href="/careers">{t("footer.joinTeam")}</a></li>
                        <li><a href="/contact">{t("footer.getInTouch")}</a></li>
                    </ul>
                </div>

                {/* Column 4 */}
                <div className="footer-column">
                    <h4>{t("footer.resources")}</h4>
                    <ul>
                        <li><a href="/customers">{t("footer.ourCustomers")}</a></li>
                        <li><a href="/smart-finance">{t("footer.smartFinance")}</a></li>
                        <li><a href="/guides">{t("footer.designGuides")}</a></li>
                    </ul>
                </div>

                {/* Column 5 */}
                <div className="footer-column">
                    <h4>{t("footer.ourFeatures")}</h4>
                    <ul>
                        <li><a href="/interior-designer">{t("footer.interiorDesigner")}</a></li>
                        <li><a href="/furniture-analytics">{t("footer.furnitureAnalytics")}</a></li>
                        <li><a href="/boutique-store">{t("footer.boutiqueStore")}</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="copyright">{t("footer.copyright")}</p>
                <div className="payment-methods">
                    <span>{t("footer.weAccept")}</span>
                    <img src={Visa} alt="Visa" />
                    <img src={Mastercard} alt="Mastercard" />
                    <img src={paypal} alt="PayPal" />
                    <img src={Discover} alt="discover" />

                </div>
            </div>

        </footer>
    );
};

export default Footer;
