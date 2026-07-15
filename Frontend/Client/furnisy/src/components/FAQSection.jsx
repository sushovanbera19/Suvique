// FAQSection.jsx
import React, { useState } from "react";
import faqImage from "../../public/images/faq.webp";
import AccountHeader from "./AccountHeader";
import "../assets/style/FAQSection.css";
import { useTranslation } from "../context/LanguageContext";

const FAQSection = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
    { question: t("faq.q7"), answer: t("faq.a7") },
    { question: t("faq.q8"), answer: t("faq.a8") },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="FaqSectionWrapper">
      <AccountHeader title="FAQ" breadcrumb="Home → FAQ" />
      <div className="FaqContainer">
         <h1 className="Faq_Heading">{t("faq.heading")}</h1>
        <div className="FaqRow">
          {/* Left Image */}
          <div className="FaqImageWrapper">
            <img src={faqImage} alt="FAQ" className="FaqImage" />
            <div className="FaqSupport">
              <p>{t("faq.customerSupport")}</p>
              <h5>support@yourdomain.com</h5>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="FaqAccordionWrapper">
           
            <div className="FaqAccordion">
              {faqs.map((faq, index) => (
                <div className="FaqItem" key={index}>
                  <button
                    className={`FaqButton ${openIndex === index ? "open" : ""}`}
                    onClick={() => toggleFAQ(index)}
                  >
                    {faq.question}
                    <span className="FaqIcon">{openIndex === index ? "-" : "+"}</span>
                  </button>
                  <div
                    className={`FaqCollapse ${openIndex === index ? "open" : ""}`}
                  >
                    <div className="FaqBody">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;