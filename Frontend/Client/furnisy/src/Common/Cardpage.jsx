import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../assets/style/Cardpage.css';
import AccountHeader from './AccountHeader';
import ProductCard from "./ProductCard";


const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shipping, setShipping] = useState("free");
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((total, item) => {
    return total + Number(item.base_price) * item.quantity;
  }, 0);

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };


  useEffect(() => {
    fetchCart();
  }, []);

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

      const res = await fetch(
        "http://localhost:5000/api/cart/remove",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: productId,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchCart();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const relatedProducts = [
    {
      id: 1,
      name: "Wooden Lounge Chair",
      price: "$180.00",
      img: "/images/detail2.webp",
      tag: "Sale",
    },
    {
      id: 2,
      name: "Classic Arm Chair",
      price: "$250.00",
      img: "/images/detail3.webp",
      tag: "New",
    },
    {
      id: 3,
      name: "Modern Fabric Chair",
      price: "$199.00",
      img: "/images/detail4.webp",
    },
    {
      id: 4,
      name: "Modern Fabric Chair",
      price: "$200.00",
      img: "/images/img-1.webp",
    },
  ];


  return (
    <>
      <AccountHeader />
      <div className="cart-wrapper">
        <div className="cart-grid">

          {/* LEFT - Products */}
          {/* LEFT - Products */}
          <div className="products-panel">

            {/* Table Header */}
            <div className="table-header">
              <div>Products</div>
              <div>Price</div>
              <div>Quantity</div>
              <div>Subtotal</div>
              <div></div> {/* Remove column */}
            </div>

            {/* Product Row */}
            {cartItems.map((item) => (
              <div className="product-item" key={item.id}>
                <div className="product-cell product-info-cell">
                  <div className="product-thumb">
                    <img
                      src={`http://localhost:5000/${item.main_image.replace(/\\/g, "/")}`}
                      alt={item.product_name}
                    />
                  </div>
                  <div className="product-name"> {item.product_name}</div>
                </div>

                <div className="product-cell price-cell">
                  ${Number(item.base_price).toFixed(2)}
                </div>

                <div className="product-cell quantity-cell">
                  <div className="qty-wrapper">
                    <button
                      className="qty-btn minus"
                      onClick={() => decreaseQty(item.id)}
                    >−</button>
                    <span className="qty-display"> {item.quantity}</span>
                    <button
                      className="qty-btn plus"
                      onClick={() => increaseQty(item.id)}
                    >+</button>
                  </div>
                </div>

                <div className="product-cell subtotal-cell">
                  ${(Number(item.base_price) * item.quantity).toFixed(2)}
                </div>

                <div className="product-cell remove-cell">
                  <button className="remove-icon" onClick={() => removeCart(item.product_id)}>×</button>
                </div>
              </div>
            ))}

            {/* Coupon Section - outside product-item */}
            <div className='coupon_section' >
              <div className="left-action">
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="coupon-field"
                />
                <button className="apply-coupon-btn">Apply coupon</button>
              </div>
              {/* Right: continue shopping */}
              < div className="right-action" >
                <button className="continue-shopping-btn">Continue Shopping</button>
              </div>
            </div>

          </div>

          {/* RIGHT - Totals */}
          <div className="totals-panel">
            <div className="totals-box">
              <h3>Cart Totals</h3>

              <div className="totals-line">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="shipping-section">

                <div className="shipping-options">
                  <label className="shipping-label">
                    <input
                      type="radio"
                      name="shipping"
                      value="free"
                      checked={shipping === 'free'}
                      onChange={() => setShipping('free')}
                    />
                    Free Shipping
                  </label>

                  <label className="shipping-label">
                    <input
                      type="radio"
                      name="shipping"
                      value="flat"
                      checked={shipping === 'flat'}
                      onChange={() => setShipping('flat')}
                    />
                    Flat Rate $10.00
                  </label>
                </div>


                <div className="shipping-info-row">
                  <div className="shipping-title">Shipping</div>

                  <div className="shipping-address">
                    Shipping to USA <br />
                    <a href="#" className="change-link">Change address</a>
                  </div>
                </div>

              </div>
              <div className="totals-line total-line">
                <span>Total</span>
                <span>
                  ${(subtotal + (shipping === "flat" ? 10 : 0)).toFixed(2)}
                </span>

              </div>

              <button
                className="proceed-btn"
                onClick={() => {
                  if (cartItems.length === 0) {
                    alert("Your cart is empty");
                    return;
                  }

                  navigate("/checkout");
                }}
              >
                Proceed to checkout
              </button>
            </div>
          </div>

        </div >
        <div className="related-products">
          <h3>Related Product</h3>

          <div className="related-products-grid">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </div >
    </>
  );
};

export default Cart;