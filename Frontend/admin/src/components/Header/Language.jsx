import { useState } from "react";
import Select from "react-select";
import CommonModal from "../Common/CommonModal";
import { useSettings } from "../../context/SettingsContext";
import { useTranslation } from "../../hooks/useTranslation";

const Language = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const {
    countries,
    selectedCountry,
    setSelectedCountry,
    selectedLanguage,
    setSelectedLanguage,
    languages,
  } = useSettings();

  const [tempCountry, setTempCountry] = useState(selectedCountry.name);
  const [tempLanguage, setTempLanguage] = useState(selectedLanguage);

  const selectedCountryData = countries.find((c) => c.name === tempCountry);
  const activeCountryData = countries.find((c) => c.name === selectedCountry.name);

  const countryOptions = countries.map((item) => ({
    value: item.name,
    label: item.name,
    flag: item.flag,
  }));

  const handleOpen = () => {
    setTempCountry(selectedCountry.name);
    setTempLanguage(selectedLanguage);
    setOpen(true);
  };

  const handleSave = () => {
    const countryData = countries.find((c) => c.name === tempCountry);
    if (countryData) {
      setSelectedCountry({
        name: countryData.name,
        flag: countryData.flag,
      });
    }
    setSelectedLanguage(tempLanguage);
    setOpen(false);
  };

  const displayLang = languages.find((l) => l.code === selectedLanguage);

  return (
    <>
      <div className="language-box" onClick={handleOpen}>
        <img
          src={activeCountryData?.flag || "https://flagcdn.com/w40/in.png"}
          alt="flag"
        />
        <span>{selectedLanguage.toUpperCase()}</span>
      </div>

      <CommonModal isOpen={open} onClose={() => setOpen(false)} width="550px">
        <div className="language-modal">
          <div className="modal-field">
            <label>{t("header.selectCountry")}</label>
            <Select
              options={countryOptions}
              value={countryOptions.find((item) => item.value === tempCountry)}
              onChange={(selected) => setTempCountry(selected.value)}
              className="react-select-container"
              classNamePrefix="react-select"
              formatOptionLabel={(item) => (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src={item.flag}
                    alt={item.label}
                    style={{ width: "20px", height: "15px", objectFit: "cover", borderRadius: "2px" }}
                  />
                  <span>{item.label}</span>
                </div>
              )}
            />
          </div>

          <div className="modal-field">
            <label>{t("header.selectLanguage")}</label>
            <select
              value={tempLanguage}
              onChange={(e) => setTempLanguage(e.target.value)}
              className="custom-select"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="language-footer">
            <button className="close-btn" onClick={() => setOpen(false)}>
              {t("header.close")}
            </button>
            <button className="save-btn" onClick={handleSave}>
              {t("header.saveChanges")}
            </button>
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default Language;
