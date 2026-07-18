import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useCountry } from "../../context/CountryContext";
import { useTranslation } from "../../context/LanguageContext";

const SearchModal = ({ open, onClose }) => {

    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [products, setProducts] = useState([]);
    const { formatPrice } = useCountry();
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Load Categories
    useEffect(() => {

        fetch("http://localhost:5000/api/product-category/all")
            .then((res) => res.json())
            .then((data) => {

                setCategories(data.categories || []);

            })
            .catch(console.error);

    }, []);

    // Search Products
    const searchProduct = async () => {

        try {

            const res = await fetch(
                `http://localhost:5000/api/products/search?category=${selectedCategory}&keyword=${encodeURIComponent(keyword)}`
            );

            const data = await res.json();

            if (data.success) {

                setProducts(data.data);

            } else {

                setProducts([]);

            }

        } catch (err) {

            console.log(err);
            setProducts([]);

        }

    };

    // Live Search
    useEffect(() => {

        if (!open) return;

        const controller = new AbortController();

        const timer = setTimeout(async () => {

            try {
                const res = await fetch(
                    `http://localhost:5000/api/products/search?category=${selectedCategory}&keyword=${encodeURIComponent(keyword)}`,
                    { signal: controller.signal }
                );
                const data = await res.json();
                if (data.success) {
                    setProducts(data.data);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.log(err);
                    setProducts([]);
                }
            }

        }, 300);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };

    }, [keyword, selectedCategory, open]);

    if (!open) return null;

    return (
        <div
            className="search-modal-overlay"
            onClick={onClose}
        >
            <div
                className="search-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="search-modal-header">

                        <h3>{t("menu.searchProducts") || "Search Products"}</h3>

                    <button onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>

                </div>

                <div className="search-modal-row">

                    <select
                        className="category-dropdown"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >

                        <option value="">{t("shop.allCategories") || "All Categories"}</option>

                        {categories.map((cat) => (

                            <option
                                key={cat.category_id}
                                value={cat.category_id}
                            >
                                {cat.category_name}
                            </option>

                        ))}

                    </select>

                    <input
                        type="text"
                        placeholder={t("menu.searchProducts") || "Search products..."}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />

                </div>

                <div className="search-results">

                    {products.length > 0 ? (
                        <>
                        {products.map((product) => (

                            <Link
                                to={`/product-details-1/${product.id}`}
                                key={product.id}
                                className="search-item"
                                onClick={onClose}
                            >

                                <img
                                    src={`http://localhost:5000/${product.main_image.replace(/\\/g, "/")}`}
                                    alt={product.product_name}
                                    width="70"
                                    height="70"
                                />

                                <div>

                                    <h4>{product.product_name}</h4>

                                    <p>{product.category_name}</p>

                                    <strong>
                                        {formatPrice(product.sale_price || product.base_price)}
                                    </strong>

                                </div>

                            </Link>

                        ))}
                        <div className="search-view-all">
                            <button onClick={() => {
                                const params = [];
                                if (keyword.trim()) params.push(`q=${encodeURIComponent(keyword.trim())}`);
                                if (selectedCategory) params.push(`category=${selectedCategory}`);
                                onClose();
                                navigate(`/search${params.length ? "?" + params.join("&") : ""}`);
                            }}>
                                View All Results ({products.length})
                            </button>
                        </div>
                        </>
                    ) : (

                        (keyword || selectedCategory) && (

                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "20px"
                                }}
                            >
                                {t("shop.noProducts")}
                            </div>

                        )

                    )}

                </div>

            </div>
        </div>
    );

};

export default SearchModal;