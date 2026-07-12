import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BlogCard from "../Common/BlogCard";
import Pagination from "../Common/Pagination";
import AccountHeader from "../Common/AccountHeader";

import BlogSearch from "../Common/BlogSearch";
import BlogCategories from "../Common/BlogCategories";
import LatestPosts from "../Common/LatestPosts";
import BlogTags from "../Common/BlogTags";

import Blogimage from "../../public/images/blog-3.webp";
import "../assets/style/blog-2.css";

const blogData = Array.from({ length: 8 }, (_, i) => ({
  image: Blogimage,
  title: `Blog Post ${i + 1}`,
  date: "18 Aug 2025",
  category: "Office Furniture",
  author: "Anna Maria",
  description: "Make your database provisioning cloud-native using our database generation. Make your..."
}));

const Blog2 = () => {
  const { pathname } = useLocation();

  // 🔥 layout based on route
  const columns = pathname === "/blog-3" ? 3 : 2;

  const [currentPage, setCurrentPage] = useState(1);

  // adjust blogs per page automatically
  const blogsPerPage = columns === 3 ? 6 : 4;

  const totalPages = Math.ceil(blogData.length / blogsPerPage);

  // reset page when route/layout changes
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
      <AccountHeader />

      <div className="blog2-page">
        {/* LEFT SIDE */}
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

        {/* RIGHT SIDEBAR */}
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
