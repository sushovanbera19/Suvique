import { useState, useEffect } from "react";
import faqImage from "../../public/images/faq.webp";
import AccountHeader from "./AccountHeader";
import "../assets/style/FAQSection.css";
import { useTranslation } from "../context/LanguageContext";

const API = "http://localhost:5000";

const FAQSection = () => {
  const { t, lang } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, [lang]);

  const fetchFaqs = async () => {
    try {
      const res = await fetch(`${API}/api/faqs/active?lang=${lang}`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setFaqs(data.data);
      } else {
        setFallbackFaqs();
      }
    } catch (err) {
      console.log(err);
      setFallbackFaqs();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackFaqs = () => {
    const fallback = [];
    for (let i = 1; i <= 8; i++) {
      const q = t(`faq.q${i}`);
      const a = t(`faq.a${i}`);
      if (q !== `faq.q${i}`) {
        fallback.push({ id: i, question: q, answer: a });
      }
    }
    setFaqs(fallback);
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="FaqSectionWrapper">
      <AccountHeader title={t("faq.title")} breadcrumb={`${t("breadcrumb.home")} → ${t("breadcrumb.faq")}`} />
      <div className="FaqContainer">
        <h1 className="Faq_Heading">{t("faq.heading")}</h1>
        <div className="FaqRow">
          <div className="FaqImageWrapper">
            <img src={faqImage} alt="FAQ" className="FaqImage" />
            <div className="FaqSupport">
              <p>{t("faq.customerSupport")}</p>
              <h5>support@yourdomain.com</h5>
            </div>
          </div>

          <div className="FaqAccordionWrapper">
            {loading ? (
              <p style={{ textAlign: "center", padding: "40px", color: "#999" }}>{t("common.loading")}</p>
            ) : (
              <div className="FaqAccordion">
                {faqs.map((faq, index) => (
                  <div className="FaqItem" key={faq.id || index}>
                    <button
                      className={`FaqButton ${openIndex === index ? "open" : ""}`}
                      onClick={() => toggleFAQ(index)}
                    >
                      {faq.question}
                      <span className="FaqIcon">{openIndex === index ? "-" : "+"}</span>
                    </button>
                    <div className={`FaqCollapse ${openIndex === index ? "open" : ""}`}>
                      <div className="FaqBody">{faq.answer}</div>
                    </div>
                  </div>
                ))}
                {faqs.length === 0 && (
                  <p style={{ textAlign: "center", padding: "40px", color: "#999" }}>{t("common.noData")}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
