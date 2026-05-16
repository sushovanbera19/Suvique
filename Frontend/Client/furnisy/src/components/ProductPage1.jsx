import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { BiShuffle } from "react-icons/bi";
import "../assets/style/ProductPage1.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiMaximize2, FiX, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import ProductCard from "../Common/ProductCard";

/* ========================= */
/* PRODUCT DATA */
/* ========================= */

const product = {
    name: "Modern Dark Wood Chair",
    price: "$219.00",
    rating: 4.8,
    reviewsCount: 3,
    stock: "In stock",
    sku: "D1008",
    categories: ["Furniture", "Chair"],
    tags: ["Chair", "Table", "Furniture", "Decor"],
    shortDescription:
        "The Tacoma Carver Dining Chair features a sleek design. Its clean lines and refined silhouette make a standout piece in any room.",
    description: {
        paragraph:
            "Elevate your dining experience with the Tacoma Carver Dining Chair, a perfect blend of modern elegance and timeless craftsmanship. Designed to offer both comfort and style, this chair is an ideal addition to any dining room or living space. The Tacoma Carver Dining Chair combines aesthetic appeal with practical functionality, making it a versatile and valuable addition to any home.",
        features: [
            {
                title: "Elegant Design",
                detail:
                    "The Tacoma Carver Dining Chair features a sleek, contemporary design that complements a variety of interior styles. Its clean lines and refined silhouette make it a standout piece in any room.",
            },
            {
                title: "Superior Comfort",
                detail:
                    "Designed with your comfort in mind, the chair boasts a generously padded seat and backrest. The ergonomic design supports your posture, ensuring you can enjoy long meals and conversations in comfort.",
            },
            {
                title: "High-Quality Materials",
                detail:
                    "Crafted from premium materials, the Tacoma Carver Dining Chair is built to last. The solid wood frame provides sturdy support, while the upholstered seat and backrest add a touch of luxury.",
            },
        ],
    },
    additionalInfo:
        "Elevate your dining experience... valuable addition to any home.\n\nElevate your dining experience... valuable addition to any home.Elevate your dining experience with the Tacoma Carver Dining Chair, a perfect blend of modern elegance and timeless craftsmanship. Designed to offer both comfort and style, this chair is an ideal addition to any dining room or living space. The Tacoma Carver Dining Chair combines aesthetic appeal with practical functionality, making it a versatile and valuable addition to any home.",

    reviews: [
        {
            name: "Jannie Schumm",
            rating: 5,
            comment:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account. consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account.",
            image: "/images/user-1.webp",
        },
    ],
    images: [
        "/images/detils1.webp",
        "/images/detail2.webp",
        "/images/detail3.webp",
        "/images/detail4.webp",
        "/images/detail5.webp",
    ],
    colors: ["#D2691E", "#C0C0C0", "#FFFFFF", "#F5DEB3"],
    sizes: ["S", "M", "L"],
};

const relatedProducts = [
    {
        id: 1,
        name: "Wooden Lounge Chair",
        price: "$180.00",
        img: "/images/detail2.webp",
        tag: "Sale",
    },
    {
        id: 2,
        name: "Classic Arm Chair",
        price: "$250.00",
        img: "/images/detail3.webp",
        tag: "New",
    },
    {
        id: 3,
        name: "Modern Fabric Chair",
        price: "$199.00",
        img: "/images/detail4.webp",
    },
    {
        id: 4,
        name: "Modern Fabric Chair",
        price: "$200.00",
        img: "/images/img-1.webp",
    },
];

/* ========================= */
/* COMPONENT */
/* ========================= */

const ProductPage = () => {
    const location = useLocation();

    const isLayout3 = location.pathname === "/product-details-3";
    const isLayout4 = location.pathname === "/product-details-4";


    const [currentImage, setCurrentImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);


    const nextImage = () =>
        setCurrentImage((prev) => (prev + 1) % product.images.length);

    const prevImage = () =>
        setCurrentImage(
            (prev) => (prev - 1 + product.images.length) % product.images.length
        );

    return (
        <>
            <div
                className={`ProductPage1-container 
               ${isLayout3 ? "ProductPage3" : ""} 
              ${isLayout4 ? "ProductPage4" : ""}`}
            >
                {/* GALLERY */}
                <div className="ProductPage1-gallery">

                    {isLayout4 ? (
                        // ===== PAGE 4: Show all thumbnails as full images =====
                        <>
                            {product.images.map((img, idx) => (
                                <div key={idx} className="main-image">
                                    <img
                                        src={img}
                                        alt={`Product ${idx}`}
                                        onClick={() => {
                                            setCurrentImage(idx);
                                            setIsGalleryOpen(true);
                                        }}
                                    />
                                </div>
                            ))}
                        </>
                    ) : (
                        // ===== NORMAL LAYOUT (Page 1 & 3) =====
                        <>
                            <div className="main-image">
                                <img src={product.images[currentImage]} alt="Product" />

                                <button
                                    className="gallery-open-btn"
                                    onClick={() => setIsGalleryOpen(true)}
                                >
                                    <FiMaximize2 />
                                </button>

                                <button className="prev" onClick={prevImage}>
                                    <FaChevronLeft />
                                </button>

                                <button className="next" onClick={nextImage}>
                                    <FaChevronRight />
                                </button>
                            </div>

                            <div className="ProductPage1-thumbnails">
                                {product.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt="Thumb"
                                        className={currentImage === idx ? "active" : ""}
                                        onClick={() => setCurrentImage(idx)}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* OVERLAY (works for all layouts) */}
                    {isGalleryOpen && (
                        <div className="ProductPage1-overlay">
                            <button
                                className="overlay-close"
                                onClick={() => setIsGalleryOpen(false)}
                            >
                                <FiX />
                            </button>

                            <button className="overlay-prev" onClick={prevImage}>
                                <FiArrowLeft />
                            </button>

                            <img
                                src={product.images[currentImage]}
                                alt="Full View"
                                className="overlay-image"
                            />

                            <button className="overlay-next" onClick={nextImage}>
                                <FiArrowRight />
                            </button>
                        </div>
                    )}

                </div>


                {/* DETAILS */}
                <div className="ProductPage1-details">

                    {/* Breadcrumb */}
                    <div className="ProductPage1-breadcrumb">
                        <a href="/">Home</a> <span>&gt;</span>
                        <a href="/shop">Shop</a> <span>&gt;</span>
                        <a href="/shop/furniture">Furniture</a> <span>&gt;</span>
                        <span className="active">{product.name}</span>
                    </div>

                    <h1>{product.name}</h1>

                    <div className="rating-stock">
                        <span>⭐ {product.rating} ({product.reviewsCount})</span>
                        <span>Stock: {product.stock}</span>
                    </div>

                    <p className="price">{product.price}</p>
                    <p className="short-description">{product.shortDescription}</p>

                    {/* Color */}
                    <div className="ProductPage1-color-selector">
                        <p>Color:</p>
                        {product.colors.map((color) => (
                            <span
                                key={color}
                                className={selectedColor === color ? "active" : ""}
                                style={{ backgroundColor: color }}
                                onClick={() => setSelectedColor(color)}
                            />
                        ))}
                    </div>

                    {/* Size */}
                    <div className="ProductPage1-size-selector">
                        <p>Size:</p>
                        {product.sizes.map((size) => (
                            <button
                                key={size}
                                className={selectedSize === size ? "active" : ""}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>

                    {/* Cart */}
                    <div className="ProductPage1-cart-row">
                        <div className="ProductPage1-quantity">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>

                        <button className="ProductPage1-add-to-cart-btn">
                            Add To Cart
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="ProductPage1-actions">
                        <button><FiHeart /> Add to Wishlist</button>
                        <button><BiShuffle /> Compare</button>
                    </div>

                    {/* Meta */}
                    <div className="ProductPage1-meta">
                        <p>SKU: {product.sku}</p>
                        <p>Categories: {product.categories.join(", ")}</p>
                        <p>Tags: {product.tags.join(", ")}</p>

                        <div className="ProductPage1-share">
                            <span>Share:</span>
                            <div className="ProductPage1-share-icons">
                                <a href="#"><FaFacebookF /></a>
                                <a href="#"><FaTwitter /></a>
                                <a href="#"><FaInstagram /></a>
                                <a href="#"><FaLinkedinIn /></a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* TABS */}
            <div className={`ProductPage1-tabs ${isLayout3 ? "ProductPage3-tabs" : ""}`}>

                <div className="ProductPage1-tab-buttons">
                    <button
                        className={activeTab === "description" ? "active" : ""}
                        onClick={() => setActiveTab("description")}
                    >
                        Description
                    </button>

                    <button
                        className={activeTab === "additional" ? "active" : ""}
                        onClick={() => setActiveTab("additional")}
                    >
                        Additional Information
                    </button>

                    <button
                        className={activeTab === "reviews" ? "active" : ""}
                        onClick={() => setActiveTab("reviews")}
                    >
                        Review ({product.reviews.length})
                    </button>
                </div>

                <div className="ProductPage1-tab-content">

                    {activeTab === "description" && (
                        <>
                            <p>{product.description.paragraph}</p>
                            <ul>
                                {product.description.features.map((item, idx) => (
                                    <li key={idx}>
                                        <strong>{item.title}:</strong> {item.detail}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {activeTab === "additional" && (
                        <p>{product.additionalInfo}</p>
                    )}

                    {activeTab === "reviews" && (

                        <div className="ProductPage1-reviews">

                            {/* Existing Reviews */}
                            {product.reviews.map((review, idx) => (
                                <div key={idx} className="ProductPage1-review-item">

                                    <div className="ProductPage1-review-header">
                                        <img src={review.image} alt={review.name} />

                                        <div className="ProductPage1-review-info">

                                            <h4>{review.name}</h4>
                                            <div className="ProductPage1-review-stars">
                                                {"★".repeat(review.rating)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="Review_comment">
                                        <p>{review.comment}</p>
                                    </div>

                                </div>

                            ))}

                            {/* Write Review Form */}
                            <div className="ProductPage1-review-form">
                                <h3>Write a Review for this product</h3>

                                <div className="ProductPage1-rating-input">
                                    <span>Your Rating</span>

                                    <div className="stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`star ${star <= (hoverRating || userRating) ? "active" : ""
                                                    }`}
                                                onClick={() => setUserRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>


                                <label>Your Review</label>
                                <textarea rows="6"></textarea>

                                <button className="ProductPage1-submit-btn">
                                    Submit
                                </button>
                            </div>

                        </div>
                    )}
                </div>

                {/* RELATED PRODUCTS */}
                <div className="related-products">
                    <h3>Related Product</h3>

                    <div className="related-products-grid">
                        {relatedProducts.map((item) => (
                            <ProductCard key={item.id} product={item} />
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
};

export default ProductPage;
