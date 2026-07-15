import React from "react";
import { useTranslation } from "../context/LanguageContext";

const BlogSearch = () => {
  const { t } = useTranslation();
  return (
    <div className="sidebar-box">
      <input
        type="text"
        placeholder={t("blog.searchProducts")}
        className="search-input"
      />
    </div>
  );
};

export default BlogSearch;
