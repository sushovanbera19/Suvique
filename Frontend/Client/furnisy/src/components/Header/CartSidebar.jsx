import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";


const CartSidebar = ({ open, onClose }) => {
    const [cartItems, setCartItems] = useState([]);

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
                        <h3> Shopping cart </h3>
                    </div>
                    <div className="cart_sidebar_close-btn" onClick={onClose}>  <FontAwesomeIcon icon={faTimes} />   </div>
                </div>

                <ul className="cart-items">
                    {cartItems.map(item => (
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
                                        ${Number(item.base_price).toFixed(2)}
                                    </span>
                                </div>

                                <div className="cart_sidebar_remove">
                                    <button className="cart_sidebar_remove-btn" onClick={() => removeCart(item.product_id)}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="cart-footer">
                    <div className="cart-subtotal">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="shipping-progress">
                        <div className="shipping-progress-bar"></div>
                    </div>

                    <Link to="/cart" className="cart_sidebar_viewcart">
                        View Cart
                    </Link>

                    <Link to="/checkout" className="cart_sidebar_checkout-btn">
                        Check Out
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default CartSidebar;