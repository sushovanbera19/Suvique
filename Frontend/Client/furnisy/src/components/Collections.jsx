import React, { useEffect, useState } from "react";
import "../assets/style/Collections.css";
import ViewAllButton from "../Common/ViewAllButton";
import ProductSlider from "../Common/ProductSlider";

const Collections = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();

      if (data.success) {
        const sortedProducts = [...data.data].sort(
          (a, b) => Number(b.base_price) - Number(a.base_price)
        );

        setProducts(sortedProducts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="collections-container">
      <div className="collections-header">
        <h2 className="collections-heading">Top Collections</h2>

        <ViewAllButton
          text="View All Collections"
          onClick={() => console.log("Navigate to Products")}
        />
      </div>

      <ProductSlider products={products}  />
    </div>
  );
};

export default Collections;