import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "../assets/style/FeaturedProducts.css";
import ProductCard from "../Common/ProductCard";
import ViewAllButton from "../Common/ViewAllButton";

const TabButton = styled.button`
  padding: 10px 20px;
  border: none;
  background: #fff;
  font-family: "Dosis", sans-serif;
  font-weight: 400;
  color: #646363;
  cursor: pointer;
  font-size: 18px;
  margin-top: 30px;
  border-bottom: ${(props) =>
    props.active ? "2px solid #000" : "3px solid transparent"};

  &:hover {
    color: #000;
  }
`;

const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [products, setProducts] = useState([]);

  // FETCH FROM API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();

      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // FILTER (NO STYLE CHANGE)
  const filteredProducts = products.filter((item) => {
  const best = Number(item.is_best_seller);
  const newA = Number(item.is_new_arrival);
  const sale = Number(item.is_on_sale);

  if (activeTab === "tab1") return best === 1;
  if (activeTab === "tab2") return newA === 1;
  if (activeTab === "tab3") return sale === 1;

  return false;
});

  return (
    <div className="featured-products-container">
      <h1>Featured Products</h1>
      <p>Explore the best of Furnisy Featured Collection.</p>

      <div className="tabs-row">
        <div className="tabs">
          <TabButton active={activeTab === "tab1"} onClick={() => setActiveTab("tab1")}>
            Best Sellers
          </TabButton>

          <TabButton active={activeTab === "tab2"} onClick={() => setActiveTab("tab2")}>
            New Arrivals
          </TabButton>

          <TabButton active={activeTab === "tab3"} onClick={() => setActiveTab("tab3")}>
            On Sale
          </TabButton>
        </div>

        <ViewAllButton
          text="View All Products"
          onClick={() => console.log("Navigate to Products")}
        />
      </div>

      <div className="products-section">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;