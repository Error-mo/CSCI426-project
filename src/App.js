import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
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

  const [books, setBooks] = useState(() => {
    const stored = localStorage.getItem("books");
    if (stored) return JSON.parse(stored);

    const sample = [
      {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 12.99,
        category: "Fiction",
        image: "https://covers.openlibrary.org/b/id/8231991-L.jpg",
        description:
          "A shepherd's journey to Egypt in search of treasure becomes a quest for meaning.",
        ratings: [],
        comments: [],
        averageRating: 0,
      },
      {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        price: 16.5,
        category: "Self-Help",
        image: "https://covers.openlibrary.org/b/id/10511232-L.jpg",
        description:
          "Practical strategies to form good habits and break bad ones.",
        ratings: [],
        comments: [],
        averageRating: 0,
      },
      {
        id: 3,
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        price: 18.0,
        category: "Science",
        image: "https://covers.openlibrary.org/b/id/240727-L.jpg",
        description: "An overview of cosmology for general readers.",
        ratings: [],
        comments: [],
        averageRating: 0,
      },
      {
        id: 4,
        title: "1984",
        author: "George Orwell",
        price: 11.25,
        category: "Fiction",
        image: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
        description:
          "A dystopian novel about surveillance and totalitarianism.",
        ratings: [],
        comments: [],
        averageRating: 0,
      },
      {
        id: 5,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        price: 19.99,
        category: "History",
        image: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
        description:
          "A brief history of humankind from the Stone Age to the 21st century.",
        ratings: [],
        comments: [],
        averageRating: 0,
      },
      {
        id: 6,
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        price: 34.99,
        category: "Programming",
        image: "https://covers.openlibrary.org/b/id/8099259-L.jpg",
        description: "A guide to pragmatic software development.",
        ratings: [],
        comments: [],
        averageRating: 0,
      },
      {
        id: 7,
        title: "Clean Code",
        author: "Robert C. Martin",
        price: 29.99,
        category: "Programming",
        image: "https://covers.openlibrary.org/b/id/6964151-L.jpg",
        description: "A handbook of agile software craftsmanship.",
        ratings: [],
        comments: [],
        averageRating: 0,
      },
      {
        id: 8,
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        price: 14.5,
        category: "Psychology",
        image: "https://covers.openlibrary.org/b/id/8225630-L.jpg",
        description:
          "Two systems of the mind and how they shape our judgments.",
        ratings: [],
        comments: [],
        averageRating: 0,
      },
      {
        id: 9,
        title: "The Power of Habit",
        author: "Charles Duhigg",
        price: 13.75,
        category: "Self-Help",
        image: "https://covers.openlibrary.org/b/id/8155436-L.jpg",
        description: "Why habits exist and how they can be changed.",
        ratings: [],
        comments: [],
        averageRating: 0,
      },
    ];

    localStorage.setItem("books", JSON.stringify(sample));
    return sample;
  });

  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    document.title = "Online Bookstore";
  }, []);

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
                />
              }
            />
            <Route
              path="/admin"
              element={
                <Admin books={books} setBooks={setBooks} isAdmin={isAdmin} />
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
              element={<Cart cart={cart} setCart={setCart} />}
            />
            <Route
              path="/checkout"
              element={<Checkout cart={cart} setCart={setCart} />}
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
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
