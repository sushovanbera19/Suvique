// FAQSection.jsx
import React, { useState } from "react";
import faqImage from "../../public/images/faq.webp";
import AccountHeader from "./AccountHeader";
import "../assets/style/FAQSection.css";

const faqs = [
  {
    question: "What is your return policy?",
    answer:
      "Simply fill out our online quote request with details about your shipment, including origin, destination, dimensions, and weight. Once we receive your request, one our logistics experts will contact you with a customized.",
  },
  { question: "How do I track my order?", answer: "Simply fill out our online quote request with details about your shipment, including origin, destination, dimensions, and weight. Once we receive your request, one our logistics experts will contact you with a customized." },
  { question: "What payment methods do you accept?", answer: "Simply fill out our online quote request with details about your shipment, including origin, destination, dimensions, and weight. Once we receive your request, one our logistics experts will contact you with a customized." },
  { question: "Do you offer international shipping?", answer: "Yes, we ship internationally. Shipping charges may apply." },
  { question: "How can I contact your customer support?", answer: "You can email us at support@yourdomain.com or call us at 123-456-7890." },
  { question: "Are the sizes true to measurements?", answer: "Yes, all sizes are accurate according to our specifications." },
  { question: "Can I modify or cancel my order after it's been placed?", answer: "Yes, modifications or cancellations are possible if done within 24 hours of placing the order." },
  { question: "Do you offer online ordering and shipping?", answer: "Yes, you can place orders online and we will ship them to your address." },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="FaqSectionWrapper">
      <AccountHeader />
      <div className="FaqContainer">
         <h1 className="Faq_Heading">Frequently Asked Questions</h1>
        <div className="FaqRow">
          {/* Left Image */}
          <div className="FaqImageWrapper">
            <img src={faqImage} alt="FAQ" className="FaqImage" />
            <div className="FaqSupport">
              <p>Customer support</p>
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