import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin({ books, setBooks, isAdmin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    category: '',
    image: '',
    description: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  // Redirect if not admin
  React.useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    if (!adminStatus) {
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 400;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setFormData({ ...formData, image: imageData });
        setImagePreview(imageData);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.price) {
      alert('Please fill in all required fields (Title, Author, Price)');
      return;
    }

    const newId = books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;
    const newBook = {
      id: newId,
      title: formData.title,
      author: formData.author,
      price: parseFloat(formData.price),
      category: formData.category || 'Uncategorized',
      image: formData.image || 'https://via.placeholder.com/400x600',
      description: formData.description || '',
      ratings: [],
      comments: [],
      averageRating: 0
    };

    setBooks([...books, newBook]);
    setFormData({
      title: '',
      author: '',
      price: '',
      category: '',
      image: '',
      description: ''
    });
    setImagePreview('');
    alert('Book added successfully!');
  };

  const removeBook = (id) => {
    if (window.confirm('Are you sure you want to remove this book?')) {
      setBooks(books.filter(b => b.id !== id));
    }
  };

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Self-Help', 'Programming', 'Psychology', 'Biography', 'Mystery', 'Romance'];

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="admin-panel">
          <div className="admin-header">
            <h1>Admin Panel</h1>
            <p>Manage your bookstore inventory</p>
          </div>

          <div className="admin-content">
            <section className="admin-form-section">
              <h2>Add New Book</h2>
              <form className="admin-form" onSubmit={handleAddBook}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="author">Author *</label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price ($) *</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="image">Book Image</label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Enter book description..."
                  />
                </div>

                <button type="submit" className="btn btn-primary">Add Book</button>
              </form>
            </section>

            <section className="admin-books-section">
              <h2>All Books ({books.length})</h2>
              <div className="admin-books-grid">
                {books.map(book => (
                  <div key={book.id} className="admin-book-card">
                    <img src={book.image || 'https://via.placeholder.com/200x300'} alt={book.title} />
                    <div className="admin-book-info">
                      <h3>{book.title}</h3>
                      <p className="admin-book-author">{book.author}</p>
                      <p className="admin-book-price">${book.price?.toFixed(2)}</p>
                      <p className="admin-book-category">{book.category}</p>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => removeBook(book.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
