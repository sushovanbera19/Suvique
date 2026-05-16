// =========================
// CartIcon.jsx
// =========================

import Dropdown from "../widgets/Dropdown";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";

const cartItems = [
  {
    id: 1,
    name: "SomeThing Phone",
    desc: "Metallic Blue | 6gb Ram",
    price: "$1,299.00",
    image: "https://cdn-icons-png.flaticon.com/128/15/15874.png",
  },
  {
    id: 2,
    name: "Stop Watch",
    desc: "Analog",
    tag: "Free shipping",
    price: "$179.29",
    image: "https://cdn-icons-png.flaticon.com/128/2972/2972531.png",
  },
  {
    id: 3,
    name: "Photo Frame",
    desc: "Decorative",
    price: "$29.00",
    image: "https://cdn-icons-png.flaticon.com/128/1040/1040230.png",
  },
  {
    id: 4,
    name: "Kikon Camera",
    desc: "Black | 50MM",
    price: "$4,999.00",
    image: "https://cdn-icons-png.flaticon.com/128/2922/2922510.png",
  },
  {
    id: 5,
    name: "Canvas Shoes",
    desc: "Gray | Sports",
    price: "$129.00",
    image: "https://cdn-icons-png.flaticon.com/128/2589/2589903.png",
  },
  {
    id: 6,
    name: "Canvas Shoes",
    desc: "Gray | Sports",
    price: "$129.00",
    image: "https://cdn-icons-png.flaticon.com/128/2589/2589903.png",
  },
];

const CartIcon = () => {

  // Dynamic Count
  const cartCount = cartItems.length;

  return (
    <Dropdown
      width="352px"
      trigger={
        <div className="header-icon badge-wrapper">
          <FiShoppingCart />

          <span className="top-badge purple">
            {cartCount}
          </span>
        </div>
      }
    >
      <div className="cart-dropdown">

        {/* Header */}
        <div className="cart-header">
          <h3>Cart Items</h3>

          <span>
            {cartCount} Items
          </span>
        </div>

        {/* Items */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img
                src={item.image}
                alt={item.name}
              />

              <div className="cart-item-info">
                <h4>{item.name}</h4>

                <p>
                  {item.desc}

                  {item.tag && (
                    <span className="shipping-tag">
                      {item.tag}
                    </span>
                  )}
                </p>
              </div>

              <div className="cart-price">
                {item.price}
              </div>

              <button className="delete-btn">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="cart-footer">
          <button>
            Proceed to checkout
          </button>
        </div>
      </div>
    </Dropdown>
  );
};

export default CartIcon;