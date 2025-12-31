const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Database Connection (XAMPP)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    // Try to create database if it doesn't exist
    const connectionWithoutDb = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    
    connectionWithoutDb.query('CREATE DATABASE IF NOT EXISTS bookstore_db', (err) => {
      if (err) {
        console.error('Error creating database:', err);
      } else {
        console.log('Database created successfully');
        connectionWithoutDb.end();
        // Reconnect with database
        db.changeUser({ database: 'bookstore_db' }, (err) => {
          if (err) {
            console.error('Error connecting to database:', err);
          } else {
            console.log('Connected to MySQL database');
            initializeDatabase();
          }
        });
      }
    });
  } else {
    console.log('Connected to MySQL database');
    initializeDatabase();
  }
});

// Initialize Database Tables
function initializeDatabase() {
  // First, check if email and password columns exist, if not add them
  db.query(`
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'bookstore_db' 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME IN ('email', 'password')
  `, (err, results) => {
    if (!err) {
      const columns = results.map(r => r.COLUMN_NAME);
      if (!columns.includes('email')) {
        db.query('ALTER TABLE users ADD COLUMN email VARCHAR(255) UNIQUE', (err) => {
          if (err && !err.message.includes('Duplicate column')) {
            console.error('Error adding email column:', err.message);
          } else {
            console.log('Email column added to users table');
          }
        });
      }
      if (!columns.includes('password')) {
        db.query('ALTER TABLE users ADD COLUMN password VARCHAR(255)', (err) => {
          if (err && !err.message.includes('Duplicate column')) {
            console.error('Error adding password column:', err.message);
          } else {
            console.log('Password column added to users table');
          }
        });
      }
      // Update existing password column to VARCHAR(255) if it's smaller (for bcrypt hashes)
      db.query(`
        ALTER TABLE users 
        MODIFY COLUMN password VARCHAR(255)
      `, (err) => {
        if (err && !err.message.includes('Duplicate column')) {
          // Silently ignore if column already has correct type
        }
      });
    }
  });

  const createTables = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      is_admin BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS books (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      category VARCHAR(100),
      image TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      book_id INT NOT NULL,
      user_id INT NOT NULL,
      rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_rating (book_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      book_id INT NOT NULL,
      user_id INT NOT NULL,
      comment TEXT NOT NULL,
      rating INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      book_id INT NOT NULL,
      quantity INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      UNIQUE KEY unique_cart_item (user_id, book_id)
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      book_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      UNIQUE KEY unique_wishlist_item (user_id, book_id)
    );
  `;

  db.query(createTables, (err) => {
    if (err) {
      console.error('Error creating tables:', err);
    } else {
      console.log('Database tables initialized');
      // Insert sample books if table is empty
      insertSampleBooks();
    }
  });
}

// Insert Sample Books
function insertSampleBooks() {
  db.query('SELECT COUNT(*) as count FROM books', (err, results) => {
    if (err) {
      console.error('Error checking books:', err);
      return;
    }
    
    if (results[0].count === 0) {
      const sampleBooks = [
        {
          title: "The Alchemist",
          author: "Paulo Coelho",
          price: 12.99,
          category: "Fiction",
          image: "https://covers.openlibrary.org/b/id/8231991-L.jpg",
          description: "A shepherd's journey to Egypt in search of treasure becomes a quest for meaning."
        },
        {
          title: "Atomic Habits",
          author: "James Clear",
          price: 16.5,
          category: "Self-Help",
          image: "https://covers.openlibrary.org/b/id/10511232-L.jpg",
          description: "Practical strategies to form good habits and break bad ones."
        },
        {
          title: "A Brief History of Time",
          author: "Stephen Hawking",
          price: 18.0,
          category: "Science",
          image: "https://covers.openlibrary.org/b/id/240727-L.jpg",
          description: "An overview of cosmology for general readers."
        },
        {
          title: "1984",
          author: "George Orwell",
          price: 11.25,
          category: "Fiction",
          image: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
          description: "A dystopian novel about surveillance and totalitarianism."
        },
        {
          title: "Sapiens",
          author: "Yuval Noah Harari",
          price: 19.99,
          category: "History",
          image: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
          description: "A brief history of humankind from the Stone Age to the 21st century."
        },
        {
          title: "The Pragmatic Programmer",
          author: "Andrew Hunt",
          price: 34.99,
          category: "Programming",
          image: "https://covers.openlibrary.org/b/id/8099259-L.jpg",
          description: "A guide to pragmatic software development."
        },
        {
          title: "Clean Code",
          author: "Robert C. Martin",
          price: 29.99,
          category: "Programming",
          image: "https://covers.openlibrary.org/b/id/6964151-L.jpg",
          description: "A handbook of agile software craftsmanship."
        },
        {
          title: "Thinking, Fast and Slow",
          author: "Daniel Kahneman",
          price: 14.5,
          category: "Psychology",
          image: "https://covers.openlibrary.org/b/id/8225630-L.jpg",
          description: "Two systems of the mind and how they shape our judgments."
        },
        {
          title: "The Power of Habit",
          author: "Charles Duhigg",
          price: 13.75,
          category: "Self-Help",
          image: "https://covers.openlibrary.org/b/id/8155436-L.jpg",
          description: "Why habits exist and how they can be changed."
        }
      ];

      const insertQuery = 'INSERT INTO books (title, author, price, category, image, description) VALUES ?';
      const values = sampleBooks.map(book => [
        book.title,
        book.author,
        book.price,
        book.category,
        book.image,
        book.description
      ]);

      db.query(insertQuery, [values], (err) => {
        if (err) {
          console.error('Error inserting sample books:', err);
        } else {
          console.log('Sample books inserted successfully');
        }
      });
    }
  });
}

// ============================================
// API ROUTES - USERS
// ============================================

// Register New User
app.post('/api/users/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  // Check if username already exists
  db.query(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, email],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length > 0) {
        const existingUser = results[0];
        if (existingUser.username === username) {
          return res.status(400).json({ error: 'Username already exists' });
        }
        if (existingUser.email === email) {
          return res.status(400).json({ error: 'Email already registered' });
        }
      }

      // Hash password before storing
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: 'Error hashing password' });
        }

        // Create new user with hashed password
        db.query(
          'INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, FALSE)',
          [username, email, hashedPassword],
          (err, result) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({
              id: result.insertId,
              username,
              email,
              isAdmin: false,
              message: 'Account created successfully'
            });
          }
        );
      });
    }
  );
});

// Login User
app.post('/api/users/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin123') {
    // Admin login
    db.query(
      'SELECT * FROM users WHERE username = ? AND is_admin = TRUE',
      [username],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
          // Create admin user if doesn't exist
          db.query(
            'INSERT INTO users (username, is_admin) VALUES (?, TRUE)',
            [username],
            (err, result) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              res.json({
                id: result.insertId,
                username,
                isAdmin: true
              });
            }
          );
        } else {
          res.json({
            id: results[0].id,
            username: results[0].username,
            email: results[0].email,
            isAdmin: results[0].is_admin
          });
        }
      }
    );
  } else {
    // Regular user login - check password
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    db.query(
      'SELECT * FROM users WHERE username = ? AND is_admin = FALSE',
      [username],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = results[0];
        
        // Check if user has a password (old users might not have one)
        if (!user.password) {
          return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare password with hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return res.status(500).json({ error: 'Error verifying password' });
          }

          if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
          }

          res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: false
          });
        });
      }
    );
  }
});

// ============================================
// API ROUTES - BOOKS
// ============================================

// Get all books
app.get('/api/books', (req, res) => {
  const query = `
    SELECT 
      b.*,
      COALESCE(AVG(r.rating), 0) as averageRating,
      COUNT(DISTINCT r.id) as ratingCount
    FROM books b
    LEFT JOIN ratings r ON b.id = r.book_id
    GROUP BY b.id
    ORDER BY b.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const books = results.map(book => ({
      ...book,
      averageRating: parseFloat(book.averageRating) || 0,
      price: parseFloat(book.price)
    }));
    
    res.json(books);
  });
});

// Get single book with ratings and comments
app.get('/api/books/:id', (req, res) => {
  const bookId = req.params.id;

  const bookQuery = `
    SELECT 
      b.*,
      COALESCE(AVG(r.rating), 0) as averageRating,
      COUNT(DISTINCT r.id) as ratingCount
    FROM books b
    LEFT JOIN ratings r ON b.id = r.book_id
    WHERE b.id = ?
    GROUP BY b.id
  `;

  db.query(bookQuery, [bookId], (err, bookResults) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (bookResults.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const book = {
      ...bookResults[0],
      averageRating: parseFloat(bookResults[0].averageRating) || 0,
      price: parseFloat(bookResults[0].price)
    };

    // Get comments
    const commentsQuery = `
      SELECT 
        c.*,
        u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.book_id = ?
      ORDER BY c.created_at DESC
    `;

    db.query(commentsQuery, [bookId], (err, comments) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        ...book,
        comments: comments.map(comment => ({
          id: comment.id,
          text: comment.comment,
          rating: comment.rating,
          username: comment.username,
          date: comment.created_at
        }))
      });
    });
  });
});

// Add new book (Admin only)
app.post('/api/books', (req, res) => {
  const { title, author, price, category, image, description, userId } = req.body;

  // Check if user is admin
  db.query('SELECT is_admin FROM users WHERE id = ?', [userId], (err, results) => {
    if (err || results.length === 0 || !results[0].is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    if (!title || !author || !price) {
      return res.status(400).json({ error: 'Title, author, and price are required' });
    }

    db.query(
      'INSERT INTO books (title, author, price, category, image, description) VALUES (?, ?, ?, ?, ?, ?)',
      [title, author, price, category || 'Uncategorized', image || '', description || ''],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({
          id: result.insertId,
          title,
          author,
          price: parseFloat(price),
          category,
          image,
          description,
          averageRating: 0
        });
      }
    );
  });
});

// Delete book (Admin only)
app.delete('/api/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { userId } = req.body;

  // Check if user is admin
  db.query('SELECT is_admin FROM users WHERE id = ?', [userId], (err, results) => {
    if (err || results.length === 0 || !results[0].is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    db.query('DELETE FROM books WHERE id = ?', [bookId], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Book deleted successfully' });
    });
  });
});

// ============================================
// API ROUTES - RATINGS
// ============================================

// Add/Update rating
app.post('/api/books/:id/rating', (req, res) => {
  const bookId = req.params.id;
  const { userId, rating } = req.body;

  if (!userId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Valid user ID and rating (1-5) required' });
  }

  db.query(
    'INSERT INTO ratings (book_id, user_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?',
    [bookId, userId, rating, rating],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Get updated average rating
      db.query(
        'SELECT AVG(rating) as avgRating, COUNT(*) as count FROM ratings WHERE book_id = ?',
        [bookId],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({
            averageRating: parseFloat(results[0].avgRating) || 0,
            ratingCount: results[0].count
          });
        }
      );
    }
  );
});

// ============================================
// API ROUTES - COMMENTS
// ============================================

// Add comment
app.post('/api/books/:id/comment', (req, res) => {
  const bookId = req.params.id;
  const { userId, comment, rating } = req.body;

  if (!userId || !comment) {
    return res.status(400).json({ error: 'User ID and comment are required' });
  }

  db.query(
    'INSERT INTO comments (book_id, user_id, comment, rating) VALUES (?, ?, ?, ?)',
    [bookId, userId, comment, rating || null],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.query(
        'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?',
        [result.insertId],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          const commentData = results[0];
          res.json({
            id: commentData.id,
            text: commentData.comment,
            rating: commentData.rating,
            username: commentData.username,
            date: commentData.created_at
          });
        }
      );
    }
  );
});

// ============================================
// API ROUTES - CART
// ============================================

// Get user cart
app.get('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT 
      b.*,
      c.quantity
    FROM cart c
    JOIN books b ON c.book_id = b.id
    WHERE c.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const cart = results.flatMap(item => 
      Array(item.quantity).fill({
        id: item.id,
        title: item.title,
        author: item.author,
        price: parseFloat(item.price),
        category: item.category,
        image: item.image,
        description: item.description
      })
    );

    res.json(cart);
  });
});

// Add to cart
app.post('/api/cart', (req, res) => {
  const { userId, bookId, quantity = 1 } = req.body;

  if (!userId || !bookId) {
    return res.status(400).json({ error: 'User ID and book ID are required' });
  }

  db.query(
    'INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
    [userId, bookId, quantity, quantity],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Item added to cart' });
    }
  );
});

// Update cart item quantity
app.put('/api/cart', (req, res) => {
  const { userId, bookId, quantity } = req.body;

  if (quantity <= 0) {
    db.query('DELETE FROM cart WHERE user_id = ? AND book_id = ?', [userId, bookId], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Item removed from cart' });
    });
  } else {
    db.query(
      'UPDATE cart SET quantity = ? WHERE user_id = ? AND book_id = ?',
      [quantity, userId, bookId],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Cart updated' });
      }
    );
  }
});

// Remove from cart
app.delete('/api/cart', (req, res) => {
  const { userId, bookId } = req.body;

  db.query('DELETE FROM cart WHERE user_id = ? AND book_id = ?', [userId, bookId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Item removed from cart' });
  });
});

// Clear cart
app.delete('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;

  db.query('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Cart cleared' });
  });
});

// ============================================
// API ROUTES - WISHLIST
// ============================================

// Get user wishlist
app.get('/api/wishlist/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT b.*
    FROM wishlist w
    JOIN books b ON w.book_id = b.id
    WHERE w.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results.map(book => ({
      ...book,
      price: parseFloat(book.price)
    })));
  });
});

// Add to wishlist
app.post('/api/wishlist', (req, res) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return res.status(400).json({ error: 'User ID and book ID are required' });
  }

  db.query(
    'INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)',
    [userId, bookId],
    (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Book already in wishlist' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Added to wishlist' });
    }
  );
});

// Remove from wishlist
app.delete('/api/wishlist', (req, res) => {
  const { userId, bookId } = req.body;

  db.query('DELETE FROM wishlist WHERE user_id = ? AND book_id = ?', [userId, bookId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Removed from wishlist' });
  });
});

// ============================================
// SERVER START
// ============================================

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

