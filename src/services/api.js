const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// User APIs
export const userAPI = {
  register: async (username, email, password) => {
    return apiCall('/users/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  login: async (username, password) => {
    return apiCall('/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
};

// Book APIs
export const bookAPI = {
  getAll: async () => {
    return apiCall('/books');
  },

  getById: async (id) => {
    return apiCall(`/books/${id}`);
  },

  create: async (book, userId) => {
    return apiCall('/books', {
      method: 'POST',
      body: JSON.stringify({ ...book, userId }),
    });
  },

  delete: async (id, userId) => {
    return apiCall(`/books/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  },
};

// Rating APIs
export const ratingAPI = {
  add: async (bookId, userId, rating) => {
    return apiCall(`/books/${bookId}/rating`, {
      method: 'POST',
      body: JSON.stringify({ userId, rating }),
    });
  },
};

// Comment APIs
export const commentAPI = {
  add: async (bookId, userId, comment, rating = null) => {
    return apiCall(`/books/${bookId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ userId, comment, rating }),
    });
  },
};

// Cart APIs
export const cartAPI = {
  get: async (userId) => {
    return apiCall(`/cart/${userId}`);
  },

  add: async (userId, bookId, quantity = 1) => {
    return apiCall('/cart', {
      method: 'POST',
      body: JSON.stringify({ userId, bookId, quantity }),
    });
  },

  update: async (userId, bookId, quantity) => {
    return apiCall('/cart', {
      method: 'PUT',
      body: JSON.stringify({ userId, bookId, quantity }),
    });
  },

  remove: async (userId, bookId) => {
    return apiCall('/cart', {
      method: 'DELETE',
      body: JSON.stringify({ userId, bookId }),
    });
  },

  clear: async (userId) => {
    return apiCall(`/cart/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Wishlist APIs
export const wishlistAPI = {
  get: async (userId) => {
    return apiCall(`/wishlist/${userId}`);
  },

  add: async (userId, bookId) => {
    return apiCall('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ userId, bookId }),
    });
  },

  remove: async (userId, bookId) => {
    return apiCall('/wishlist', {
      method: 'DELETE',
      body: JSON.stringify({ userId, bookId }),
    });
  },
};


