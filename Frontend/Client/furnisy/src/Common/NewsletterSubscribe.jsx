import { useState } from 'react';
import '../assets/style/NewsletterSubscribe.css';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim()) {
      console.log('Subscribing email:', email);
      setIsSubmitted(true);
      setEmail('');
      // Hide success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="newsletter-section">
      {/* Left: Text content */}
      <div className="newsletter-content">
        <h2>Subscribe to our newsletter and<br></br> Grab 30% OFF</h2>
        <p className="newsletter-description">
          We believe in keeping you at the forefront of innovation, information, and inspiration. 
          That's why we invite you to stay updated with our newsletter.
        </p>
      </div>

      {/* Right: Form */}
      <div className="newsletter-form-wrapper">
        <form onSubmit={handleSubmit} className="subscribe-form">
          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required className='newsletter_input'
            />
            <button type="submit" className="subscribe-btn">
              Subscribe now
            </button>
          </div>
        </form>

        {isSubmitted && (
          <p className="success-message">
            Thank you! You've been subscribed successfully 🎉
          </p>
        )}
      </div>
    </section>
  );
}
