import { useLocation, useParams, useNavigate } from "react-router-dom";
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
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [additionalInfo, setAdditionalInfo] = useState([]);
    const [productReviews, setProductReviews] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviewName, setReviewName] = useState("");
    const [reviewText, setReviewText] = useState("");
    const { t } = useTranslation();
    const navigate = useNavigate();

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
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity,
                    variation_id: selectedVariation?.variation_id || null,
                }),
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

    const buyNow = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) { toastLoginRequired(); return; }
            const res = await fetch("http://localhost:5000/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: quantity,
                    variation_id: selectedVariation?.variation_id || null,
                }),
            });
            const data = await res.json();
            if (data.success) {
                navigate("/checkout");
            } else {
                toastError(data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const submitReview = async () => {
        try {
            if (!reviewName.trim()) { toastError(t("product.reviewNameRequired") || "Please enter your name"); return; }
            if (!reviewText.trim()) { toastError(t("product.reviewTextRequired") || "Please write your review"); return; }
            if (!userRating) { toastError(t("product.reviewRatingRequired") || "Please select a rating"); return; }

            const res = await fetch("http://localhost:5000/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: reviewName.trim(),
                    role: "Customer",
                    text: reviewText.trim(),
                    rating: userRating,
                    product_id: product.id,
                    status: "active",
                }),
            });
            const data = await res.json();
            if (data.success) {
                toastSuccess(t("product.reviewSuccess") || "Review submitted successfully!");
                setReviewName("");
                setReviewText("");
                setUserRating(0);
                setHoverRating(0);
                const refresh = await fetch(`http://localhost:5000/api/reviews/product/${product.id}`);
                const refreshData = await refresh.json();
                setProductReviews(refreshData.data || []);
            } else {
                toastError(data.message || "Failed to submit review");
            }
        } catch (err) {
            console.log(err);
            toastError("Failed to submit review");
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
                        category_id: p.category_id,
                        categories: categoryNames,
                        reviews: [],
                        colors: p.colors || [],
                        sizes: p.sizes || [],
                        variationMap: p.variationMap || [],
                        tags,
                        images: [p.main_image, ...gallery].map((img) =>
                            `http://localhost:5000/${img.replace(/\\/g, "/")}`
                        ),
                    });
                } else {
                    setProduct(null);
                }

                // fetch additional info
                try {
                    const infoRes = await fetch(`http://localhost:5000/api/product-info/product/${id}`);
                    const infoData = await infoRes.json();
                    if (infoData.success) setAdditionalInfo(infoData.data);
                } catch (infoErr) { console.log(infoErr); }

                // fetch product reviews
                try {
                    const revRes = await fetch(`http://localhost:5000/api/reviews/product/${id}`);
                    const revData = await revRes.json();
                    if (revData.success) setProductReviews(revData.data);
                } catch (revErr) { console.log(revErr); }
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
            const firstColor = product.colors?.[0] || "";
            const firstSize = product.sizes?.[0] || "";
            setSelectedColor(firstColor);
            setSelectedSize(firstSize);
            if (firstColor && firstSize && product.variationMap?.length > 0) {
                const match = product.variationMap.find(
                    (v) => v.color_code === firstColor && v.size === firstSize
                );
                setSelectedVariation(match || null);
            }
        }
    }, [product]);

    useEffect(() => {
        const fetchRelated = async () => {
            if (!product?.category_id) return;
            try {
                const res = await fetch(
                    `http://localhost:5000/api/products/shop?page=1&limit=8&category=${product.category_id}`
                );
                const data = await res.json();
                if (data.success) {
                    let items = data.data.filter((p) => p.id !== product.id);
                    if (items.length < 4) {
                        const res2 = await fetch(`http://localhost:5000/api/products?page=1&limit=8`);
                        const data2 = await res2.json();
                        if (data2.success) {
                            const existingIds = items.map((p) => p.id).concat(product.id);
                            const more = data2.data.filter((p) => !existingIds.includes(p.id));
                            items = [...items, ...more];
                        }
                    }
                    setRelatedProducts(items.slice(0, 4));
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchRelated();
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
    const resolveVariation = (color, size) => {
        if (!color || !size || !product?.variationMap?.length) {
            setSelectedVariation(null);
            return;
        }
        const match = product.variationMap.find(
            (v) => v.color_code === color && v.size === size
        );
        setSelectedVariation(match || null);
    };

    const displayPrice = selectedVariation?.base_price || product.price;
    const displayStock = selectedVariation?.quantity > 0
        ? t("product.inStock")
        : selectedVariation?.quantity === 0
        ? t("product.outOfStock")
        : product.stock;

    const renderDetails = () => (
        <div className="ProductPage1-details">
            <div className="ProductPage1-breadcrumb">
                <a href="/">{t("common.home")}</a> <span>&gt;</span>
                <a href="/Shop-1">{t("common.shop")}</a> <span>&gt;</span>
            </div>
            <h1>{product.name}</h1>
            <div className="rating-stock">
                <span>⭐ {product.rating} ({product.reviewsCount})</span>
                <span>{t("product.stock")} {displayStock}</span>
            </div>
            <p className="price">{displayPrice}</p>
            <p className="short-description">{product.shortDescription}</p>

            <div className="ProductPage1-color-selector">
                <p>{t("product.color")}</p>
                {product.colors?.map((color) => (
                    <span
                        key={color}
                        className={selectedColor === color ? "active" : ""}
                        style={{ backgroundColor: color }}
                        onClick={() => { setSelectedColor(color); resolveVariation(color, selectedSize); }}
                    />
                ))}
            </div>

            <div className="ProductPage1-size-selector">
                <p>{t("product.size")}</p>
                {product.sizes?.map((size) => (
                    <button
                        key={size}
                        className={selectedSize === size ? "active" : ""}
                        onClick={() => { setSelectedSize(size); resolveVariation(selectedColor, size); }}
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
                <button className="ProductPage1-buy-now-btn" onClick={buyNow}>
                    {t("product.buyNow") || "Buy Now"}
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
                    {t("product.reviews")} ({productReviews.length})
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
                {activeTab === "additional" && (
                    <div className="ProductPage1-additional-info">
                        {additionalInfo.length === 0 ? (
                            <p>{t("product.noAdditionalInfo") || "No additional information available."}</p>
                        ) : (
                            additionalInfo.map((item) => (
                                <div key={item.id} className="info-section">
                                    <h4>{item.heading}</h4>
                                    {item.info_type === "text" && <p>{item.content}</p>}
                                    {item.info_type === "list" && (
                                        <ul>
                                            {(item.content || "").split("\n").filter(Boolean).map((line, i) => (
                                                <li key={i}>{line.trim()}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {item.info_type === "table" && (() => {
                                        try {
                                            const rows = JSON.parse(item.content || "[]");
                                            return (
                                                <table className="info-table">
                                                    <tbody>
                                                        {rows.map((row, i) => (
                                                            <tr key={i}>
                                                                <td className="info-table-key">{row.key}</td>
                                                                <td className="info-table-value">{row.value}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            );
                                        } catch { return null; }
                                    })()}
                                </div>
                            ))
                        )}
                    </div>
                )}
                {activeTab === "reviews" && (
                    <div className="ProductPage1-reviews">
                        {productReviews.length === 0 ? (
                            <p className="ppr-empty">{t("product.noReviews") || "No reviews yet for this product."}</p>
                        ) : (
                            productReviews.map((review) => (
                                <div key={review.id} className="ppr-card">
                                    <div className="ppr-card-header">
                                        <img className="ppr-card-avatar" src={review.avatar?.startsWith("/") ? review.avatar : `/images/${review.avatar}`} alt={review.name} onError={(e) => e.target.src = "/images/user-1.webp"} />
                                        <div>
                                            <div className="ppr-card-name">{review.name}</div>
                                            <div className="ppr-card-role">{review.role}</div>
                                        </div>
                                    </div>
                                    <div className="ppr-card-stars">
                                        {Array.from({ length: review.rating || 5 }).map((_, i) => "★").join("")}
                                    </div>
                                    <div className="ppr-card-text">{review.text}</div>
                                </div>
                            ))
                        )}

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
                            <label>{t("product.reviewName") || "Your Name"}</label>
                            <input
                                type="text"
                                className="ProductPage1-name-input"
                                placeholder={t("product.reviewNamePlaceholder") || "Enter your name"}
                                value={reviewName}
                                onChange={(e) => setReviewName(e.target.value)}
                            />
                            <label>{t("product.yourReview")}</label>
                            <textarea
                                rows="6"
                                placeholder={t("product.reviewPlaceholder") || "Write your review here..."}
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                            ></textarea>
                            <button className="ProductPage1-submit-btn" onClick={submitReview}>{t("product.submit")}</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderRelated = () => {
        if (relatedProducts.length === 0) return null;
        return (
            <div className="related-products">
                <h3>{t("product.relatedProducts")}</h3>
                <div className="related-products-grid">
                    {relatedProducts.map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            </div>
        );
    };

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
