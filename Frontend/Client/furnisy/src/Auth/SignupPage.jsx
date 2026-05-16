// SignupPage.jsx
import React, { useState } from 'react';
import '../assets/style/SignupPage.css';
import contact from "../../public/images/contact-img.webp"
import AccountHeader from '../Common/AccountHeader';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false,
  });

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
      const res = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          agreeTerms: formData.agreeTerms ? 1 : 0,
        }),
      });

      const data = await res.json();

      console.log("Response:", data);

      if (res.ok) {
        setShowSuccess(true);
        setShowError(false);
      } else {
        setErrorMessage(data.message || "Signup failed");
        setShowError(true);
        setShowSuccess(false);
      }
    } catch (error) {
      console.log("Error:", error);
      setErrorMessage("Server error. Please try again.");
      setShowError(true);
    }
  };
  return (
    <>
      <AccountHeader />
      <div className="signup-container">
        <div className="signup-content">
          <div className="form-side">
            <h1>Create your account</h1>

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <label htmlFor="name">Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

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

                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "50px",
                      top: "55%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="agreeTerms">
                  I agree to all <a href="#terms">Terms & Conditions</a>
                </label>
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
              Already have an account? <a href="/login">Login</a>
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

                <h2>Success!</h2>
                <p>Account created successfully</p>

                <button
                  className="signup-modal-btn"
                  onClick={() => {
                    setShowSuccess(false);

                    // clear form
                    setFormData({
                      name: "",
                      email: "",
                      password: "",
                      agreeTerms: false,
                    });

                    setShowPassword(false);
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

                <h2>Failed!</h2>
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

export default SignupPage;