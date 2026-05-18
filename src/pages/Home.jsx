import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import styles from './Home.module.css';

const LIMIT = 10;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  const loadProducts = useCallback(async (cat, off, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);
    try {
      const data = cat
        ? await api.getProductsByCategory(cat, LIMIT, off)
        : await api.getProducts(LIMIT, off);
      setProducts(prev => append ? [...prev, ...data] : data);
      setHasMore(data.length === LIMIT);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setOffset(0);
    setProducts([]);
    loadProducts(activeCat, 0, false);
  }, [activeCat, loadProducts]);

  // Infinite scroll
  useEffect(() => {
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
        const newOffset = offset + LIMIT;
        setOffset(newOffset);
        loadProducts(activeCat, newOffset, true);
      }
    }, { threshold: 0.1 });
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, loading, offset, activeCat, loadProducts]);

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      const newOffset = offset + LIMIT;
      setOffset(newOffset);
      loadProducts(activeCat, newOffset, true);
    }
  };

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <p className={styles.heroSub}>— Descubre lo último —</p>
        <h1 className={styles.heroTitle}>
          Todo lo que<br /><em>necesitas,</em> aquí.
        </h1>
        <p className={styles.heroDesc}>Miles de productos. Precios increíbles. Entrega rápida.</p>
      </section>

      <section className={styles.content}>
        <div className={styles.categories}>
          <button
            className={`${styles.catBtn} ${!activeCat ? styles.active : ''}`}
            onClick={() => setActiveCat(null)}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`${styles.catBtn} ${activeCat === cat.id ? styles.active : ''}`}
              onClick={() => setActiveCat(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.loadingGrid}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>

            {products.length === 0 && (
              <p className={styles.empty}>No se encontraron productos.</p>
            )}

            {hasMore && (
              <div className={styles.loadMoreWrap}>
                <button
                  className={styles.loadMoreBtn}
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <span className={styles.spinner}>Cargando...</span>
                  ) : 'Cargar más productos'}
                </button>
              </div>
            )}

            {loadingMore && (
              <div className={styles.loadingBar}>
                <div className={styles.loadingBarInner} />
              </div>
            )}

            <div ref={sentinelRef} style={{ height: 1 }} />
          </>
        )}
      </section>
    </main>
  );
}
