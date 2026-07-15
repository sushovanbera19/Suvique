import React, { createContext, useContext, useState, useEffect } from "react";

const CountryContext = createContext();

const CURRENCY_SYMBOLS = {
  USD: "$", EUR: "€", GBP: "£", INR: "₹", JPY: "¥", CNY: "¥",
  BRL: "R$", RUB: "₽", KRW: "₩", CAD: "C$", AUD: "A$", CHF: "CHF",
  SEK: "kr", NZD: "NZ$", MXN: "MX$", SGD: "S$", HKD: "HK$",
  NOK: "kr", TRY: "₺", ZAR: "R", BGN: "лв", HRK: "kn",
  CZK: "Kč", DKK: "kr", HUF: "Ft", PLN: "zł", RON: "lei",
  THB: "฿", MYR: "RM", PHP: "₱", IDR: "Rp", VND: "₫",
  EGP: "E£", NGN: "₦", KES: "KSh", GHS: "GH₵", AED: "د.إ",
  SAR: "﷼", QAR: "QR", PKR: "₨", BDT: "৳", LKR: "Rs",
  NPR: "Rs", MMK: "K", KZT: "₸", UZS: "сўм", GEL: "₾",
  ISK: "kr", MAD: "MAD", DZD: "DZD", TND: "DT", JOD: "JD",
  LBP: "L£", IRR: "﷼", IQD: "ع.د", KWD: "KD", BHD: "BD",
  OMR: "﷼", YER: "﷼", SOS: "Sh", UGX: "USh", TZS: "TSh",
  ZMW: "ZK", MZN: "MT", MGA: "Ar", XOF: "CFA", XAF: "FCFA",
  CDF: "FC", GNF: "FG", SLL: "Le", LRD: "L$", CVE: "Esc",
  STN: "Db", MUR: "₨", SCR: "₨", MVR: "Rf", BND: "B$",
  FJD: "FJ$", TOP: "T$", WST: "WS$", VUV: "VT", KMF: "CF",
  DJF: "Fdj", ERN: "Nfk", SZL: "E", LSL: "L", NAD: "N$",
  GMD: "D", BWP: "P", SCR2: "₨", KID: "$", JMD: "J$",
  TTD: "TT$", HTG: "G", DOP: "RD$", CUP: "CUP", MXN2: "$",
  GTQ: "Q", HNL: "L", SVC: "$", NIO: "C$", CRC: "₡",
  PAB: "B/.", PYG: "₲", UYU: "$U", BOB: "Bs", PEN: "S/",
  CLP: "$", ARS: "$", CNY2: "¥", KPW: "₩", MNT: "₮",
  LAK: "₭", KHR: "៛", TJS: "SM", KGS: "сом", TMT: "T",
  AFN: "؋", ALL: "L", BAM: "KM", ISK2: "kr", MKD: "ден",
  RSD: "din", MDL: "lei", UAH: "₴", AZN: "₼", AMD: "֏",
  GEL2: "₾", BYN: "Br", KZT2: "₸"
};

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
  iso2: "IN",
  currency: "INR",
  flag: "https://flagcdn.com/w40/in.png",
};

export const CountryProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(() => {
    const saved = localStorage.getItem("selectedCountry");
    return saved ? JSON.parse(saved) : DEFAULT_COUNTRY;
  });
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem("selectedLanguage") || "en";
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/currency");
        const json = await res.json();
        if (!json.error) {
          const list = json.data.map(c => ({
            name: c.name,
            iso2: c.iso2,
            currency: c.currency,
            flag: `https://flagcdn.com/w40/${c.iso2.toLowerCase()}.png`,
          }));
          list.sort((a, b) => a.name.localeCompare(b.name));
          setCountries(list);
        }
      } catch {
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedCountry", JSON.stringify(selectedCountry));
  }, [selectedCountry]);

  useEffect(() => {
    localStorage.setItem("selectedLanguage", selectedLanguage);
  }, [selectedLanguage]);

  const formatPrice = (amount) => {
    const num = Number(amount);
    if (isNaN(num)) return `${CURRENCY_SYMBOLS[selectedCountry.currency] || "₹"}0.00`;
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: selectedCountry.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    } catch {
      const sym = CURRENCY_SYMBOLS[selectedCountry.currency] || selectedCountry.currency;
      return `${sym}${num.toFixed(2)}`;
    }
  };

  const getCurrencySymbol = () => {
    return CURRENCY_SYMBOLS[selectedCountry.currency] || selectedCountry.currency;
  };

  const getFlagUrl = (iso2) => {
    if (!iso2) return null;
    return `https://flagcdn.com/w40/${iso2.toLowerCase()}.png`;
  };

  return (
    <CountryContext.Provider
      value={{
        countries,
        selectedCountry,
        setSelectedCountry,
        selectedLanguage,
        setSelectedLanguage,
        formatPrice,
        getCurrencySymbol,
        getFlagUrl,
        loading,
        languages: LANGUAGES,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => {
  const ctx = useContext(CountryContext);
  if (!ctx) throw new Error("useCountry must be used within a CountryProvider");
  return ctx;
};
