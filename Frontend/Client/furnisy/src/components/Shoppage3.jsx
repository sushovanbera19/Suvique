import React from "react";
import ShopPage from "./ShopPagecomponent";
import AccountHeader from "./AccountHeader";
import { useTranslation } from "../context/LanguageContext";

const Shoppage3 = () => {
  const { t } = useTranslation();
  return (
    <>
      <AccountHeader title={t("common.shop")} breadcrumb={`${t("common.home")} → ${t("common.shop")}`} />
      <ShopPage defaultView="list" />
    </>
  );
};

export default Shoppage3;
