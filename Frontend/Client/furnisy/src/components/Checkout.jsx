import React, { useState } from "react";
import "../assets/style/CheckoutForm.css";
import AccountHeader from "./AccountHeader";
import Reuseablebutton from "../Common/Commonbutton";

export default function CheckoutForm() {
    const [shippingMethod, setShippingMethod] = useState("free");
    const [paymentMethod, setPaymentMethod] = useState("direct");
    const [agreeTerms, setAgreeTerms] = useState(false);

    return (
        <>
            <AccountHeader />
            <div className="container">
                <form className="form-wrapper">
                    <p className="info-text">
                        Returning customer? <a href="#">Click here to login</a>
                    </p>
                    <p className="info-text">
                        Have a coupon? <a href="#">Click here to enter your code</a>
                    </p>

                    <div className="field-row">
                        <div className="field">
                            <label htmlFor="firstName" className="label">
                                First name <span style={{ color: "red" }}>*</span>
                            </label>
                            <input id="firstName" type="text" required className="input" />
                        </div>
                        <div className="field">
                            <label htmlFor="lastName" className="label">
                                Last name <span style={{ color: "red" }}>*</span>
                            </label>
                            <input id="lastName" type="text" required className="input" />
                        </div>
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label htmlFor="email" className="label">
                                Email address <span style={{ color: "red" }}>*</span>
                            </label>
                            <input id="email" type="email" required className="input" />
                        </div>
                        <div className="field">
                            <label htmlFor="phone" className="label">
                                Phone <span style={{ color: "red" }}>*</span>
                            </label>
                            <input id="phone" type="tel" required className="input" />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="country" className="label">
                            Country/Region <span style={{ color: "red" }}>*</span>
                        </label>
                        <select id="country" required defaultValue="" className="Checkout_select">
                            <option value="" disabled>
                                Select a country
                            </option>
                            <option>United States</option>
                            <option>Canada</option>
                            <option>United Kingdom</option>
                            <option>Australia</option>
                        </select>
                    </div>

                    <div className="field">
                        <label htmlFor="city" className="label">
                            Town / City <span style={{ color: "red" }}>*</span>
                        </label>
                        <input id="city" type="text" required className="input" />
                    </div>

                    <div className="field">
                        <label htmlFor="street" className="label">
                            Street address <span style={{ color: "red" }}>*</span>
                        </label>
                        <input id="street" type="text" required className="input" />
                    </div>

                    <div className="field">
                        <label htmlFor="zip" className="label">
                            ZIP Code <span style={{ color: "red" }}>*</span>
                        </label>
                        <input id="zip" type="text" required className="input" />
                    </div>

                    <div className="field">
                        <label htmlFor="additional" className="label">
                            Additional information (optional)
                        </label>
                        <textarea id="additional" className="textarea" />
                    </div>

                    <div className="checkbox-wrapper">
                        <label>
                            <input type="checkbox" /> Create an account?
                        </label>
                    </div>
                </form>

                <div className="order-summary">
                    <div className="summary-top">
                        <Reuseablebutton
                            text="Your Order"
                            style={{
                                padding: "clamp(0.4rem, 0.9vw, 1.2rem) clamp(0.8rem, 3vw, 2.5rem)",
                                fontSize: "clamp(1rem, 2vw, 1.5rem)",
                                borderRadius: "0.5rem",
                                fontWeight: 300,
                                cursor: "pointer",
                                alignItems: "center",
                                gap: "0.5rem",
                                width: "100%",
                            }}
                        />

                        <div className="summary-row bold">
                            <div>Product</div>
                            <div>Subtotal</div>
                        </div>

                        <div className="summary-row">
                            <div className="product-info">
                                <img
                                    className="product-image"
                                    src="https://images.unsplash.com/photo-1567016543092-9b136507b062?auto=format&fit=crop&w=50&q=80"
                                    alt="Modern Tolik Chair"
                                />
                                <div className="product-details">
                                  <p  style={{fontSize: '25px',}}>Modern Tolik Chair</p> 
                                    <div style={{ fontSize: "12px", color: "#666", marginTop: 3 }}>
                                        Qty: 2
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontWeight: "600" }}>$350.00</div>
                        </div>

                        <div className="summary-row">
                            <div>Subtotal</div>
                            <div>$1000.00</div>
                        </div>

                        <div className="summary-row">
                            <div>Shipping</div>
                            <div>
                                <div className="radio-group">
                                    <label>
                                        <input
                                            type="radio"
                                            name="shipping"
                                            value="free"
                                            checked={shippingMethod === "free"}
                                            onChange={() => setShippingMethod("free")}
                                        />
                                        Free Shipping
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="shipping"
                                            value="fat"
                                            checked={shippingMethod === "fat"}
                                            onChange={() => setShippingMethod("fat")}
                                        />
                                        Fat Rate $10.00
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="summary-row bold">
                            <div>Total</div>
                            <div>$1025.00</div>
                        </div>
                    </div>

                    <div className="radio-group" style={{ marginTop: 10 }}>
                        <label>
                            <input
                                type="radio"
                                name="payment"
                                value="direct"
                                checked={paymentMethod === "direct"}
                                onChange={() => setPaymentMethod("direct")}
                            />
                            Direct bank transfer
                        </label>

                        {paymentMethod === "direct" && (
                            <div className="payment-instructions">
                                Make your payment directly into our bank account. Please your
                                Order ID as the payment reference. Your order will not be shipped
                                until the funds have cleared in our account.
                            </div>
                        )}

                        <label>
                            <input
                                type="radio"
                                name="payment"
                                value="check"
                                checked={paymentMethod === "check"}
                                onChange={() => setPaymentMethod("check")}
                            />
                            Check payments
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="payment"
                                value="cod"
                                checked={paymentMethod === "cod"}
                                onChange={() => setPaymentMethod("cod")}
                            />
                            Cash on delivery
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="payment"
                                value="paypal"
                                checked={paymentMethod === "paypal"}
                                onChange={() => setPaymentMethod("paypal")}
                            />
                            PayPal{" "}
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                                alt="PayPal"
                                style={{ height: 16, verticalAlign: "middle", marginLeft: 5 }}
                            />
                            <span
                                style={{
                                    fontSize: 12,
                                    marginLeft: 8,
                                    color: "#333",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                }}
                                title="What is PayPal?"
                            >
                                What is paypal?
                            </span>
                        </label>
                    </div>

                    <div className="terms-wrapper">
                        <label>
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={() => setAgreeTerms((prev) => !prev)}
                            />
                            I have read and agree to the website{" "}
                            <a href="#">terms and conditions</a>
                        </label>
                    </div>


                    <Reuseablebutton
                        text="Place Order"
                        style={{
                            padding: "clamp(0.4rem, 0.9vw, 1.2rem) clamp(0.8rem, 3vw, 2.5rem)",
                            fontSize: "clamp(1rem, 2vw, 1.5rem)",
                            borderRadius: "0.5rem",
                            fontWeight: 300,
                            cursor: "pointer",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}
                        disabled={!agreeTerms}
                    />

                </div>
            </div >
        </>
    );
}
