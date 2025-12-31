import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  bookAPI,
  cartAPI,
  wishlistAPI,
  ratingAPI,
  commentAPI,
} from "../services/api";

export default function BookDetails({
  books,
  cart,
  setCart,
  wishlist,
  setWishlist,
  user,
  refreshBooks,
}) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await bookAPI.getById(id);
        setBook(bookData);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <p className="error-message">Book not found.</p>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlist.some((b) => b.id === book.id);
  const isInCart = cart.some((b) => b.id === book.id);

  const addToCart = async () => {
    if (!user || !user.id) {
      alert("Please login to add items to cart");
      return;
    }

    if (isInCart) return;

    try {
      await cartAPI.add(user.id, book.id);
      const updatedCart = await cartAPI.get(user.id);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart");
    }
  };

  const toggleWishlist = async () => {
    if (!user || !user.id) {
      alert("Please login to add items to wishlist");
      return;
    }

    try {
      if (isInWishlist) {
        await wishlistAPI.remove(user.id, book.id);
      } else {
        await wishlistAPI.add(user.id, book.id);
      }
      const updatedWishlist = await wishlistAPI.get(user.id);
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert(error.message || "Failed to update wishlist");
    }
  };

  const handleRatingClick = async (rating) => {
    if (!user || !user.id) {
      alert("Please login to rate books");
      return;
    }

    setUserRating(rating);
    try {
      await ratingAPI.add(book.id, user.id, rating);
      // Refresh book data to get updated rating
      const updatedBook = await bookAPI.getById(id);
      setBook(updatedBook);
      if (refreshBooks) refreshBooks();
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating");
    }
  };

  const submitComment = async () => {
    if (!user || !user.id) {
      alert("Please login to add comments");
      return;
    }

    if (!comment.trim()) return;

    try {
      await commentAPI.add(book.id, user.id, comment, userRating || null);
      // Refresh book data to get updated comments
      const updatedBook = await bookAPI.getById(id);
      setBook(updatedBook);
      setComment("");
      setUserRating(0);
      alert("Comment added successfully!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment");
    }
  };

  const averageRating = book.averageRating || 0;
  const ratingCount = book.ratingCount || 0;
  const comments = book.comments || [];

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="book-details-page">
          <div className="book-details-main">
            <div className="book-image-section">
              <img
                src={book.image || "https://via.placeholder.com/400x600"}
                alt={book.title}
              />
            </div>

            <div className="book-info-section">
              <h1 className="book-title">{book.title}</h1>
              <p className="book-author">by {book.author}</p>

              <div className="book-rating-display">
                <div className="stars-display">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${
                        star <= Math.round(averageRating) ? "filled" : ""
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="rating-text">
                  {averageRating.toFixed(1)} ({ratingCount}{" "}
                  {ratingCount === 1 ? "rating" : "ratings"})
                </span>
              </div>

              <p className="book-price">${book.price?.toFixed(2) || "N/A"}</p>
              <p className="book-category">
                Category: <span>{book.category}</span>
              </p>

              <p className="book-description">
                {book.description || "No description available."}
              </p>

              <div className="book-actions">
                <button
                  className={`btn btn-primary ${
                    isInCart ? "btn-disabled" : ""
                  }`}
                  onClick={addToCart}
                  disabled={isInCart}
                >
                  {isInCart ? "✓ In Cart" : "Add to Cart"}
                </button>
                <button
                  className={`btn btn-secondary ${
                    isInWishlist ? "btn-active" : ""
                  }`}
                  onClick={toggleWishlist}
                >
                  {isInWishlist
                    ? "❤️ Remove from Wishlist"
                    : "🤍 Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>

          <div className="book-reviews-section">
            <h2>Customer Reviews & Ratings</h2>

            <div className="rating-input-section">
              <h3>Rate this book</h3>
              <div className="star-rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star-input ${
                      star <= (hoveredRating || userRating) ? "filled" : ""
                    }`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    ★
                  </span>
                ))}
              </div>
              {userRating > 0 && (
                <p className="rating-selected">
                  You rated {userRating} star{userRating > 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="comments-section">
              <h3>Add a Comment</h3>
              <textarea
                className="comment-input"
                placeholder="Share your thoughts about this book..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
              />
              <button className="btn btn-primary" onClick={submitComment}>
                Submit Comment
              </button>
            </div>

            <div className="comments-list">
              <h3>Comments ({comments.length})</h3>
              {comments.length === 0 ? (
                <p className="no-comments">
                  No comments yet. Be the first to review!
                </p>
              ) : (
                <div className="comments-container">
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        {comment.rating && (
                          <div className="comment-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`star-small ${
                                  star <= comment.rating ? "filled" : ""
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="comment-username">
                          {comment.username || "Anonymous"}
                        </span>
                        <span className="comment-date">
                          {new Date(comment.date).toLocaleString()}
                        </span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
