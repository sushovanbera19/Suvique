import React, { useState, useEffect } from "react";
import ShopPage from "./ShopPagecomponent";
import AccountHeader from "./AccountHeader";
import CategoryStrip from "../Common/CategoryStrip";
import { useTranslation } from "../context/LanguageContext";

const ShopPage2 = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products/shop/sidebar")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.categories) {
          const mapped = data.data.categories.map((cat) => ({
            id: cat.category_id,
            title: cat.category_name,
            count: 0,
            image: null,
          }));
          setCategories(mapped);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <AccountHeader title={t("common.shop")} breadcrumb={`${t("common.home")} → ${t("common.shop")}`} />
      <CategoryStrip categories={categories} />
      <ShopPage />
    </>
  );
};

export default ShopPage2;
