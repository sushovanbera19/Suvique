import React from "react";
import "../assets/style/Footer.css";
import Visa from "../../public/images/visa.jfif";
import Mastercard from "../../public/images/mastercard.png";
import paypal from "../../public/images/paypal.png";
import Discover from "../../public/images/discover.png";


const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Column 1 */}
                <div className="footer-column">
                    <img src="/images/logo.png" alt="Logo" />
                    <div className="footer-text">
                        <p>Furnisy provides you with the essential</p>
                        <p>pieces to build a stunning online store for</p>
                        <p>your furniture business.</p>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="footer-column">
                    <h4>Home Decor Solutions</h4>
                    <ul>
                        <li><a href="/interior-designer">Interior Designer</a></li>
                        <li><a href="/analytics">Furniture Analytics</a></li>
                        <li><a href="/boutique-store">Boutique Furniture Store</a></li>
                    </ul>
                </div>

                {/* Column 3 */}
                <div className="footer-column">
                    <h4>Furnisy</h4>
                    <ul>
                        <li><a href="/about">About Furnisy</a></li>
                        <li><a href="/careers">Join Our Team</a></li>
                        <li><a href="/contact">Get in Touch</a></li>
                    </ul>
                </div>

                {/* Column 4 */}
                <div className="footer-column">
                    <h4>Resources</h4>
                    <ul>
                        <li><a href="/customers">Our Customers</a></li>
                        <li><a href="/smart-finance">Smart Furniture Finance</a></li>
                        <li><a href="/guides">Guides on Furniture Design</a></li>
                    </ul>
                </div>

                {/* Column 5 */}
                <div className="footer-column">
                    <h4>Our Features</h4>
                    <ul>
                        <li><a href="/interior-designer">Interior Designer</a></li>
                        <li><a href="/furniture-analytics">Furniture Analytics</a></li>
                        <li><a href="/boutique-store">Boutique Furniture Store</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="copyright">© 2025, All Rights Reserved by Furnisy Furniture</p>
                <div className="payment-methods">
                    <span>We accept:</span>
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
