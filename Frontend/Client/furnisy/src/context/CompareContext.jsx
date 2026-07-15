import React, { createContext, useContext, useState, useEffect } from "react";

const CompareContext = createContext();

const MAX_COMPARE = 4;

export const CompareProvider = ({ children }) => {
  const [compareIds, setCompareIds] = useState(() => {
    const saved = localStorage.getItem("compareIds");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("compareIds", JSON.stringify(compareIds));
  }, [compareIds]);

  const addToCompare = (product) => {
    if (compareIds.find((p) => p.id === product.id)) {
      return { success: false, message: "Product already in compare list" };
    }

    if (compareIds.length >= MAX_COMPARE) {
      return { success: false, message: `Maximum ${MAX_COMPARE} products can be compared` };
    }

    setCompareIds((prev) => [
      ...prev,
      {
        id: product.id,
        product_name: product.product_name,
        base_price: product.base_price,
        sku: product.sku,
        main_image: product.main_image,
        quantity: product.quantity,
        category_name: product.category_name || "",
      },
    ]);

    return { success: true, message: "Added to compare" };
  };

  const removeFromCompare = (productId) => {
    setCompareIds((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareIds([]);
  };

  const isInCompare = (productId) => {
    return compareIds.some((p) => p.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        compareCount: compareIds.length,
        maxCompare: MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
