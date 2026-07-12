import React from "react";

import "../assets/style/ComparePage.css";
import AccountHeader from "./AccountHeader";
import { FiEye } from "react-icons/fi";
const ProductCompare = () => {
  const products = [
    {
      id: 1,
      name: "Modern Tolik Chair",
      sku: "office-chair-01020304",
      price: "$199.00",
      stock: "In Stock",
      image:
        "../../public/images/detail5.webp",
    },
    {
      id: 2,
      name: "Modern Accent Chair",
      sku: "office-chair-01020304",
      price: "$199.00",
      stock: "In Stock",
      image:
        "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=600",
    },
    {
      id: 3,
      name: "Cherie Chair",
      sku: "office-chair-01020304",
      price: "$199.00",
      stock: "In Stock",
      image:
        "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=600",
    },
  ];

  return (
    <>
      <AccountHeader />
      <section className="compare-section">
        <div className="compare-container">
          <table className="compare-table">
            <tbody>
              <tr>
                <td className="compare-label">
                  Products
                </td>

                {products.map((product) => (
                  <td
                    key={product.id}
                    className="product-column"
                  >
                    <button className="remove-btn">
                      ✕ Remove
                    </button>

                    <div className="product-card">
                      <div className="product-image">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                        />
                      </div>

                      <div className="product-info">
                        <span className="product-title">
                          {product.name}
                        </span>

                        <button className="view-btn">
                          <FiEye />
                        </button>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="compare-label">SKU</td>

                {products.map((product) => (
                  <td key={product.id}>
                    {product.sku}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="compare-label">Price</td>

                {products.map((product) => (
                  <td key={product.id}>
                    {product.price}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="compare-label">
                  Availability
                </td>

                {products.map((product) => (
                  <td
                    key={product.id}
                    className="stock"
                  >
                    {product.stock}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="compare-label">
                  Add to cart
                </td>

                {products.map((product) => (
                  <td key={product.id}>
                    <button className="cart-btn">
                      Add to Cart
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default ProductCompare;
