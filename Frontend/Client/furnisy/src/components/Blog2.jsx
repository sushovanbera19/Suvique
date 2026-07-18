import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BlogCard from "../Common/BlogCard";
import Pagination from "../Common/Pagination";
import AccountHeader from "../Common/AccountHeader";
import { useTranslation } from "../context/LanguageContext";

import BlogSearch from "../Common/BlogSearch";
import BlogCategories from "../Common/BlogCategories";
import LatestPosts from "../Common/LatestPosts";
import BlogTags from "../Common/BlogTags";

import "../assets/style/blog-2.css";

const API = "http://localhost:5000";

const Blog2 = () => {
  const { t, lang } = useTranslation();
  const { pathname } = useLocation();

  const columns = pathname === "/blog-3" ? 3 : 2;

  const [currentPage, setCurrentPage] = useState(1);
  const [blogData, setBlogData] = useState([]);

  const blogsPerPage = columns === 3 ? 6 : 4;

  useEffect(() => {
    fetch(`${API}/api/blogs/published?lang=${lang}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBlogData(data.data.map((b) => ({
            image: b.image,
            title: b.title,
            date: new Date(b.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
            category: b.category,
            author: b.author,
            description: b.description,
          })));
        }
      })
      .catch(() => {});
  }, [lang]);

  const totalPages = Math.ceil(blogData.length / blogsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [columns]);

  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = blogData.slice(
    startIndex,
    startIndex + blogsPerPage
  );

  return (
    <>
      <AccountHeader title={t("blog.title")} breadcrumb={`${t("common.home")} → ${t("blog.title")}`} />

      <div className="blog2-page">
        <div className="blog2-content">
          <div className={`blog2-grid cols-${columns}`}>
            {currentBlogs.map((blog, index) => (
              <BlogCard key={index} blog={blog} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            align="left"
          />
        </div>

        <aside className="blog2-sidebar">
          <BlogSearch />
          <BlogCategories />
          <LatestPosts />
          <BlogTags />
        </aside>
      </div>
    </>
  );
};

export default Blog2;
