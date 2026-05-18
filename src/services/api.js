const BASE_URL = 'https://api.escuelajs.co/api/v1';

export const api = {
  // Products
  async getProducts(limit = 10, offset = 0) {
    const res = await fetch(`${BASE_URL}/products?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error('Error fetching products');
    return res.json();
  },

  async getProductById(id) {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async getProductsByCategory(categoryId, limit = 10, offset = 0) {
    const res = await fetch(`${BASE_URL}/categories/${categoryId}/products?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error('Error fetching products');
    return res.json();
  },

  async searchProducts(title) {
    const res = await fetch(`${BASE_URL}/products/?title=${encodeURIComponent(title)}`);
    if (!res.ok) throw new Error('Error searching products');
    return res.json();
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error('Error fetching categories');
    return res.json();
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Credenciales incorrectas');
    }
    return res.json();
  },

  async register(name, email, password, avatar) {
    const res = await fetch(`${BASE_URL}/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, avatar: avatar || 'https://picsum.photos/200' }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al registrarse');
    }
    return res.json();
  },

  async getProfile(token) {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Session expired');
    return res.json();
  },
};
