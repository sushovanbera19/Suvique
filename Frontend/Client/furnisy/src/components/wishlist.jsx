import { useState, useEffect } from "react";
import "../assets/style/Wishlist.css";
import { FaTimes } from "react-icons/fa";
import AccountHeader from "./AccountHeader";
import Reuseablebutton from "../Common/Commonbutton";

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);

    const removeItem = async (productId) => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:5000/api/wishlist/remove", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    product_id: productId,
                }),
            });

            const data = await res.json();

            if (data.success) {
                fetchWishlist();
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/wishlist", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (data.success) {
            setWishlistItems(data.data);
        }
    };
    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please login first");
                return;
            }

            const res = await fetch("http://localhost:5000/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    product_id: productId,
                }),
            });

            const data = await res.json();

            if (data.success) {
                alert(data.message);

            } else {
                alert(data.message);
            }
        } catch (err) {
            console.log(err);
        }
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
                                <img src={`http://localhost:5000/${item.main_image.replace(/\\/g, "/")}`}
                                    alt={item.product_name} />
                                <span className="wishlist_product-name">{item.product_name}</span>
                            </div>

                            <div className="wishlist_product-price">{item.base_price}</div>

                            <div className={`product-stock ${item.stock === "In Stock" ? "in-stock" : "out-stock"}`}  >
                                {item.quantity > 0 ? "In Stock" : "Out of Stock"}
                            </div>

                            <Reuseablebutton text="Add to cart" onClick={() => addToCart(item.product_id)} style={{
                                backgroundColor: "#111", color: "#fff", padding: "20px 12px", borderRadius: "12px", fontSize: "16px", cursor: "pointer", width: "150px"
                            }} />
                            <button className="remove-btn" onClick={() => removeItem(item.product_id)} aria-label="Remove item"    >
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