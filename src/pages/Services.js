import React, { useState, useEffect } from "react";

export default function Services() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      icon: "🔍",
      title: "Advanced Search & Filtering",
      description:
        "Find your perfect book with our advanced search functionality. Filter by category, price range, ratings, and more to discover exactly what you're looking for.",
      features: ["Smart Search", "Multi-Filter", "Saved Searches"],
      color: "blue",
    },
    {
      icon: "⭐",
      title: "Rating & Review System",
      description:
        "Share your thoughts with our 5-star rating system and detailed reviews. Help other readers make informed decisions and discover great books.",
      features: ["5-Star Ratings", "Detailed Reviews", "Community Feedback"],
      color: "yellow",
    },
    {
      icon: "🛒",
      title: "Shopping Cart & Wishlist",
      description:
        "Save books to your cart for easy checkout or add them to your wishlist to purchase later. Manage your reading list with ease.",
      features: ["Smart Cart", "Wishlist", "Quick Checkout"],
      color: "green",
    },
    {
      icon: "💳",
      title: "Secure Payment Options",
      description:
        "Choose from multiple secure payment methods including credit cards, debit cards, and other trusted payment gateways. Your transactions are safe and encrypted.",
      features: ["Multiple Methods", "Secure Encryption", "Quick Processing"],
      color: "purple",
    },
    {
      icon: "📦",
      title: "Fast Delivery",
      description:
        "We ensure quick and reliable delivery to your doorstep. Track your orders and receive updates on shipping status.",
      features: ["Fast Shipping", "Order Tracking", "Reliable Service"],
      color: "orange",
    },
    {
      icon: "👤",
      title: "Personalized Experience",
      description:
        "Create an account to enjoy personalized recommendations, order history, and a tailored browsing experience based on your preferences.",
      features: ["AI Recommendations", "Order History", "Custom Lists"],
      color: "pink",
    },
  ];

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <h1 className="page-title">Our Services</h1>

        {/* Services Intro */}
        <section className={`services-intro ${isVisible ? "fade-in" : ""}`}>
          <p className="intro-text">
            Discover a world of reading possibilities with our comprehensive
            range of services designed to enhance your book shopping experience.
            From advanced search capabilities to personalized recommendations,
            we've got everything you need.
          </p>
        </section>

        {/* Services Grid */}
        <section className="services-grid-section">
          <div className="services-grid-advanced">
            {services.map((service, index) => (
              <div
                key={index}
                className={`service-card-advanced ${isVisible ? "slide-in" : ""} service-${service.color}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="service-card-inner">
                  <div className="service-icon-container">
                    <div className="service-icon-large">{service.icon}</div>
                    <div className="service-icon-ring"></div>
                    <div className="service-icon-glow"></div>
                  </div>
                  <div className="service-content">
                    <h2>{service.title}</h2>
                    <p>{service.description}</p>
                    <div className="service-features">
                      {service.features.map((feature, idx) => (
                        <span key={idx} className="feature-tag">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="service-card-overlay"></div>
                  <div className="service-card-shine"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Features */}
        <section className="additional-features">
          <div className="section-header">
            <h2>Additional Features</h2>
            <div className="section-divider"></div>
          </div>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <div className="feature-text">
                <h4>24/7 Customer Support</h4>
                <p>Get help whenever you need it with our round-the-clock support team.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <div className="feature-text">
                <h4>Easy Returns</h4>
                <p>Hassle-free return policy if you're not satisfied with your purchase.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <div className="feature-text">
                <h4>Gift Wrapping</h4>
                <p>Make your gift special with our beautiful gift wrapping service.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <div className="feature-text">
                <h4>Book Recommendations</h4>
                <p>AI-powered recommendations based on your reading history and preferences.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <div className="feature-text">
                <h4>Reading Lists</h4>
                <p>Create and share custom reading lists with friends and family.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <div className="feature-text">
                <h4>E-Book Support</h4>
                <p>Access your favorite books in digital format for reading on any device.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
