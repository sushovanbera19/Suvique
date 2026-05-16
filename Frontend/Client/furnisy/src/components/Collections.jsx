import React from "react";
import "../assets/style/Collections.css";
import ViewAllButton from "../Common/ViewAllButton";
import product1 from "../../public/images/product1.webp";
import ProductSlider from "../Common/ProductSlider";

// Sample collection products array
const collectionsData = [
  { id: 1, img: product1, name: "Modern Dark Wood Chair", price: "$299.00", tag: "NEW" },
  { id: 2, img: product1, name: "Classic Leather Sofa", price: "$499.00", tag: "HOT" },
  { id: 3, img: product1, name: "Minimalist Coffee Table", price: "$199.00" },
  { id: 4, img: product1, name: "Elegant Floor Lamp", price: "$89.00", tag: "SALE" },
  { id: 5, img: product1, name: "Stylish Armchair", price: "$399.00" },
  { id: 6, img: product1, name: "Wooden Bookshelf", price: "$149.00" },
];

const Collections = () => {
  return (
    <div className="collections-container">
      <div className="collections-header">
        <h2 className="collections-heading">Top Collections</h2>
        <ViewAllButton
          text="View All Collections"
          onClick={() => console.log("Navigate to Products")}
        />
      </div>
      <ProductSlider products={collectionsData} />
    </div>
  );
};

export default Collections;
