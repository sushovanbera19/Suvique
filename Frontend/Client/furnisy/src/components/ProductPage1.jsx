import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { BiShuffle } from "react-icons/bi";
import "../assets/style/ProductPage1.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiMaximize2, FiX, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import ProductCard from "../Common/ProductCard";
import { toastSuccess, toastError, toastLoginRequired } from "../utils/toast";
import { useTranslation } from "../context/LanguageContext";


const relatedProducts = [
    {
        id: 1,
        name: "Wooden Lounge Chair",
        price: "$180.00",
        img: "/images/detail2.webp",
        tag: "Sale",
    },
];

const ProductPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const layout = location.pathname.includes("product-details-3")
        ? 3
        : location.pathname.includes("product-details-4")
        ? 4
        : 1;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const { t } = useTranslation();

    const nextImage = () => {
        if (!product?.images?.length) return;
        setCurrentImage((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        if (!product?.images?.length) return;
        setCurrentImage(
            (prev) => (prev - 1 + product.images.length) % product.images.length
        );
    };

    const addWishlist = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/wishlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ product_id: product.id }),
        });
        const data = await res.json();
        if (data.success) toastSuccess(t("product.addedToWishlist"));
    };

    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) { toastLoginRequired(); return; }
            const res = await fetch("http://localhost:5000/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ product_id: productId }),
            });
            const data = await res.json();
            if (data.success) {
              toastSuccess(data.message);
            } else {
              toastError(data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:5000/api/products/${id}`);
                const result = await res.json();

                if (result.success && result.data) {
                    const p = result.data;
                    const gallery = JSON.parse(p.gallery_images || "[]");
                    const tags = JSON.parse(p.tags || "[]");

                    const categoryNames = [];
                    if (p.category_name) categoryNames.push(p.category_name);
                    if (p.subcategory_name) categoryNames.push(p.subcategory_name);

                    setProduct({
                        id: p.id,
                        name: p.product_name,
                        description: p.description,
                        shortDescription: p.description,
                        price: p.sale_price || p.base_price,
                        stock: p.quantity > 0 ? t("product.inStock") : t("product.outOfStock"),
                        sku: p.sku,
                        quantity: p.quantity,
                        weight: p.weight,
                        width: p.width,
                        height: p.height,
                        categories: categoryNames,
                        reviews: [],
                        colors: p.colors || [],
                        sizes: p.sizes || [],
                        tags,
                        images: [p.main_image, ...gallery].map((img) =>
                            `http://localhost:5000/${img.replace(/\\/g, "/")}`
                        ),
                    });
                } else {
                    setProduct(null);
                }
            } catch (error) {
                console.error("Product load error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product) {
            setSelectedColor(product.colors?.[0] || "");
            setSelectedSize(product.sizes?.[0] || "");
        }
    }, [product]);

    if (loading) return <div>{t("product.loading")}</div>;
    if (!product) return <div>{t("product.notFound")}</div>;

    /* ===================== */
    /* SHARED: Gallery Section */
    /* ===================== */
    const renderGallery = () => (
        <div className="ProductPage1-gallery">
            {layout === 4 ? (
                <>
                    {product.images?.map((img, idx) => (
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
                <>
                    <div className="main-image">
                        <img src={product.images[currentImage]} alt="Product" />
                        <button className="gallery-open-btn" onClick={() => setIsGalleryOpen(true)}>
                            <FiMaximize2 />
                        </button>
                        <button className="prev" onClick={prevImage}><FaChevronLeft /></button>
                        <button className="next" onClick={nextImage}><FaChevronRight /></button>
                    </div>
                    <div className={`ProductPage1-thumbnails ${layout === 3 ? "vertical" : ""}`}>
                        {product.images?.slice(0, 5).map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`Thumb ${idx + 1}`}
                                className={currentImage === idx ? "active" : ""}
                                onClick={() => setCurrentImage(idx)}
                            />
                        ))}
                    </div>
                </>
            )}

            {isGalleryOpen && (
                <div className="ProductPage1-overlay">
                    <button className="overlay-close" onClick={() => setIsGalleryOpen(false)}>
                        <FiX />
                    </button>
                    <button className="overlay-prev" onClick={prevImage}><FiArrowLeft /></button>
                    <img src={product.images[currentImage]} alt="Full View" className="overlay-image" />
                    <button className="overlay-next" onClick={nextImage}><FiArrowRight /></button>
                </div>
            )}
        </div>
    );

    /* ===================== */
    /* SHARED: Details Section */
    /* ===================== */
    const renderDetails = () => (
        <div className="ProductPage1-details">
            <div className="ProductPage1-breadcrumb">
                <a href="/">{t("common.home")}</a> <span>&gt;</span>
                <a href="/shop">{t("common.shop")}</a> <span>&gt;</span>
            </div>
            <h1>{product.name}</h1>
            <div className="rating-stock">
                <span>⭐ {product.rating} ({product.reviewsCount})</span>
                <span>{t("product.stock")} {product.stock}</span>
            </div>
            <p className="price">{product.price}</p>
            <p className="short-description">{product.shortDescription}</p>

            <div className="ProductPage1-color-selector">
                <p>{t("product.color")}</p>
                {product.colors?.map((color) => (
                    <span
                        key={color}
                        className={selectedColor === color ? "active" : ""}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                    />
                ))}
            </div>

            <div className="ProductPage1-size-selector">
                <p>{t("product.size")}</p>
                {product.sizes?.map((size) => (
                    <button
                        key={size}
                        className={selectedSize === size ? "active" : ""}
                        onClick={() => setSelectedSize(size)}
                    >
                        {size}
                    </button>
                ))}
            </div>

            <div className="ProductPage1-cart-row">
                <div className="ProductPage1-quantity">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
                <button className="ProductPage1-add-to-cart-btn" onClick={() => addToCart(product.id)}>
                    {t("product.addToCartBtn")}
                </button>
            </div>

            <div className="ProductPage1-actions">
                <button onClick={() => addWishlist(product.id)}><FiHeart /> {t("product.addToWishlist")}</button>
                <button><BiShuffle /> {t("product.compare")}</button>
            </div>

            <div className="ProductPage1-meta">
                <p>{t("product.sku")} {product.sku}</p>
                <p>{t("product.categories")} {product.categories.join(", ")}</p>
                <p>{t("product.tags")} {product.tags.join(", ")}</p>
                <div className="ProductPage1-share">
                    <span>{t("product.share")}</span>
                    <div className="ProductPage1-share-icons">
                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaLinkedinIn /></a>
                    </div>
                </div>
            </div>
        </div>
    );

    /* ===================== */
    /* SHARED: Tabs Section */
    /* ===================== */
    const renderTabs = () => (
        <div className="ProductPage1-tabs">
            <div className="ProductPage1-tab-buttons">
                <button className={activeTab === "description" ? "active" : ""} onClick={() => setActiveTab("description")}>
                    {t("product.description")}
                </button>
                <button className={activeTab === "additional" ? "active" : ""} onClick={() => setActiveTab("additional")}>
                    {t("product.additionalInfo")}
                </button>
                <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>
                    {t("product.reviews")} ({product.reviews.length})
                </button>
            </div>

            <div className="ProductPage1-tab-content">
                {activeTab === "description" && (
                    <>
                        <p>{product.description?.paragraph || product.description}</p>
                        <ul>
                            {product.description?.features?.map((item, idx) => (
                                <li key={idx}>
                                    <strong>{item.title}:</strong> {item.detail}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {activeTab === "additional" && <p>{product.additionalInfo}</p>}
                {activeTab === "reviews" && (
                    <div className="ProductPage1-reviews">
                        {product.reviews?.map((review, idx) => (
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

                        <div className="ProductPage1-review-form">
                            <h3>{t("product.writeReview")}</h3>
                            <div className="ProductPage1-rating-input">
                                <span>{t("product.yourRating")}</span>
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={`star ${star <= (hoverRating || userRating) ? "active" : ""}`}
                                            onClick={() => setUserRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <label>{t("product.yourReview")}</label>
                            <textarea rows="6"></textarea>
                            <button className="ProductPage1-submit-btn">{t("product.submit")}</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderRelated = () => (
        <div className="related-products">
            <h3>{t("product.relatedProducts")}</h3>
            <div className="related-products-grid">
                {relatedProducts.map((item) => (
                    <ProductCard key={item.id} product={item} />
                ))}
            </div>
        </div>
    );

    /* ===================== */
    /* LAYOUT 1: Classic — Gallery left, Details right */
    /* ===================== */
    if (layout === 1) {
        return (
            <>
                <div className="ProductPage1-container layout-1">
                    {renderGallery()}
                    {renderDetails()}
                </div>
                {renderTabs()}
                {renderRelated()}
            </>
        );
    }

    /* ===================== */
    /* LAYOUT 3: Reversed — Details left, Gallery right, vertical thumbs */
    /* ===================== */
    if (layout === 3) {
        return (
            <>
                <div className="ProductPage1-container layout-3">
                    {renderDetails()}
                    {renderGallery()}
                </div>
                {renderTabs()}
                {renderRelated()}
            </>
        );
    }

    /* ===================== */
    /* LAYOUT 4: Full-width stacked gallery, details on right */
    /* ===================== */
    return (
        <>
            <div className="ProductPage1-container layout-4">
                {renderGallery()}
                {renderDetails()}
            </div>
            {renderTabs()}
            {renderRelated()}
        </>
    );
};

export default ProductPage;
