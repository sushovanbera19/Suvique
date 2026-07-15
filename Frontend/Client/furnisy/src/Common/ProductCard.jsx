import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaHeart, FaShoppingCart, FaEye, FaExchangeAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import { toastSuccess, toastError, toastLoginRequired, toastWarning } from "../utils/toast";
import { useCountry } from "../context/CountryContext";
import { useTranslation } from "../context/LanguageContext";


const Card = styled.div`
  text-align: left;
`;

const ProductImage = styled.img`
  width: 100%;
  display: block;
`;

const Tag = styled.div`
  position: absolute;
  top: 30px;
  left: 0;
  background: #000;
  color: #fff;
  font-family: "Dosis", sans-serif;
  font-weight: bold;
  font-size: 14px;
  padding: 13px 18px;
  z-index: 10;
  text-transform: uppercase;
  pointer-events: none; /* ensures tag won't react to hover */

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 4px 8px;
  }
`;

const Overlay = styled.div`
  position: absolute;
  bottom: -100%;
  left: 0;
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  opacity: 0;
  transition: bottom 0.4s ease, opacity 0.4s ease;
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;

  &:hover ${Overlay} {
    bottom: 0;
    opacity: 1;
  }
`;

const Icon = styled.div`
  position: relative;
  background: #fff;
  color: #000;
  font-size: 18px;
  width: 45px;
  height: 45px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease, color 0.3s ease;

  &:hover {
    transform: scale(1.15);
    background: #040404;
    color: #fff;
  }

  /* Tooltip */
  &::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 120%; /* above icon */
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    background: #fff;
    color: #605c5c;
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 6px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 20;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const Info = styled.div`
  margin-top: 10px;

  h4 {
    font-size: 25px;
    font-family: "Dosis", sans-serif;
    font-weight: bold;
    color: #191918;
    margin: 0;
  }

  p {
    font-size: 18px;
    font-family: "Dosis", sans-serif;
    font-weight: bold;
    color: #2d2d2c;
    margin: 0;
    line-height: 1.1;
  }
    @media (max-width: 768px) {
    h4 {
      font-size: 18px;
      line-height: 1.4;
    }
    p {
      font-size: 15px;
    }
  }

  @media (max-width: 480px) {
    h4 {
      font-size: 14px;
    }
    p {
      font-size: 13px;
    }
  }
`;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCompare, isInCompare } = useCompare();
  const { formatPrice } = useCountry();
  const { t } = useTranslation();
  const imageUrl = product.main_image?.replace(/\\/g, "/");
  let tag = null;
  try {
    tag = product.tags ? JSON.parse(product.tags)[0] : null;
  } catch (e) {
    tag = null;
  }

  const addToWishlist = async () => {
    
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toastSuccess(t("product.addedToWishlist"));
        navigate("/wishlist");
      } else {
        toastError(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

const addToCart = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toastLoginRequired();
      return;
    }

    const res = await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: product.product_id || product.id,
      }),
    });

    const text = await res.text(); // 🔥 IMPORTANT

    console.log("RAW RESPONSE:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.log("NOT JSON RESPONSE:", text);
      return;
    }

    if (data.success) {
      toastSuccess(t("product.addedToCart"));
      window.dispatchEvent(new Event("cartUpdated"));
    } else {
      toastError(data.message || t("product.failedToAdd"));
    }
  } catch (err) {
    console.log("Cart error:", err);
  }
};
  const handleCompare = () => {
    const result = addToCompare(product);
    if (!result.success) {
      toastWarning(result.message);
      return;
    }
    toastSuccess(result.message);
  };

  return (
    <Card>
      <ImageWrapper>
        {tag && <Tag>{tag}</Tag>}

        <ProductImage
          src={`http://localhost:5000/${imageUrl}`}
          alt={product.product_name}
        />

        <Overlay>
          <Icon data-tooltip={t("product.addToWishlist")} onClick={addToWishlist}><FaHeart /></Icon>
          <Icon data-tooltip={t("product.addToCart")} onClick={addToCart}><FaShoppingCart /></Icon>
          <Icon data-tooltip={t("product.quickView")} onClick={() => navigate(`/product-details-1/${product.id}`)}><FaEye /></Icon>
          <Icon
            data-tooltip={isInCompare(product.id) ? t("product.alreadyInCompare") : t("product.compare")}
            onClick={handleCompare}
            style={isInCompare(product.id) ? { background: "#040404", color: "#fff" } : {}}
          ><FaExchangeAlt /></Icon>
        </Overlay>
      </ImageWrapper>

      <Info>
        <h4 style={{ cursor: "pointer" }}
          onClick={() => navigate(`/product-details-1/${product.id}`)}>{product.product_name}</h4>
        <p>{formatPrice(product.sale_price || product.base_price)}</p>
      </Info>
    </Card>
  );
};

export default ProductCard;
