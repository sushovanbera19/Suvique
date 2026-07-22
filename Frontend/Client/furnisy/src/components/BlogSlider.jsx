import React, { useRef, useState, useEffect } from "react";
import "../assets/style/BlogSlider.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import BlogCard from "../Common/BlogCard";
import { useTranslation } from "../context/LanguageContext";

const API = "http://localhost:5000";

const BlogSlider = () => {
    const { t, lang } = useTranslation();
    const sliderRef = useRef(null);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetch(`${API}/api/blogs/published?lang=${lang}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setBlogs(data.data.map((b) => ({
                        id: b.id,
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

    const scroll = (direction) => {
        if (sliderRef.current) {
            const width = sliderRef.current.clientWidth;
            sliderRef.current.scrollBy({
                left: direction === "next" ? width : -width,
                behavior: "smooth",
            });
        }
    };

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
        isDown = true;
        sliderRef.current.classList.add("active");
        startX = e.pageX - sliderRef.current.offsetLeft;
        scrollLeft = sliderRef.current.scrollLeft;
    };

    const handleMouseLeave = () => {
        isDown = false;
        sliderRef.current.classList.remove("active");
    };

    const handleMouseUp = () => {
        isDown = false;
        sliderRef.current.classList.remove("active");
    };

    const handleMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="blog-slider-container">
            <h2>{t("blog.newsAndBlogs")}</h2>

            <div className="Blogs-button">
                <button onClick={() => scroll("prev")}>
                    <FaArrowLeft />
                </button>
                <button onClick={() => scroll("next")}>
                    <FaArrowRight />
                </button>
            </div>

            <div
                className="blog-slider"
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {blogs.map((blog, index) => (
                    <BlogCard key={index} blog={blog} />
                ))}
            </div>
        </div>
    );
};

export default BlogSlider;
