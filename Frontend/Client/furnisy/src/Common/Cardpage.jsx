import React, { useState } from 'react';
import '../assets/style/Cardpage.css';
import AccountHeader from './AccountHeader';
import ProductCard from "./ProductCard";


const Cart = () => {
  const [quantity, setQuantity] = useState(1);
  const [shipping, setShipping] = useState('free');

  const price = 399.0;
  const subtotal = price * quantity;

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1) setQuantity(newQty);
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
            <div className="product-item">
              <div className="product-cell product-info-cell">
                <div className="product-thumb">
                  <img
                    src="https://www.lunafurn.com/cdn/shop/products/Lakeview-Ivory-Upholstered-6-piece-Modular-Sectional-Sofa-Luna-Furniture-25663562416182.jpg?v=1766857057&width=800"
                    alt="Modular Sofa"
                  />
                </div>
                <div className="product-name">Modular Sofa With...</div>
              </div>

              <div className="product-cell price-cell">
                ${price.toFixed(2)}
              </div>

              <div className="product-cell quantity-cell">
                <div className="qty-wrapper">
                  <button
                    className="qty-btn minus"
                    onClick={() => handleQuantityChange(-1)}
                  >−</button>
                  <span className="qty-display">{quantity}</span>
                  <button
                    className="qty-btn plus"
                    onClick={() => handleQuantityChange(1)}
                  >+</button>
                </div>
              </div>

              <div className="product-cell subtotal-cell">
                ${subtotal.toFixed(2)}
              </div>

              <div className="product-cell remove-cell">
                <button className="remove-icon">×</button>
              </div>
            </div>

            {/* Coupon Section - outside product-item */}
            <div className='coupon_section'>
              <div className="left-action">
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="coupon-field"
                />
                <button className="apply-coupon-btn">Apply coupon</button>
              </div>
              {/* Right: continue shopping */}
              <div className="right-action">
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
                  $
                  {(
                    subtotal +
                    (shipping === "flat" ? 10 : 0)
                  ).toFixed(2)}
                </span>

              </div>

              <button className="proceed-btn">Proceed to checkout</button>
            </div>
          </div>

        </div>
        <div className="related-products">
          <h3>Related Product</h3>

          <div className="related-products-grid">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;