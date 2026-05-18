import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import styles from './Search.module.css';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    api.searchProducts(query)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>
        Resultados para: <em>"{query}"</em>
      </h1>
      {loading ? (
        <p className={styles.msg}>Buscando...</p>
      ) : products.length === 0 ? (
        <p className={styles.msg}>No se encontraron productos para esta búsqueda.</p>
      ) : (
        <>
          <p className={styles.count}>{products.length} producto(s) encontrado(s)</p>
          <div className={styles.grid}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </main>
  );
}
