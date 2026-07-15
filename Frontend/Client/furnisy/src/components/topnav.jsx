import "../assets/style/Topnav.css"
import { useTranslation } from "../context/LanguageContext"

const Topnav = () => {
  const { t } = useTranslation();
  return (
    <div className="mainTop">
      <div>
        <div>
          <p onClick={() => {

            console.log("Promo text clicked!");

          }}
          >
            {t("topnav.promo")}
          </p>
        </div>
      </div>
      <div>
        <ul className="top-info">
          <li>{t("topnav.email")}</li>
          <li>{t("topnav.address")}</li>
          <li>{t("topnav.phone")}</li>
        </ul>
      </div>
    </div>
  );
}

export default Topnav;
