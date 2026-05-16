import React from "react";
import '../assets/style/ComparePage.css';
import product from "../../public/images/product4.webp"

const products = [
  {
    id: 1,
    name: "Modern Dark Wood Chair",
    sku: "office-chair-01020304",
    price: 299,
    availability: "In Stock",
    image: product,
  },
  {
    id: 2,
    name: "Modern Tolik Chair",
    sku: product,
    price: 199,
    availability: "In Stock",
    image: product,
  },
  {
    id: 3,
    name: "Modern Accent Chair",
    sku: product,
    price: 199,
    availability: "In Stock",
    image: product,
  },
  {
    id: 4,
    name: "Cherie Chair",
    sku: "office-chair-01020304",
    price: 199,
    availability: "In Stock",
    image: product,
  },
];

const ComparePage = () => {

  const handleRemove = (id) => {
    console.log("Remove product with id:", id);
    // You can implement remove logic here
  }

  const handleAddToCart = (product) => {
    console.log("Add to cart:", product);
    // You can implement add to cart logic here
  }

  return (
    <div className="ComparePageWrapper">
      <div className="CompareTable">

        {/* Product Images and Names */}
        <div className="CompareRow CompareHeader">
          <div className="CompareCell">Products</div>
          {products.map((product) => (
            <div key={product.id} className="CompareCell ProductCell">
              <button className="RemoveButton" onClick={() => handleRemove(product.id)}>× Remove</button>
              <img src={product.image} alt={product.name} className="CompareImage" />
              <p className="ProductName">{product.name}</p>
            </div>
          ))}
        </div>

        {/* SKU */}
        <div className="CompareRow">
          <div className="CompareCell">SKU</div>
          {products.map((product) => (
            <div key={product.id} className="CompareCell">{product.sku}</div>
          ))}
        </div>

        {/* Price */}
        <div className="CompareRow">
          <div className="CompareCell">Price</div>
          {products.map((product) => (
            <div key={product.id} className="CompareCell">${product.price.toFixed(2)}</div>
          ))}
        </div>

        {/* Availability */}
        <div className="CompareRow">
          <div className="CompareCell">Availability</div>
          {products.map((product) => (
            <div key={product.id} className="CompareCell">
              <span className={product.availability === "In Stock" ? "InStock" : "OutOfStock"}>
                {product.availability}
              </span>
            </div>
          ))}
        </div>

        {/* Add to Cart */}
        <div className="CompareRow">
          <div className="CompareCell">Add to Cart</div>
          {products.map((product) => (
            <div key={product.id} className="CompareCell">
              <button className="AddToCartButton" onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ComparePage;