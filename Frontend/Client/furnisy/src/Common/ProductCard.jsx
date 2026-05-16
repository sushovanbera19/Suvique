import React from "react";
import styled from "styled-components";
import { FaHeart, FaShoppingCart, FaEye, FaExchangeAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


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
    line-height: 1.9;
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
  return (
    <Card>
      <ImageWrapper>
        {product.tag && <Tag>{product.tag}</Tag>}
        <ProductImage src={product.img} alt={product.name} />

        <Overlay>
          <Icon data-tooltip="Add to Wishlist" onClick={() => navigate("/wishlist")}><FaHeart /></Icon>
          <Icon data-tooltip="Add to Cart" onClick={() => navigate("/cart")}><FaShoppingCart /></Icon>
          <Icon data-tooltip="Quick View" onClick={() => navigate("/product-details-1")}><FaEye /></Icon>
          <Icon data-tooltip="Compare" onClick={() => navigate("/compare")}><FaExchangeAlt /></Icon>
        </Overlay>
      </ImageWrapper>

      <Info>
        <h4>{product.name}</h4>
        <p>{product.price}</p>
      </Info>
    </Card>
  );
};

export default ProductCard;
