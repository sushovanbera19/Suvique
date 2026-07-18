import React, { useState, useEffect } from "react";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaXTwitter
} from "react-icons/fa6";
import { useTranslation } from "../context/LanguageContext";

import AccountHeader from "../Common/AccountHeader";
import BlogCard from "../Common/BlogCard";

import BlogSearch from "../Common/BlogSearch";
import BlogCategories from "../Common/BlogCategories";
import LatestPosts from "../Common/LatestPosts";
import BlogTags from "../Common/BlogTags";

import "../assets/style/blog-details.css";

const API = "http://localhost:5000";

const BlogDetails = () => {
    const { t, lang } = useTranslation();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API}/api/blogs/published?lang=${lang}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.data.length > 0) {
                    const first = data.data[0];
                    setBlog(first);
                    setRelatedBlogs(data.data.slice(1).map((b) => ({
                        image: b.image,
                        title: b.title,
                        date: new Date(b.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
                        category: b.category,
                        author: b.author,
                        description: b.description,
                    })));
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [lang]);

    if (loading) {
        return (
            <>
                <AccountHeader title={t("blog.details")} breadcrumb={`${t("common.home")} → ${t("blog.title")} → ${t("blog.details")}`} />
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
                    {t("common.loading")}
                </div>
            </>
        );
    }

    if (!blog) {
        return (
            <>
                <AccountHeader title={t("blog.details")} breadcrumb={`${t("common.home")} → ${t("blog.title")} → ${t("blog.details")}`} />
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
                    {t("common.noData")}
                </div>
            </>
        );
    }

    const metaDate = new Date(blog.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    return (
        <>
            <AccountHeader title={t("blog.details")} breadcrumb={`${t("common.home")} → ${t("blog.title")} → ${t("blog.details")}`} />

            <section className="blog-details-page">
                <article className="blog-details-content">
                    {blog.image && (
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="blog-cover"
                        />
                    )}

                    <p className="blog-meta">
                        {metaDate} • {blog.category || "Uncategorized"} • By {blog.author || "Admin"}
                    </p>

                    <h1 className="blog-title">
                        {blog.title}
                    </h1>

                    {blog.description && (
                        <p className="blog-text">
                            {blog.description}
                        </p>
                    )}

                    {blog.content && (
                        <div className="blog-text" dangerouslySetInnerHTML={{ __html: blog.content }} />
                    )}

                    <div className="blog-footer">
                        <BlogTags />

                        <div className="share">
                            <span>{t("blog.share")}</span>

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

                <aside className="blog-details-sidebar">
                    <BlogSearch />
                    <BlogCategories />
                    <LatestPosts />
                    <BlogTags />
                </aside>
            </section>

            {relatedBlogs.length > 0 && (
                <section className="related-section">
                    <h3 className="related-title">{t("blog.relatedBlogs")}</h3>

                    <div className="related-blogs">
                        {relatedBlogs.map((rb, index) => (
                            <BlogCard key={index} blog={rb} />
                        ))}
                    </div>
                </section>
            )}
        </>
    );
};

export default BlogDetails;
