import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartAPI } from "../services/api";

export default function Checkout({ cart, setCart, user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData({
      ...cardData,
      [name]: value,
    });
  };

  const total = cart.reduce((sum, book) => sum + (book.price || 0), 0);
  const tax = total * 0.1; // 10% tax
  const finalTotal = total + tax;

  const handleCheckout = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.address) {
      alert("Please fill in all required fields");
      return;
    }

    if (
      paymentMethod === "credit" &&
      (!cardData.cardNumber ||
        !cardData.cardName ||
        !cardData.expiryDate ||
        !cardData.cvv)
    ) {
      alert("Please fill in all payment details");
      return;
    }

    // Clear cart if user is logged in
    if (user && user.id) {
      try {
        await cartAPI.clear(user.id);
        setCart([]);
      } catch (error) {
        console.error("Error clearing cart:", error);
        // Still show success message even if cart clear fails
      }
    } else {
      setCart([]);
    }

    alert(
      `Thank you ${formData.fullName}! Your order for ${
        cart.length
      } book(s) totaling $${finalTotal.toFixed(
        2
      )} has been placed successfully.`
    );
    navigate("/");
  };

  if (cart.length === 0) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <div className="empty-cart-message">
            <h2>Your cart is empty</h2>
            <p>Add some books to your cart before checkout.</p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="checkout-page">
          <h1 className="page-title">Checkout</h1>

          <div className="checkout-container">
            <div className="checkout-form-section">
              <form className="checkout-form" onSubmit={handleCheckout}>
                <section className="form-section">
                  <h2>Billing Information</h2>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Street Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="state">State/Province</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="zipCode">ZIP/Postal Code</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="country">Country</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </section>

                <section className="form-section">
                  <h2>Payment Method</h2>
                  <div className="payment-methods">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit"
                        checked={paymentMethod === "credit"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>💳 Credit Card</span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="debit"
                        checked={paymentMethod === "debit"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>💳 Debit Card</span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>🅿️ PayPal</span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={paymentMethod === "bank"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>🏦 Bank Transfer</span>
                    </label>
                  </div>

                  {(paymentMethod === "credit" ||
                    paymentMethod === "debit") && (
                    <div className="card-details">
                      <div className="form-group">
                        <label htmlFor="cardNumber">Card Number *</label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={cardData.cardNumber}
                          onChange={handleCardChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          required={
                            paymentMethod === "credit" ||
                            paymentMethod === "debit"
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cardName">Cardholder Name *</label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={cardData.cardName}
                          onChange={handleCardChange}
                          required={
                            paymentMethod === "credit" ||
                            paymentMethod === "debit"
                          }
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="expiryDate">Expiry Date *</label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={cardData.expiryDate}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                            maxLength="5"
                            required={
                              paymentMethod === "credit" ||
                              paymentMethod === "debit"
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="cvv">CVV *</label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={cardData.cvv}
                            onChange={handleCardChange}
                            placeholder="123"
                            maxLength="4"
                            required={
                              paymentMethod === "credit" ||
                              paymentMethod === "debit"
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(paymentMethod === "paypal" || paymentMethod === "bank") && (
                    <div className="payment-info">
                      <p>
                        You will be redirected to complete your payment after
                        placing the order.
                      </p>
                    </div>
                  )}
                </section>

                <button type="submit" className="btn btn-primary btn-large">
                  Place Order
                </button>
              </form>
            </div>

            <div className="checkout-summary">
              <h2>Order Summary</h2>
              <div className="order-items">
                {cart.map((book) => (
                  <div key={book.id} className="order-item">
                    <div className="order-item-info">
                      <h4>{book.title}</h4>
                      <p className="order-item-author">{book.author}</p>
                    </div>
                    <p className="order-item-price">
                      ${book.price?.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Tax (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="total-row total-final">
                  <span>Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
