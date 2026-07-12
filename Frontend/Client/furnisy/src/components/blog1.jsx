import React, { useState } from "react";
import BlogCard from "../Common/BlogCard";
import Blogimage from "../../public/images/blog-3.webp";
import "../assets/style/blog-1.css";
import AccountHeader from "../Common/AccountHeader";
import Pagination from "../Common/Pagination";

const blogData = [
  {
    image: Blogimage,
    title: "The Ultimate Guide to Choosing a Perfect Furniture for Your Home",
    date: "18 Aug 2025",
    category: "Office Furniture",
    author: "Anna Maria",
    description: "Make your database provisioning cloud-native using our database generation. Make your..."
  },
];

const Blog1 = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  const totalPages = Math.ceil(blogData.length / blogsPerPage);

  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = blogData.slice(
    startIndex,
    startIndex + blogsPerPage
  );

  return (
    <>
      <AccountHeader />

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
