// SignupPage.jsx
import React, { useState } from 'react';
import '../assets/style/SignupPage.css';
import contact from "../../public/images/contact-img.webp"
import AccountHeader from '../Common/AccountHeader';
import { useNavigate } from 'react-router-dom'; // add this
import { useTranslation } from "../context/LanguageContext";

function LoginPage() {
    const navigate = useNavigate(); // add this
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        agreeTerms: false,
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
                setShowSuccess(true);
                setShowError(false);
                // CLEAR INPUTS AFTER SUCCESS
                setFormData({
                    email: "",
                    password: "",
                    agreeTerms: false,
                });
            } else {
                setErrorMessage(data.message || "Login failed");
                setShowError(true);
                setShowSuccess(false);
            }
        } catch (error) {
            setErrorMessage("Server error. Please try again.");
            setShowError(true);
        }
    };

    return (
        <> <AccountHeader title="Login" breadcrumb="Home → Login" />
            <div className="signup-container">
                <div className="signup-content">
                    <div className="form-side">
                        <h1>{t("login.heading")}</h1>

                        <form onSubmit={handleSubmit} className="signup-form">
                            <div className="form-group">
                                <label htmlFor="email">{t("login.email")}</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder={t("login.emailPlaceholder")}
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">{t("login.password")}</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder={t("login.passwordPlaceholder")}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div
                                className="form-group checkbox-group"
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "95%",
                                }}
                            >
                                {/* Left: Checkbox + Label */}
                                <label
                                    htmlFor="agreeTerms"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px", // space between checkbox and text
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        id="agreeTerms"
                                        name="agreeTerms"
                                        checked={formData.agreeTerms}
                                        onChange={handleChange}
                                        required
                                    />
                                    {t("login.agreePrefix")} <a href="#terms">{t("login.terms")}</a>
                                </label>

                                {/* Right: Lost password link */}
                                <a
                                    href="/reset-password"
                                    style={{ color: "#070707", textDecoration: "none" }}
                                >
                                {t("login.forgotPassword")}
                                </a>
                            </div>




                            <button type="submit" className="signup-btn">
                                {t("login.signIn")}
                            </button>
                        </form>

                        <div className="divider">
                            <span>{t("login.orSignup")}</span>
                        </div>

                        <div className="social-buttons">
                            <button className="social-btn google">
                                <span className="icon">G</span> Google
                            </button>
                            <button className="social-btn facebook">
                                <span className="icon">f</span> Facebook
                            </button>
                        </div>

                        <p className="login-link">
                            {t("login.newCustomer")}  <a href="/register">{t("login.signupLink")}</a>
                        </p>
                    </div>

                    <div className="image-side">
                        {/* You can replace with your own image or use one from Unsplash/etc */}
                        <img
                            src={contact}
                            alt="Modern wooden dining table with chairs and pendant light"
                        />
                    </div>
                    {showSuccess && (
                        <div className="signup-modal-overlay">
                            <div className="signup-modal-box">

                                <div className="signup-modal-icon">✔</div>

                                <h2>{t("login.successTitle")}</h2>
                                <p>{t("login.welcomeBack")} 🎉</p>

                                <button
                                    className="signup-modal-btn"
                                    onClick={() => {
                                        setShowSuccess(false);

                                        setFormData({
                                            email: "",
                                            password: "",
                                            agreeTerms: false,
                                        });
                                        navigate("/"); // redirect to home page
                                    }}
                                >
                                    {t("login.continue")}
                                </button>

                            </div>
                        </div>
                    )}
                    {showError && (
                        <div className="signup-modal-overlay">
                            <div className="signup-modal-box signup-error-box">

                                <div className="signup-modal-icon signup-error-icon">✖</div>

                                <h2>{t("login.failedTitle")}</h2>
                                <p>{errorMessage}</p>

                                <button
                                    className="signup-modal-btn signup-error-btn"
                                    onClick={() => setShowError(false)}
                                >
                                    {t("login.tryAgain")}
                                </button>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default LoginPage;