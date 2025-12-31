import React from "react";
import { Link } from "react-router-dom";
import { cartAPI, wishlistAPI } from "../services/api";

export default function Wishlist({
  wishlist,
  setWishlist,
  cart,
  setCart,
  user,
}) {
  const removeFromWishlist = async (id) => {
    if (!user || !user.id) return;

    try {
      await wishlistAPI.remove(user.id, id);
      const updatedWishlist = await wishlistAPI.get(user.id);
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Failed to remove from wishlist");
    }
  };

  const addToCart = async (book) => {
    if (!user || !user.id) {
      alert("Please login to add items to cart");
      return;
    }

    const isInCart = cart.some((b) => b.id === book.id);
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

  if (wishlist.length === 0) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <div className="empty-wishlist">
            <h2>Your Wishlist is Empty</h2>
            <p>Start adding books to your wishlist to save them for later!</p>
            <Link to="/" className="btn btn-primary">
              Browse Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="wishlist-page">
          <h1 className="page-title">My Wishlist ({wishlist.length})</h1>

          <div className="wishlist-grid">
            {wishlist.map((book) => {
              const isInCart = cart.some((b) => b.id === book.id);
              const avgRating = book.averageRating || 0;

              return (
                <article key={book.id} className="wishlist-card">
                  <Link to={`/book/${book.id}`} className="wishlist-image-link">
                    <img
                      src={book.image || "https://via.placeholder.com/200x300"}
                      alt={book.title}
                    />
                  </Link>
                  <div className="wishlist-card-body">
                    <Link to={`/book/${book.id}`}>
                      <h3 className="wishlist-card-title">{book.title}</h3>
                    </Link>
                    <p className="wishlist-card-author">{book.author}</p>

                    <div className="wishlist-card-rating">
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

                    <p className="wishlist-card-price">
                      ${book.price?.toFixed(2) || "N/A"}
                    </p>
                    <p className="wishlist-card-category">{book.category}</p>

                    <div className="wishlist-card-actions">
                      <button
                        className={`btn btn-small ${
                          isInCart ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => addToCart(book)}
                        disabled={isInCart}
                      >
                        {isInCart ? "✓ In Cart" : "Add to Cart"}
                      </button>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => removeFromWishlist(book.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
