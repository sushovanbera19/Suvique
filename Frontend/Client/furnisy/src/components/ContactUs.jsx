import { useState } from "react";
import React from 'react';
import '../assets/style/ContactUs.css';
import AccountHeader from '../Common/AccountHeader';
import MapSection from './MapSection';
import Reuseablebutton from '../Common/Commonbutton';
import { LocateFixed, Mail, Phone } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Message sent successfully");

        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };
  return (
    <>
      <AccountHeader />
      <div className="contact-outer">
        <div className="contact-inner">

          {/* Left - Form area */}
          <div className="form-area">
            <h2>Contact Us</h2>

            <div className="name-email-row">
              <div className="field">
                <label>Name</label>
                <input type="text" placeholder="" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" name="email"
                  value={formData.email}
                  onChange={handleChange} placeholder="" />
              </div>
            </div>

            <div className="field message-field">
              <label>Message</label>
              <textarea rows="5" name="message"
                value={formData.message}
                onChange={handleChange} placeholder=""></textarea>
            </div>
            <Reuseablebutton text="Submit" style={{ padding: "clamp(0.4rem, 1.0vw, 1.2rem) clamp(0.8rem, 3vw, 2.5rem)", fontSize: "clamp(1rem, 2vw, 1.5rem)", borderRadius: "0.5rem", fontWeight: 300, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", }} onClick={handleSubmit} />
          </div>

          {/* Right - Info area */}
          <div className="info-area">

            <div className="info-row">
              <span className="icon-circle">
                <LocateFixed />
              </span>
              <div className="info-text">
                <h4><u>Office Address</u></h4>
                <p>265 New Ave, California City-<br />100, USA.</p>
              </div>
            </div>

            <div className="info-row">
              <span className="icon-circle">
                <Mail />
              </span>
              <div className="info-text">
                <h4><u>Send Message</u></h4>
                <p>info@yourdomain.com</p>
              </div>
            </div>

            <div className="info-row">
              <span className="icon-circle">
                <Phone />
              </span>
              <div className="info-text">
                <h4><u>Call Us</u></h4>
                <p>(+0123) 2345 56789</p>
              </div>
            </div>

          </div>

        </div>
      </div>
      {/* Map Section */}
      <MapSection />
    </>
  );
};

export default Contact;