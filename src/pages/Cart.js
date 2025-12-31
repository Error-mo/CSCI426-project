import React from "react";
import { Link } from "react-router-dom";
import { cartAPI } from "../services/api";

export default function CartPage({ cart, setCart, user }) {
  const removeItem = async (bookId) => {
    if (!user || !user.id) return;

    try {
      await cartAPI.remove(user.id, bookId);
      const updatedCart = await cartAPI.get(user.id);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item");
    }
  };

  const updateQuantity = async (bookId, change) => {
    if (!user || !user.id) return;

    const currentQuantity = getQuantity(bookId);
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      removeItem(bookId);
      return;
    }

    try {
      await cartAPI.update(user.id, bookId, newQuantity);
      const updatedCart = await cartAPI.get(user.id);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    }
  };

  const getQuantity = (id) => {
    return cart.filter((book) => book.id === id).length;
  };

  const getUniqueBooks = () => {
    const seen = new Set();
    return cart.filter((book) => {
      if (seen.has(book.id)) {
        return false;
      }
      seen.add(book.id);
      return true;
    });
  };

  const total = cart.reduce((sum, book) => sum + (book.price || 0), 0);
  const tax = total * 0.1;
  const finalTotal = total + tax;

  if (cart.length === 0) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <div className="empty-cart">
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any books to your cart yet.</p>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="cart-page">
          <h1 className="page-title">Shopping Cart</h1>

          <div className="cart-container">
            <div className="cart-items-section">
              {getUniqueBooks().map((book) => {
                const quantity = getQuantity(book.id);
                const itemTotal = book.price * quantity;

                return (
                  <div key={book.id} className="cart-item">
                    <div className="cart-item-image">
                      <img
                        src={
                          book.image || "https://via.placeholder.com/150x200"
                        }
                        alt={book.title}
                      />
                    </div>
                    <div className="cart-item-details">
                      <Link to={`/book/${book.id}`}>
                        <h3>{book.title}</h3>
                      </Link>
                      <p className="cart-item-author">{book.author}</p>
                      <p className="cart-item-price">
                        ${book.price?.toFixed(2)} each
                      </p>
                    </div>
                    <div className="cart-item-quantity">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(book.id, -1)}
                      >
                        −
                      </button>
                      <span className="quantity-value">{quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(book.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-total">
                      <p className="item-total-price">
                        ${itemTotal.toFixed(2)}
                      </p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(book.id)}
                      title="Remove all"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Items ({cart.length}):</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="summary-row summary-total">
                  <span>Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              <Link to="/checkout" className="btn btn-primary btn-block">
                Proceed to Checkout
              </Link>
              <Link to="/" className="btn btn-secondary btn-block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
