import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { toastSuccess, toastError } from "../../utils/toast";
import { useCountry } from "../../context/CountryContext";
import { useTranslation } from "../../context/LanguageContext";

const CartSidebar = ({ open, onClose, onUpdate }) => {
    const [cartItems, setCartItems] = useState([]);
    const { formatPrice } = useCountry();
    const { t } = useTranslation();

    useEffect(() => {
        if (open) {
            fetchCart();
        }
    }, [open]);

    if (!open) return null;

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

    const removeCart = async (productId) => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/cart/remove", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ product_id: productId }),
            });

            const data = await res.json();

            if (data.success) {
                toastSuccess("Removed from cart");
                setCartItems((prev) => prev.filter((item) => item.product_id !== productId));
                if (onUpdate) onUpdate();
            } else {
                toastError(data.message || "Failed to remove");
            }
        } catch (err) {
            console.log(err);
            toastError("Failed to remove from cart");
        }
    };

    const handleQtyChange = (id, type) => {
        setCartItems(prev =>
            prev.map(item => item.id === id ? { ...item, quantity: type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1) } : item)
        );
    };

    const subtotal = cartItems.reduce(
        (sum, item) =>
            sum + Number(item.base_price) * item.quantity,
        0
    );
    return (
        <div className="cart-sidebar-overlay" onClick={onClose} >
            <div className="cart-sidebar-right" onClick={(e) => e.stopPropagation()}>

                <div className="cart-header">
                    <div className="cart_sidebar_heading">
                        <h3> {t("cartSidebar.title")} </h3>
                        <span className="cart-sidebar-count">({cartItems.length} {cartItems.length !== 1 ? t("cartSidebar.items") : t("cartSidebar.item")})</span>
                    </div>
                    <div className="cart_sidebar_close-btn" onClick={onClose}>  <FontAwesomeIcon icon={faTimes} />   </div>
                </div>

                <ul className="cart-items">
                    {cartItems.length === 0 ? (
                        <li className="cart-empty-msg">{t("cartSidebar.empty")}</li>
                    ) : (
                        cartItems.map(item => (
                            <li key={item.id} className="cart-item">
                                <div className="cart-layout">
                                    <div className="cart_sidebar_image">
                                        <img src={`http://localhost:5000/${item.main_image.replace(/\\/g, "/")}`} alt={item.product_name} className="item-image" />
                                    </div>
                                    <div className="name">{item.product_name}</div>

                                    <div className="qty-price">
                                        <div className="qty-box">
                                            <button className="qty-btn" onClick={() => handleQtyChange(item.id, "dec")} >    -   </button>
                                            <span className="qty"> {item.quantity}</span>
                                            <button className="qty-btn" onClick={() => handleQtyChange(item.id, "inc")}   >
                                                +
                                            </button>
                                        </div>

                                        <span className="item-price">
                                            {formatPrice(item.base_price)}
                                        </span>
                                    </div>

                                    <div className="cart_sidebar_remove">
                                        <button className="cart_sidebar_remove-btn" onClick={() => removeCart(item.product_id)}>
                                             {t("cartSidebar.remove")}
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>

                <div className="cart-footer">
                    <div className="cart-subtotal">
                        <span>{t("cartSidebar.subtotal")}</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>

                    <div className="shipping-progress">
                        <div className="shipping-progress-bar"></div>
                    </div>

                    <Link to="/cart" className="cart_sidebar_viewcart">
                        {t("cartSidebar.viewCart")}
                    </Link>

                    <Link to="/checkout" className="cart_sidebar_checkout-btn">
                        {t("cartSidebar.checkOut")}
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default CartSidebar;
