import { useSettings } from "../context/SettingsContext";
import adminTranslations from "../i18n/adminTranslations";

export const useTranslation = () => {
  const { selectedLanguage } = useSettings();

  const t = (key) => {
    const langData = adminTranslations[selectedLanguage] || adminTranslations.en;
    return langData[key] || adminTranslations.en[key] || key;
  };

  return { t, lang: selectedLanguage };
};
