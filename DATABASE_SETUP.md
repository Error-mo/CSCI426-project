# Database Setup Guide - XAMPP + Node.js

## Prerequisites
1. Install XAMPP from https://www.apachefriends.org/
2. Install Node.js from https://nodejs.org/

## Setup Steps

### 1. Start XAMPP Services
- Open XAMPP Control Panel
- Start **Apache** and **MySQL** services
- Make sure both are running (green indicators)

### 2. Configure MySQL (if needed)
- Default MySQL settings in XAMPP:
  - Host: `localhost`
  - User: `root`
  - Password: `` (empty by default)
  - Port: `3306`

If you changed the password, update it in `server.js`:
```javascript
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'YOUR_PASSWORD', // Update here
  database: 'bookstore_db'
});
```

### 3. Install Backend Dependencies
Open terminal in the project root and run:
```bash
npm install express mysql2 cors nodemon
```

Or if you want to install separately:
```bash
npm install express
npm install mysql2
npm install cors
npm install nodemon --save-dev
```

### 4. Start the Backend Server
```bash
node server.js
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will:
- Automatically create the database `bookstore_db` if it doesn't exist
- Create all necessary tables
- Insert sample books

### 5. Update React App to Use Backend

The React app needs to be updated to call the API endpoints instead of using localStorage.

### Database Schema

**Users Table:**
- id, username, is_admin, created_at

**Books Table:**
- id, title, author, price, category, image, description, created_at

**Ratings Table:**
- id, book_id, user_id, rating (1-5), created_at

**Comments Table:**
- id, book_id, user_id, comment, rating, created_at

**Cart Table:**
- id, user_id, book_id, quantity, created_at

**Wishlist Table:**
- id, user_id, book_id, created_at

## API Endpoints

### Users
- `POST /api/users/login` - Login/Create user
  - Body: `{ username, password }` (password only for admin)

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book with comments
- `POST /api/books` - Add book (Admin only)
  - Body: `{ title, author, price, category, image, description, userId }`
- `DELETE /api/books/:id` - Delete book (Admin only)
  - Body: `{ userId }`

### Ratings
- `POST /api/books/:id/rating` - Add/Update rating
  - Body: `{ userId, rating }`

### Comments
- `POST /api/books/:id/comment` - Add comment
  - Body: `{ userId, comment, rating }`

### Cart
- `GET /api/cart/:userId` - Get user cart
- `POST /api/cart` - Add to cart
  - Body: `{ userId, bookId, quantity }`
- `PUT /api/cart` - Update quantity
  - Body: `{ userId, bookId, quantity }`
- `DELETE /api/cart` - Remove item
  - Body: `{ userId, bookId }`
- `DELETE /api/cart/:userId` - Clear cart

### Wishlist
- `GET /api/wishlist/:userId` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
  - Body: `{ userId, bookId }`
- `DELETE /api/wishlist` - Remove from wishlist
  - Body: `{ userId, bookId }`

## Troubleshooting

**Connection Error:**
- Make sure MySQL is running in XAMPP
- Check if the password is correct in server.js
- Try accessing phpMyAdmin at http://localhost/phpmyadmin

**Database Already Exists:**
- The server will automatically use the existing database
- Tables will be created if they don't exist

**Port Already in Use:**
- Change PORT in server.js to a different number (e.g., 5001, 3001)



