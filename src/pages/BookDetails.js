import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function BookDetails({ books, cart, setCart, wishlist, setWishlist }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find(b => b.id === Number(id));
  
  const [comment, setComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!book) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <p className="error-message">Book not found.</p>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlist.some(b => b.id === book.id);
  const isInCart = cart.some(b => b.id === book.id);

  const addToCart = () => {
    if (!isInCart) {
      setCart([...cart, book]);
    }
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      setWishlist(wishlist.filter(b => b.id !== book.id));
    } else {
      setWishlist([...wishlist, book]);
    }
  };

  const handleRatingClick = (rating) => {
    setUserRating(rating);
    const currentRatings = book.ratings || [];
    const newRatings = [...currentRatings, rating];
    book.ratings = newRatings;
    book.averageRating = newRatings.reduce((sum, r) => sum + r, 0) / newRatings.length;
    localStorage.setItem('books', JSON.stringify(books));
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    
    const comments = book.comments || [];
    const newComment = {
      id: Date.now(),
      text: comment,
      date: new Date().toLocaleString(),
      rating: userRating || null
    };
    
    comments.push(newComment);
    book.comments = comments;
    localStorage.setItem('books', JSON.stringify(books));
    setComment('');
    setUserRating(0);
    alert('Comment added successfully!');
  };

  const averageRating = book.averageRating || 0;
  const ratingCount = book.ratings?.length || 0;
  const comments = book.comments || [];

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="book-details-page">
          <div className="book-details-main">
            <div className="book-image-section">
              <img src={book.image || 'https://via.placeholder.com/400x600'} alt={book.title} />
            </div>
            
            <div className="book-info-section">
              <h1 className="book-title">{book.title}</h1>
              <p className="book-author">by {book.author}</p>
              
              <div className="book-rating-display">
                <div className="stars-display">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={`star ${star <= Math.round(averageRating) ? 'filled' : ''}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="rating-text">
                  {averageRating.toFixed(1)} ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
                </span>
              </div>
              
              <p className="book-price">${book.price?.toFixed(2) || 'N/A'}</p>
              <p className="book-category">Category: <span>{book.category}</span></p>
              
              <p className="book-description">{book.description || 'No description available.'}</p>
              
              <div className="book-actions">
                <button 
                  className={`btn btn-primary ${isInCart ? 'btn-disabled' : ''}`}
                  onClick={addToCart}
                  disabled={isInCart}
                >
                  {isInCart ? '✓ In Cart' : 'Add to Cart'}
                </button>
                <button 
                  className={`btn btn-secondary ${isInWishlist ? 'btn-active' : ''}`}
                  onClick={toggleWishlist}
                >
                  {isInWishlist ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>

          <div className="book-reviews-section">
            <h2>Customer Reviews & Ratings</h2>
            
            <div className="rating-input-section">
              <h3>Rate this book</h3>
              <div className="star-rating-input">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`star-input ${star <= (hoveredRating || userRating) ? 'filled' : ''}`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    ★
                  </span>
                ))}
              </div>
              {userRating > 0 && <p className="rating-selected">You rated {userRating} star{userRating > 1 ? 's' : ''}</p>}
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
                <p className="no-comments">No comments yet. Be the first to review!</p>
              ) : (
                <div className="comments-container">
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        {comment.rating && (
                          <div className="comment-rating">
                            {[1, 2, 3, 4, 5].map(star => (
                              <span key={star} className={`star-small ${star <= comment.rating ? 'filled' : ''}`}>
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="comment-date">{comment.date}</span>
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
