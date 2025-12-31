import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cartAPI, wishlistAPI } from "../services/api";

export default function Home({
  books,
  cart,
  setCart,
  wishlist,
  setWishlist,
  user,
  loading,
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState(0);

  if (loading)
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <p>Loading...</p>
        </div>
      </div>
    );
  if (!books || books.length === 0)
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <p>No books available.</p>
        </div>
      </div>
    );

  const categories = ["All", ...new Set(books.map((b) => b.category))];

  const filtered = books
    .filter((b) => {
      if (category !== "All" && b.category !== category) return false;
      if (
        query &&
        !b.title.toLowerCase().includes(query.toLowerCase()) &&
        !b.author.toLowerCase().includes(query.toLowerCase())
      )
        return false;

      // Price filter
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        if (max && (b.price < min || b.price > max)) return false;
        if (!max && b.price < min) return false;
      }

      // Rating filter
      const avgRating = b.averageRating || 0;
      if (minRating > 0 && avgRating < minRating) return false;

      return true;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "rating")
        return (b.averageRating || 0) - (a.averageRating || 0);
      return 0;
    });

  const handleAddToCart = async (book) => {
    if (!user || !user.id) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      await cartAPI.add(user.id, book.id);
      // Refresh cart
      const updatedCart = await cartAPI.get(user.id);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart");
    }
  };

  const toggleWishlist = async (book) => {
    if (!user || !user.id) {
      alert("Please login to add items to wishlist");
      return;
    }

    try {
      const isInWishlist = wishlist.some((b) => b.id === book.id);
      if (isInWishlist) {
        await wishlistAPI.remove(user.id, book.id);
      } else {
        await wishlistAPI.add(user.id, book.id);
      }
      // Refresh wishlist
      const updatedWishlist = await wishlistAPI.get(user.id);
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert(error.message || "Failed to update wishlist");
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <section className="search-filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="0-10">$0 - $10</option>
                <option value="10-20">$10 - $20</option>
                <option value="20-30">$20 - $30</option>
                <option value="30-">$30+</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
              >
                <option value="0">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Star</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="default">Default</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="title">Title A → Z</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </section>

        <section className="books-section">
          <h2 className="section-title">
            {filtered.length === 0
              ? "No books found"
              : `Found ${filtered.length} book${
                  filtered.length !== 1 ? "s" : ""
                }`}
          </h2>

          <div className="books-grid">
            {filtered.map((book) => {
              const isInWishlist = wishlist.some((b) => b.id === book.id);
              const isInCart = cart.some((b) => b.id === book.id);
              const avgRating = book.averageRating || 0;

              return (
                <article key={book.id} className="book-card">
                  <Link to={`/book/${book.id}`} className="book-image-link">
                    <img
                      src={book.image || "https://via.placeholder.com/200x300"}
                      alt={book.title}
                    />
                  </Link>
                  <div className="book-card-body">
                    <Link to={`/book/${book.id}`}>
                      <h3 className="book-card-title">{book.title}</h3>
                    </Link>
                    <p className="book-card-author">{book.author}</p>

                    <div className="book-card-rating">
                      <div className="stars-display-small">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`star-small ${
                              star <= Math.round(avgRating) ? "filled" : ""
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      {avgRating > 0 && (
                        <span className="rating-number">
                          ({avgRating.toFixed(1)})
                        </span>
                      )}
                    </div>

                    <p className="book-card-price">
                      ${book.price?.toFixed(2) || "N/A"}
                    </p>
                    <p className="book-card-category">{book.category}</p>

                    <div className="book-card-actions">
                      <button
                        className={`btn btn-small ${
                          isInCart ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => handleAddToCart(book)}
                        disabled={isInCart || !user}
                      >
                        {isInCart ? "✓ In Cart" : "Add to Cart"}
                      </button>
                      <button
                        className={`btn btn-small btn-icon ${
                          isInWishlist ? "btn-active" : ""
                        }`}
                        onClick={() => toggleWishlist(book)}
                        title={
                          isInWishlist
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        {isInWishlist ? "❤️" : "🤍"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
