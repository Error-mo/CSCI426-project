import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import BookDetails from "./pages/BookDetails";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import { bookAPI, cartAPI, wishlistAPI } from "./services/api";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("isAdmin") === "true";
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const fetchedBooks = await bookAPI.getAll();
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
        alert("Failed to load books. Please make sure the server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Fetch cart and wishlist when user logs in
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.id) {
        try {
          const [cartData, wishlistData] = await Promise.all([
            cartAPI.get(user.id),
            wishlistAPI.get(user.id),
          ]);
          setCart(cartData);
          setWishlist(wishlistData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setCart([]);
        setWishlist([]);
      }
    };
    fetchUserData();
  }, [user]);

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");
    }
  }, [user]);

  useEffect(() => {
    document.title = "Online Bookstore";
  }, []);

  // Refresh books list (for admin operations)
  const refreshBooks = async () => {
    try {
      const fetchedBooks = await bookAPI.getAll();
      setBooks(fetchedBooks);
    } catch (error) {
      console.error("Error refreshing books:", error);
    }
  };

  return (
    <Router>
      <div className="app">
        <Header
          cart={cart}
          wishlist={wishlist}
          user={user}
          setUser={setUser}
          isAdmin={isAdmin}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  books={books}
                  cart={cart}
                  setCart={setCart}
                  wishlist={wishlist}
                  setWishlist={setWishlist}
                  user={user}
                  loading={loading}
                />
              }
            />
            <Route
              path="/book/:id"
              element={
                <BookDetails
                  books={books}
                  cart={cart}
                  setCart={setCart}
                  wishlist={wishlist}
                  setWishlist={setWishlist}
                  user={user}
                  refreshBooks={refreshBooks}
                />
              }
            />
            <Route
              path="/admin"
              element={
                <Admin
                  books={books}
                  refreshBooks={refreshBooks}
                  isAdmin={isAdmin}
                  user={user}
                />
              }
            />
            <Route
              path="/login"
              element={
                <Login
                  user={user}
                  setUser={setUser}
                  isAdmin={isAdmin}
                  setIsAdmin={setIsAdmin}
                />
              }
            />
            <Route
              path="/cart"
              element={<Cart cart={cart} setCart={setCart} user={user} />}
            />
            <Route
              path="/checkout"
              element={<Checkout cart={cart} setCart={setCart} user={user} />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/wishlist"
              element={
                <Wishlist
                  wishlist={wishlist}
                  setWishlist={setWishlist}
                  cart={cart}
                  setCart={setCart}
                  user={user}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
