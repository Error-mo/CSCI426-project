import React, { useState, useEffect } from "react";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { number: "10K+", label: "Books Available", icon: "📚" },
    { number: "50K+", label: "Happy Customers", icon: "😊" },
    { number: "500+", label: "Authors", icon: "✍️" },
    { number: "24/7", label: "Support", icon: "💬" },
  ];

  const values = [
    {
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service, from book selection to customer support.",
      icon: "⭐",
    },
    {
      title: "Innovation",
      description: "Constantly innovating to provide the best online book shopping experience.",
      icon: "🚀",
    },
    {
      title: "Community",
      description: "Building a community of book lovers who share their passion for reading.",
      icon: "👥",
    },
    {
      title: "Accessibility",
      description: "Making quality books accessible to everyone, everywhere.",
      icon: "🌍",
    },
  ];

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <h1 className="page-title">About Us</h1>

        {/* Hero Section */}
        <section className={`about-hero ${isVisible ? "fade-in" : ""}`}>
          <div className="hero-content">
            <h2 className="hero-title">Welcome to Our Online Bookstore</h2>
            <p className="hero-description">
              We are passionate about books and committed to providing you with
              the best reading experience. Our online bookstore offers a vast
              collection of books across various genres, from fiction to
              non-fiction, science to history, and everything in between.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`stat-card ${isVisible ? "slide-up" : ""}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className={`about-section mission-section ${isVisible ? "fade-in" : ""}`}>
          <div className="section-header">
            <h2>Our Mission</h2>
            <div className="section-divider"></div>
          </div>
          <div className="mission-content">
            <div className="mission-text">
              <p>
                Our mission is to make quality books accessible to everyone. We
                believe that books have the power to transform lives, inspire
                creativity, and expand horizons. We strive to curate a collection
                that caters to all tastes and interests.
              </p>
              <p>
                Through our platform, we aim to connect readers with stories
                that matter, knowledge that empowers, and adventures that
                inspire. Every book in our collection is carefully selected to
                ensure quality and value for our customers.
              </p>
            </div>
            <div className="mission-visual">
              <div className="floating-book">📖</div>
              <div className="floating-book">📚</div>
              <div className="floating-book">✨</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="about-section features-section">
          <div className="section-header">
            <h2>Why Choose Us?</h2>
            <div className="section-divider"></div>
          </div>
          <div className="features-grid">
            <div className="feature-card advanced">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📚</div>
                <div className="icon-glow"></div>
              </div>
              <h3>Wide Selection</h3>
              <p>
                Thousands of books across multiple categories, from bestsellers
                to rare finds, ensuring you'll always find something perfect.
              </p>
              <div className="feature-badge">Popular</div>
            </div>
            <div className="feature-card advanced">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">⭐</div>
                <div className="icon-glow"></div>
              </div>
              <h3>Quality Reviews</h3>
              <p>
                Read authentic reviews from fellow readers to make informed
                decisions and discover your next favorite book.
              </p>
              <div className="feature-badge">Trusted</div>
            </div>
            <div className="feature-card advanced">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🛒</div>
                <div className="icon-glow"></div>
              </div>
              <h3>Easy Shopping</h3>
              <p>
                Simple and secure checkout process with multiple payment options
                for your convenience.
              </p>
              <div className="feature-badge">Secure</div>
            </div>
            <div className="feature-card advanced">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">💳</div>
                <div className="icon-glow"></div>
              </div>
              <h3>Multiple Payment Options</h3>
              <p>
                Pay the way that's convenient for you with our secure payment
                gateway supporting all major methods.
              </p>
              <div className="feature-badge">Flexible</div>
            </div>
            <div className="feature-card advanced">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🚚</div>
                <div className="icon-glow"></div>
              </div>
              <h3>Fast Delivery</h3>
              <p>
                Quick and reliable delivery service to get your books to you as
                fast as possible, wherever you are.
              </p>
              <div className="feature-badge">Fast</div>
            </div>
            <div className="feature-card advanced">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🎯</div>
                <div className="icon-glow"></div>
              </div>
              <h3>Personalized Recommendations</h3>
              <p>
                Get book recommendations tailored to your reading preferences
                and past purchases.
              </p>
              <div className="feature-badge">Smart</div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="section-header">
            <h2>Our Core Values</h2>
            <div className="section-divider"></div>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div
                key={index}
                className={`value-card ${isVisible ? "flip-in" : ""}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className={`about-section story-section ${isVisible ? "fade-in" : ""}`}>
          <div className="section-header">
            <h2>Our Story</h2>
            <div className="section-divider"></div>
          </div>
          <div className="story-content">
            <div className="story-timeline">
              <div className="timeline-item">
                <div className="timeline-year">2020</div>
                <div className="timeline-content">
                  <h4>The Beginning</h4>
                  <p>
                    Founded with a love for literature, our bookstore started as
                    a small local shop with a dream to make books accessible to
                    everyone.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2022</div>
                <div className="timeline-content">
                  <h4>Going Digital</h4>
                  <p>
                    We launched our online platform, expanding our reach and
                    connecting with book lovers worldwide.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2024</div>
                <div className="timeline-content">
                  <h4>Today</h4>
                  <p>
                    We've grown into a comprehensive online platform serving
                    thousands of customers with an extensive collection of books.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
