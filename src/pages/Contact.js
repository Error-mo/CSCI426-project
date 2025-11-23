import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <h1 className="page-title">Contact Us</h1>
        
        <div className="contact-container">
          <section className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              Have a question or need assistance? We're here to help! Reach out to us through 
              any of the following methods.
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <h3>📧 Email</h3>
                <p>support@bookstore.com</p>
              </div>
              <div className="contact-item">
                <h3>📞 Phone</h3>
                <p>+961 70 234 451</p>
              </div>
              <div className="contact-item">
                <h3>📍 Address</h3>
                <p>The Red Street<br />Beirut City, RS 12345</p>
              </div>
              <div className="contact-item">
                <h3>🕒 Business Hours</h3>
                <p>Monday - Friday: 13:00 PM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </section>

          <section className="contact-form-section">
            <h2>Send us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}


