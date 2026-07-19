import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../assets/style/Cardpage.css';
import AccountHeader from './AccountHeader';
import ProductCard from "./ProductCard";
import { toastError, toastWarning } from "../utils/toast";
import { useCountry } from "../context/CountryContext";
import { useTranslation } from "../context/LanguageContext";


const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [shipping, setShipping] = useState("free");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const navigate = useNavigate();
  const { formatPrice } = useCountry();
  const { t } = useTranslation();

  const subtotal = cartItems.reduce((total, item) => {
    const price = item.variant_price || item.base_price;
    return total + Number(price) * item.quantity;
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
        fetchRelatedProducts(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRelatedProducts = async (items) => {
    try {
      const ids = items.map((i) => i.id).join(",");
      const cats = [...new Set(items.map((i) => i.category_id).filter(Boolean))].join(",");
      const res = await fetch(
        `http://localhost:5000/api/products/shop?page=1&limit=8&category=${cats}`
      );
      const data = await res.json();
      if (data.success) {
        const cartIds = items.map((i) => i.id);
        let related = data.data.filter((p) => !cartIds.includes(p.id));
        if (related.length < 4) {
          const res2 = await fetch(`http://localhost:5000/api/products?page=1&limit=8`);
          const data2 = await res2.json();
          if (data2.success) {
            const existingIds = related.map((p) => p.id).concat(...cartIds);
            const more = data2.data.filter((p) => !existingIds.includes(p.id));
            related = [...related, ...more];
          }
        }
        setRelatedProducts(related.slice(0, 4));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    try {
      const res = await fetch("http://localhost:5000/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.data);
        setCouponError("");
      } else {
        setAppliedCoupon(null);
        setCouponError(data.message);
      }
    } catch (err) {
      setCouponError("Failed to validate coupon");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingCost = shipping === "flat" ? 10 : 0;
  const total = subtotal - discount + shippingCost;

  const removeCart = async (productId, variationId) => {
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
            variation_id: variationId || null,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchCart();
      } else {
        toastError(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <AccountHeader title="Shopping Cart" breadcrumb="Home → Cart" />
      <div className="cart-wrapper">
        <div className="cart-grid">

          {/* LEFT - Products */}
          {/* LEFT - Products */}
          <div className="products-panel">

            {/* Table Header */}
            <div className="table-header">
              <div>{t("cart.products")}</div>
              <div>{t("cart.price")}</div>
              <div>{t("cart.quantity")}</div>
              <div>{t("cart.subtotal")}</div>
              <div></div> {/* Remove column */}
            </div>

            {/* Product Row */}
            {cartItems.map((item) => {
              const itemPrice = item.variant_price || item.base_price;
              return (
              <div className="product-item" key={item.id}>
                <div className="product-cell product-info-cell">
                  <div className="product-thumb">
                    <img
                      src={`http://localhost:5000/${item.main_image.replace(/\\/g, "/")}`}
                      alt={item.product_name}
                    />
                  </div>
                  <div className="product-name"> {item.product_name}</div>
                  {(item.color_code || item.size) && (
                    <div className="product-variant-info">
                      {item.color_code && <span className="variant-color-dot" style={{ backgroundColor: item.color_code }} />}
                      {item.color_code && <span>{item.color_code}</span>}
                      {item.size && <span className="variant-size-badge">{item.size}</span>}
                    </div>
                  )}
                </div>

                <div className="product-cell price-cell">
                  {formatPrice(itemPrice)}
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
                  {formatPrice(Number(itemPrice) * item.quantity)}
                </div>

                <div className="product-cell remove-cell">
                  <button className="remove-icon" onClick={() => removeCart(item.product_id, item.variation_id)}>×</button>
                </div>
              </div>
              );
            })}

            {/* Coupon Section - outside product-item */}
            <div className='coupon_section' >
              <div className="left-action">
                <input
                  type="text"
                  placeholder={t("cart.couponPlaceholder")}
                  className="coupon-field"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                />
                {appliedCoupon ? (
                  <button className="apply-coupon-btn" onClick={removeCoupon} style={{background:"#ef4444"}}>
                    {t("cart.removeCoupon") || "Remove"} ({appliedCoupon.code})
                  </button>
                ) : (
                  <button className="apply-coupon-btn" onClick={applyCoupon}>{t("cart.applyCoupon")}</button>
                )}
              </div>
              {couponError && <div style={{color:"#ef4444",fontSize:"13px",marginTop:"8px"}}>{couponError}</div>}
              {/* Right: continue shopping */}
              < div className="right-action" >
                <button className="continue-shopping-btn" onClick={() => navigate("/Shop-1")}>{t("cart.continueShopping")}</button>
              </div>
            </div>

          </div>

          {/* RIGHT - Totals */}
          <div className="totals-panel">
            <div className="totals-box">
              <h3>{t("cart.cartTotals")}</h3>

              <div className="totals-line">
                <span>{t("cart.subtotal")}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="totals-line" style={{color:"#22c55e"}}>
                  <span>{t("cart.discount") || "Discount"} ({appliedCoupon.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

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
                    {t("cart.freeShipping")}
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
                  <div className="shipping-title">{t("cart.shipping")}</div>

                  <div className="shipping-address">
                    Shipping to USA <br />
                    <a href="#" className="change-link">Change address</a>
                  </div>
                </div>

              </div>
              <div className="totals-line total-line">
                <span>{t("cart.total")}</span>
                <span>
                  {formatPrice(total)}
                </span>

              </div>

              <button
                className="proceed-btn"
                onClick={() => {
                  if (cartItems.length === 0) {
                    toastWarning(t("cart.emptyCart"));
                    return;
                  }

                  navigate("/checkout");
                }}
              >
                {t("cart.proceedCheckout")}
              </button>
            </div>
          </div>

        </div >

        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h3>{t("cart.relatedProduct")}</h3>
            <div className="related-products-grid">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}

      </div >
    </>
  );
};

export default Cart;