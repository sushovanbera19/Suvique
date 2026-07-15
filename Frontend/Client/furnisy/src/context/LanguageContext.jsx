import React, { createContext, useContext } from "react";
import { useCountry } from "../context/CountryContext";
import translations from "../i18n/translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { selectedLanguage } = useCountry();

  const t = (key) => {
    const langTranslations = translations[selectedLanguage] || translations.en;
    return langTranslations[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ t, lang: selectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within a LanguageProvider");
  return ctx;
};
