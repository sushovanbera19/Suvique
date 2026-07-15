import React from "react";
import ShopPage from "./ShopPagecomponent";
import AccountHeader from "./AccountHeader";
import { useTranslation } from "../context/LanguageContext";



const ShopPage1 = () => {
  const { t } = useTranslation();
  return (
    <>
      <AccountHeader title={t("common.shop")} breadcrumb={`${t("common.home")} → ${t("common.shop")}`} />
      <ShopPage />
    </>
  );
};

export default ShopPage1;
