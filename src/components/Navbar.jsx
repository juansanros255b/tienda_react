import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar({ onSearch }) {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand} onClick={() => navigate('/')}>
        <span className={styles.logo}>◈</span>
        <span className={styles.brandName}>NEXUS<em>SHOP</em></span>
      </div>

      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar productos..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className={styles.searchBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </form>

      <div className={styles.actions}>
        {user ? (
          <div className={styles.userMenu} onClick={() => setMenuOpen(!menuOpen)}>
            <img src={user.avatar} alt={user.name} className={styles.avatar} onError={e => e.target.src='https://picsum.photos/40'} />
            <span className={styles.userName}>{user.name.split(' ')[0]}</span>
            {menuOpen && (
              <div className={styles.dropdown}>
                <span className={styles.dropdownEmail}>{user.email}</span>
                <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className={styles.loginBtn} onClick={() => navigate('/login')}>
            Entrar
          </button>
        )}

        <button className={styles.cartBtn} onClick={() => navigate('/cart')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </button>
      </div>
    </nav>
  );
}
