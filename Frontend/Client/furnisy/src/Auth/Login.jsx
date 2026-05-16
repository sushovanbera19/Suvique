// SignupPage.jsx
import React, { useState } from 'react';
import '../assets/style/SignupPage.css';
import contact from "../../public/images/contact-img.webp"
import AccountHeader from '../Common/AccountHeader';
import { useNavigate } from 'react-router-dom'; // add this

function LoginPage() {
    const navigate = useNavigate(); // add this
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
        <> <AccountHeader />
            <div className="signup-container">
                <div className="signup-content">
                    <div className="form-side">
                        <h1>Login your account</h1>

                        <form onSubmit={handleSubmit} className="signup-form">
                            <div className="form-group">
                                <label htmlFor="email">Email*</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password*</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Create password"
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
                                    I agree to all <a href="#terms">Terms & Conditions</a>
                                </label>

                                {/* Right: Lost password link */}
                                <a
                                    href="/reset-password"
                                    style={{ color: "#070707", textDecoration: "none" }}
                                >
                                    Lost your password?
                                </a>
                            </div>




                            <button type="submit" className="signup-btn">
                                Sign Up
                            </button>
                        </form>

                        <div className="divider">
                            <span>Or Sign Up With</span>
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
                            New customer?  <a href="/register">Sign up</a>
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

                                <h2>Login Success!</h2>
                                <p>Welcome back 🎉</p>

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
                                    CONTINUE
                                </button>

                            </div>
                        </div>
                    )}
                    {showError && (
                        <div className="signup-modal-overlay">
                            <div className="signup-modal-box signup-error-box">

                                <div className="signup-modal-icon signup-error-icon">✖</div>

                                <h2>Login Failed!</h2>
                                <p>{errorMessage}</p>

                                <button
                                    className="signup-modal-btn signup-error-btn"
                                    onClick={() => setShowError(false)}
                                >
                                    TRY AGAIN
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