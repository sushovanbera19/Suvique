import React, { useState } from "react";
import "../assets/style/Wishlist.css";
import { FaTimes } from "react-icons/fa";
import AccountHeader from "./AccountHeader";
import Reuseablebutton from "../Common/Commonbutton";
import product from "../../public/images/product 7.webp";

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([
        {
            id: 1,
            name: "Modern Dark Wood Chair",
            price: "$299.00",
            stock: "In Stock",
            image: product,
        },
        {
            id: 2,
            name: "Minimal Lounge Chair",
            price: "$199.00",
            stock: "In Stock",
            image: product,
        },
    ]);

    const removeItem = (id) => {
        setWishlistItems((prevItems) =>
            prevItems.filter((item) => item.id !== id)
        );
    };

    return (
        <>
            <AccountHeader />

            <div className="product-table">
                {/* Header */}
                <div className="product-header">
                    <span>Product Name</span>
                    <span>Price</span>
                    <span>Stock status</span>
                    <span></span>
                    <span></span>
                </div>

                {/* Rows */}
                {wishlistItems.length > 0 ? (
                    wishlistItems.map((item) => (
                        <div className="wishlist_product-row" key={item.id}>
                            <div className="wishlist_product-info">
                                <img src={item.image} alt={item.name} />
                                <span className="wishlist_product-name">{item.name}</span>
                            </div>

                            <div className="wishlist_product-price">{item.price}</div>

                            <div
                                className={`product-stock ${item.stock === "In Stock" ? "in-stock" : "out-stock"
                                    }`}
                            >
                                {item.stock}
                            </div>

                            <Reuseablebutton
                                text="Add to cart"
                                style={{
                                    backgroundColor: "#111",
                                    color: "#fff",
                                    padding: "20px 12px",   // less left & right gap
                                    borderRadius: "12px",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    width: "150px"
                                }}
                            />
                            <button
                                className="remove-btn"
                                onClick={() => removeItem(item.id)}
                                aria-label="Remove item"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{ padding: "40px", textAlign: "center", color: "red" }}>
                        Your wishlist is empty
                    </p>
                )}
            </div>
        </>
    );
};

export default Wishlist;