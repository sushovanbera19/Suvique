// =========================
// Language.jsx
// =========================

import { useEffect, useState } from "react";
import Select from "react-select";
import CommonModal from "../Common/CommonModal";
// import i18n from "../../i18n";

const Language = () => {
  const [open, setOpen] = useState(false);

  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [country, setCountry] = useState("India");
  const [language, setLanguage] = useState("English");

  // =========================
  // Fetch Online API
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,languages"
        );

        const data = await response.json();

        // Countries
        
        const countryList = data
          .map((item) => ({
            name: item.name?.common,
            flag: item.flags?.png,
          }))
          .filter((item) => item.name)
          .sort((a, b) =>
            a.name.localeCompare(b.name)
          );

        setCountries(countryList);

        // Languages
        const langSet = new Set();

        data.forEach((item) => {
          if (item.languages) {
            Object.values(item.languages).forEach(
              (lang) => langSet.add(lang)
            );
          }
        });

        setLanguages([...langSet].sort());

      } catch (error) {
        console.log("API Error:", error);
      }
    };

    fetchData();
  }, []);

  // Selected Country Flag
  const selectedCountry = countries.find(
    (c) => c.name === country
  );
  const countryOptions = countries.map((item) => ({
    value: item.name,
    label: item.name,
    flag: item.flag,
  }));
  return (
    <>
      {/* Language Button */}
      <div
        className="language-box"
        onClick={() => setOpen(true)}
      >
        <img
          src={
            selectedCountry?.flag ||
            "https://flagcdn.com/w40/in.png"
          }
          alt="flag"
        />

        <span>
          {country.slice(0, 2).toUpperCase()}
        </span>
      </div>

      {/* Modal */}
      <CommonModal
        isOpen={open}
        onClose={() => setOpen(false)}
        width="550px"
      >
        <div className="language-modal">

          {/* Country Dropdown */}
          <div className="modal-field">
            <label>Select Location</label>

            <Select
              options={countryOptions}
              value={countryOptions.find(
                (item) => item.value === country
              )}
              onChange={(selected) =>
                setCountry(selected.value)
              }
              className="react-select-container"
              classNamePrefix="react-select"
              formatOptionLabel={(item) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <img
                    src={item.flag}
                    alt={item.label}
                    style={{
                      width: "20px",
                      height: "15px",
                      objectFit: "cover",
                      borderRadius: "2px",
                    }}
                  />

                  <span>{item.label}</span>
                </div>
              )}
            />
          </div>

          {/* Language Dropdown */}
          <div className="modal-field">
            <label>Select Language</label>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              className="custom-select"
            >
              {languages.map((lang, index) => (
                <option
                  key={index}
                  value={lang}
                >
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Footer */}
          <div className="language-footer">
            <button
              className="close-btn"
              onClick={() => setOpen(false)}
            >
              Close
            </button>

            <button className="save-btn">
              Save changes
            </button>
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default Language;