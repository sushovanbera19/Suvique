import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ProductCard from "../Common/ProductCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // import icons
const SliderContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const SliderContent = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  gap: 20px;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border: none;
  padding: 20px;
  cursor: pointer;
  border-radius: 50%;
  font-size: 18px;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f0f0f0;
  }
`;

const PrevButton = styled(NavButton)`
  left: 10px;
`;

const NextButton = styled(NavButton)`
  right: 10px;
`;

const ProductSlider = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4); // default 4 cards for large screens

  // Adjust number of visible cards based on screen width
  const handleResize = () => {
    const width = window.innerWidth;
    if (width < 600) setVisibleCards(1);       // mobile
    else if (width < 1024) setVisibleCards(2); // tablet
    else setVisibleCards(4);                   // desktop
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex < products.length - visibleCards) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <SliderContainer>
      <PrevButton onClick={prevSlide}> <FaArrowLeft /></PrevButton>
      <NextButton onClick={nextSlide}> <FaArrowRight /></NextButton>
      <SliderContent
        style={{
          transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              flex: `0 0 ${100 / visibleCards}%`,
              maxWidth: `${100 / visibleCards}%`,
              boxSizing: "border-box",
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </SliderContent>
    </SliderContainer>
  );
};

export default ProductSlider;
