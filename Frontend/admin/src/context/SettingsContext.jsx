import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

const COUNTRIES_API = "https://countriesnow.space/api/v0.1/countries/currency";

const LANGUAGES = [
  { code: "en", name: "English" }, { code: "fr", name: "French" },
  { code: "de", name: "German" }, { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" }, { code: "it", name: "Italian" },
  { code: "nl", name: "Dutch" }, { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" }, { code: "zh", name: "Chinese" },
  { code: "ko", name: "Korean" }, { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" }, { code: "bn", name: "Bengali" },
  { code: "tr", name: "Turkish" }, { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" }, { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" }, { code: "sv", name: "Swedish" },
  { code: "pl", name: "Polish" }, { code: "cs", name: "Czech" },
  { code: "ro", name: "Romanian" }, { code: "uk", name: "Ukrainian" },
  { code: "el", name: "Greek" }, { code: "he", name: "Hebrew" },
  { code: "fa", name: "Persian" }, { code: "sw", name: "Swahili" },
  { code: "am", name: "Amharic" }, { code: "ha", name: "Hausa" },
  { code: "yo", name: "Yoruba" }, { code: "zu", name: "Zulu" },
];

const DEFAULT_COUNTRY = {
  name: "India",
  flag: "https://flagcdn.com/w40/in.png",
};

export const SettingsProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(() => {
    const saved = localStorage.getItem("adminCountry");
    return saved ? JSON.parse(saved) : DEFAULT_COUNTRY;
  });
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem("adminLanguage") || "en";
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(COUNTRIES_API);
        const json = await res.json();
        if (!json.error) {
          const list = json.data
            .map((c) => ({
              name: c.name,
              iso2: c.iso2,
              currency: c.currency,
              flag: `https://flagcdn.com/w40/${c.iso2.toLowerCase()}.png`,
            }))
            .filter((item) => item.name && item.flag)
            .sort((a, b) => a.name.localeCompare(b.name));
          setCountries(list);
        }
      } catch {
        setCountries([]);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    localStorage.setItem("adminCountry", JSON.stringify(selectedCountry));
  }, [selectedCountry]);

  useEffect(() => {
    localStorage.setItem("adminLanguage", selectedLanguage);
  }, [selectedLanguage]);

  return (
    <SettingsContext.Provider
      value={{
        countries,
        selectedCountry,
        setSelectedCountry,
        selectedLanguage,
        setSelectedLanguage,
        languages: LANGUAGES,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
};
