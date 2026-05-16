import React from "react";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaXTwitter
} from "react-icons/fa6";

import AccountHeader from "../Common/AccountHeader";
import BlogCard from "../Common/BlogCard";

import BlogSearch from "../Common/BlogSearch";
import BlogCategories from "../Common/BlogCategories";
import LatestPosts from "../Common/LatestPosts";
import BlogTags from "../Common/BlogTags";

import Blogimage from "../../public/images/blog-3.webp";
import "../assets/style/blog-details.css";

/* ----------------------------------
   RELATED BLOG DATA
----------------------------------- */
const relatedBlogs = [
    {
        image: Blogimage,
        title: "Comfortable Chairs Can Help You Create Your Own Home Office",
        date: "20 Jan 2025",
        category: "Office Furniture",
        author: "Anna Maria",
        description: "Short description here..."
    },
    {
        image: Blogimage,
        title: "The Ultimate Guide to Choosing a Perfect Furniture for Your Home",
        date: "18 Aug 2025",
        category: "Office Furniture",
        author: "Anna Maria",
        description: "Short description here..."
    },
    {
        image: Blogimage,
        title: "Modern Wooden Storage Ideas for Living Room",
        date: "22 Aug 2025",
        category: "Living Room",
        author: "Anna Maria",
        description: "Short description here..."
    }
];

const BlogDetails = () => {
    return (
        <>
            {/* HEADER */}
            <AccountHeader />

            {/* ===============================
          BLOG DETAILS + SIDEBAR
      =============================== */}
            <section className="blog-details-page">
                {/* -------- LEFT CONTENT -------- */}
                <article className="blog-details-content">
                    {/* Cover Image */}
                    <img
                        src={Blogimage}
                        alt="Blog Cover"
                        className="blog-cover"
                    />

                    {/* Meta */}
                    <p className="blog-meta">
                        20 Jan 2025 • Office Furniture • By Anna Maria • 2 Comments
                    </p>

                    {/* Title */}
                    <h1 className="blog-title">
                        The Ultimate Guide to Choosing a Perfect Furniture for Your Home
                    </h1>

                    {/* Content */}
                    <p className="blog-text">
                        Your residence reflects your lifestyle, so choosing the right
                        furniture is essential for comfort and elegance. Experts often
                        advise balancing functionality with design to ensure long-term
                        satisfaction.
                    </p>

                    <p className="blog-text">
                        Selecting furniture involves understanding space, ergonomics,
                        durability, and material quality. Whether you prefer modern
                        minimalism or classic charm, the right choices can elevate your
                        home.
                    </p>

                    <p className="blog-text">
                        Join our community of design enthusiasts and stay inspired with
                        fresh content regularly. Whether you're planning a complete home
                        makeover or looking for small updates to refresh your space, the
                        Luxura Pro Blog is here to guide you every step of the way.
                    </p>

                    {/* Image Row */}
                    <div className="blog-image-row">
                        <div className="blog-image-box">
                            <img src={Blogimage} alt="Wooden Chair" />
                            <p className="image-caption">
                                The Ultimate Guide to Choosing a Perfect Furniture for Your Home
                            </p>
                        </div>

                        <div className="blog-image-box">
                            <img src={Blogimage} alt="Swivel Chair" />
                            <p className="image-caption">
                                Dorso Swivel Chair. Choosing a Perfect Furniture for Your Home.
                            </p>
                        </div>
                    </div>

                    <p className="blog-text">
                        Join our community of design enthusiasts and stay inspired with
                        fresh content regularly. Whether you're planning a complete home
                        makeover or looking for small updates to refresh your space.
                    </p>

                    {/* Footer */}
                    <div className="blog-footer">
                        <BlogTags />

                        <div className="share">
                            <span>Share:</span>

                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                                <FaFacebookF />
                            </a>

                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                                <FaInstagram />
                            </a>

                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                                <FaLinkedinIn />
                            </a>

                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <FaXTwitter />
                            </a>
                        </div>
                    </div>
                </article>

                {/* -------- RIGHT SIDEBAR -------- */}
                <aside className="blog-details-sidebar">
                    <BlogSearch />
                    <BlogCategories />
                    <LatestPosts />
                    <BlogTags />
                </aside>
            </section>

            {/* ===============================
          RELATED BLOGS (FULL WIDTH)
      =============================== */}
            <section className="related-section">
                <h3 className="related-title">Related Blogs</h3>

                <div className="related-blogs">
                    {relatedBlogs.map((blog, index) => (
                        <BlogCard key={index} blog={blog} />
                    ))}
                </div>
            </section>
        </>
    );
};

export default BlogDetails;
