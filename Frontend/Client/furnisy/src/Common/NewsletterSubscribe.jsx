import { useState } from 'react';
import '../assets/style/NewsletterSubscribe.css';
import { useTranslation } from '../context/LanguageContext';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) return;

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
        setEmail('');
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        setErrorMessage(data.message || 'Something went wrong');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    } catch (err) {
      setErrorMessage('Server error. Please try again later.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-content">
        <h2>{t("newsletter.title1")}<br /> {t("newsletter.title2")}</h2>
        <p className="newsletter-description">
          {t("newsletter.desc1")}{" "}
          {t("newsletter.desc2")}
        </p>
      </div>

      <div className="newsletter-form-wrapper">
        <form onSubmit={handleSubmit} className="subscribe-form">
          <div className="input-wrapper">
            <input
              type="email"
              placeholder={t("newsletter.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="newsletter_input"
            />
            <button type="submit" className="subscribe-btn" disabled={loading}>
              {loading ? t("newsletter.subscribing") : t("newsletter.subscribe")}
            </button>
          </div>
        </form>

        {isSubmitted && (
          <p className="success-message">
            {t("newsletter.success")}
          </p>
        )}

        {errorMessage && (
          <p className="error-message">
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  );
}
