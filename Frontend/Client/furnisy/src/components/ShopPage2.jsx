import React from "react";
import ShopPage from "./ShopPagecomponent";
import AccountHeader from "./AccountHeader";
import CategoryStrip from "../Common/CategoryStrip";

import product from "../../public/images/product 7.webp";

const categories = [
  { id: 1, title: "All Furniture", count: 2200, image: product },
  { id: 2, title: "Decor", count: 210, image: product },
  { id: 3, title: "Office", count: 270, image: product },
  { id: 4, title: "Living Room", count: 180, image: product },
  { id: 5, title: "Bedroom", count: 220, image: product },
];

const ShopPage2 = () => {
  return (
    <>
      {/* 🔥 Only for ShopPage2 */}
      <AccountHeader />
      <CategoryStrip categories={categories} />
      <ShopPage />
    </>
  );
};

export default ShopPage2;
