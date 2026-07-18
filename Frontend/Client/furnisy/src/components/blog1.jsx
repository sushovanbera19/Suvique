import React, { useState, useEffect } from "react";
import BlogCard from "../Common/BlogCard";
import "../assets/style/blog-1.css";
import AccountHeader from "../Common/AccountHeader";
import Pagination from "../Common/Pagination";
import { useTranslation } from "../context/LanguageContext";

const API = "http://localhost:5000";

const Blog1 = () => {
  const { t, lang } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [blogData, setBlogData] = useState([]);
  const blogsPerPage = 5;

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

  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = blogData.slice(
    startIndex,
    startIndex + blogsPerPage
  );

  return (
    <>
      <AccountHeader title={t("blog.title")} breadcrumb={`${t("common.home")} → ${t("blog.title")}`} />

      <div className="blog-page">
        <div className="blog-container">
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
    </>
  );
};

export default Blog1;
