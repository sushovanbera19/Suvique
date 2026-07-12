import React, { useState, useEffect } from "react";
import "../assets/style/CheckoutForm.css";
import AccountHeader from "./AccountHeader";
import Reuseablebutton from "../Common/Commonbutton";

export default function CheckoutForm() {
    const [shippingMethod, setShippingMethod] = useState("free");
    const [paymentMethod, setPaymentMethod] = useState("direct");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressId, setAddressId] = useState(null);

    // const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        street: "",
        zip_code: "",
        additional_info: "",
    });
    useEffect(() => {
        fetchCart();
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/address", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (data.success) {
            setAddresses(data.data);

            if (data.data.length > 0) {
                setSelectedAddress(data.data[0].id);
            } else {
                setShowAddressForm(true);
            }
        }
    };
    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/cart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (data.success) {
                setCartItems(data.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.base_price) * item.quantity,
        0
    );

    const total = subtotal + (shippingMethod === "fat" ? 10 : 0);
    const saveAddress = async () => {

        const token = localStorage.getItem("token");

        const res = await fetch(
            "http://localhost:5000/api/address/add",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify(formData)
            }
        );

        const data = await res.json();

        if (data.success) {

            return data.addressId;

        }

        return null;

    }

   const placeOrder = async () => {

    const token = localStorage.getItem("token");

    let id = selectedAddress;

    if (!id) {

        id = await saveAddress();

        if (!id) return;

    }

    const res = await fetch(
        "http://localhost:5000/api/orders/place-order",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({

                address_id: id,
                payment_method: "Cash On Delivery"

            })
        }
    );

    const data = await res.json();

    if (data.success) {

        alert("Order placed successfully");

        window.location.href = "/";

    } else {

        alert(data.message);

    }

};

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };
    return (
        <>
            <AccountHeader />
            <div className="container">
                {addresses.length > 0 && (
                    <>
                        <div className="field">
                            <label>Saved Address</label>

                            <select
                                className="Checkout_select"
                                value={selectedAddress}
                                onChange={(e) => setSelectedAddress(e.target.value)}
                            >
                                {addresses.map(address => (
                                    <option
                                        key={address.id}
                                        value={address.id}
                                    >
                                        {address.first_name} {address.last_name} -
                                        {address.street}, {address.city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* <button
                            type="button"
                            onClick={() => setShowAddressForm(true)}
                        >
                            + Add New Address
                        </button> */}
                    </>
                )}
                {(addresses.length === 0 || showAddressForm) && (
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
                            <input id="first_name" type="text" required className="input" value={formData.first_name}
                                onChange={handleChange} />
                        </div>
                        <div className="field">
                            <label htmlFor="lastName" className="label">
                                Last name <span style={{ color: "red" }}>*</span>
                            </label>
                            <input id="last_name" type="text" required className="input" value={formData.last_name}
                                onChange={handleChange} />
                        </div>
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label htmlFor="email" className="label">
                                Email address <span style={{ color: "red" }}>*</span>
                            </label>
                            <input id="email" type="email" required className="input" value={formData.email}
                                onChange={handleChange} />
                        </div>
                        <div className="field">
                            <label htmlFor="phone" className="label">
                                Phone <span style={{ color: "red" }}>*</span>
                            </label>
                            <input id="phone" type="tel" required className="input" value={formData.phone}
                                onChange={handleChange} />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="country" className="label">
                            Country/Region <span style={{ color: "red" }}>*</span>
                        </label>
                        <select id="country" required defaultValue="" className="Checkout_select" value={formData.country}
                            onChange={handleChange}>
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
                        <input id="city" type="text" required className="input" value={formData.city}
                            onChange={handleChange} />
                    </div>

                    <div className="field">
                        <label htmlFor="street" className="label">
                            Street address <span style={{ color: "red" }}>*</span>
                        </label>
                        <input id="street" type="text" required className="input" value={formData.street}
                            onChange={handleChange} />
                    </div>

                    <div className="field">
                        <label htmlFor="zip" className="label">
                            ZIP Code <span style={{ color: "red" }}>*</span>
                        </label>
                        <input id="zip_code" type="text" required className="input" value={formData.zip_code}
                            onChange={handleChange} />
                    </div>

                    <div className="field">
                        <label htmlFor="additional" className="label">
                            Additional information (optional)
                        </label>
                        <textarea id="additional_info" className="textarea" value={formData.additional_info}
                            onChange={handleChange} />
                    </div>

                    <div className="checkbox-wrapper">
                        <label>
                            <input type="checkbox" /> Create an account?
                        </label>
                    </div>
                </form>
                )}

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
                        {cartItems.map((item) => (
                            <div className="summary-row" key={item.id}>
                                <div className="product-info">
                                    <img
                                        className="product-image"
                                        src={`http://localhost:5000/${item.main_image.replace(/\\/g, "/")}`}
                                        alt={item.product_name}
                                    />
                                    <div className="product-details">
                                        <p style={{ fontSize: '25px', }}> {item.product_name}</p>
                                        <div style={{ fontSize: "12px", color: "#666", marginTop: 3 }}>
                                            Qty: {item.quantity}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: "600" }}>  ${(Number(item.base_price) * item.quantity).toFixed(2)}</div>
                            </div>
                        ))}
                        <div className="summary-row">
                            <div>Subtotal</div>
                            <div>${subtotal.toFixed(2)}</div>
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
                            <div>${total.toFixed(2)}</div>
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
                        onClick={placeOrder}
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
