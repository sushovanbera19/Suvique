import React, { useState } from "react";
import styled from "styled-components";
import "../assets/style/FeaturedProducts.css";
import ProductCard from "../Common/ProductCard";
import ViewAllButton from "../Common/ViewAllButton"

import product1 from "../../public/images/product1.webp";

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

const productsData = [
  {
    id: 1,
    img: product1,
    category: "tab1",
    name: "Modern Dark Wood Chair",
    price: "$299.00",
    tag: "NEW",
  },
  {
    id: 2,
    img: product1,
    category: "tab1",
    name: "Minimal Lounge Chair",
    price: "$249.00",
    tag: "25%",
  },
  {
    id: 3,
    img: product1,
    category: "tab1",
    name: "Scandinavian Armchair",
    price: "$319.00",
  },
  {
    id: 4,
    img: product1,
    category: "tab1",
    name: "Luxury Velvet Chair",
    price: "$399.00",
    tag: "HOT",
  },

  {
    id: 5,
    img: product1,
    category: "tab2",
    name: "Modern Fabric Sofa",
    price: "$899.00",
    tag: "NEW",
  },
  {
    id: 6,
    img: product1,
    category: "tab2",
    name: "Compact Two-Seater Sofa",
    price: "$749.00",
  },
  {
    id: 7,
    img: product1,
    category: "tab2",
    name: "Nordic Wooden Stool",
    price: "$129.00",
    tag: "25%",
  },
  {
    id: 8,
    img: product1,
    category: "tab2",
    name: "Modern Coffee Table",
    price: "$199.00",
  },

  {
    id: 9,
    img: product1,
    category: "tab3",
    name: "Classic Dining Chair",
    price: "$179.00",
    tag: "SALE",
  },
  {
    id: 10,
    img: product1,
    category: "tab3",
    name: "Oak Wood Side Table",
    price: "$229.00",
    tag: "30%",
  },
  {
    id: 11,
    img: product1,
    category: "tab3",
    name: "Modern Floor Lamp",
    price: "$159.00",
  },
  {
    id: 12,
    img: product1,
    category: "tab3",
    name: "Designer Accent Chair",
    price: "$349.00",
    tag: "HOT",
  },
];


const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  const filteredProducts = productsData.filter(
    (item) => item.category === activeTab
  );

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
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
