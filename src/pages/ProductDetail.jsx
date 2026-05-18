import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getProductById(id)
      .then(setProduct)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className={styles.loadingWrap}>
      <div className={styles.spinner} />
    </div>
  );

  if (!product) return null;

  const images = product.images?.map(img => img.replace(/["\[\]]/g, '')) || ['https://picsum.photos/600/400'];
  const inCart = items.find(i => i.id === product.id);

  const handleBuy = () => {
    if (!user) { navigate('/login'); return; }
    addItem(product);
    setAdded(true);
    setTimeout(() => navigate('/cart'), 600);
  };

  const handleAddCart = () => {
    if (!user) { navigate('/login'); return; }
    addItem(product);
    setAdded(true);
  };

  return (
    <main className={styles.main}>
      <button className={styles.back} onClick={() => navigate(-1)}>← Volver</button>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.mainImg}>
            <img
              src={images[activeImg]}
              alt={product.title}
              onError={e => e.target.src = 'https://picsum.photos/600/400'}
            />
          </div>
          {images.length > 1 && (
            <div className={styles.thumbs}>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className={`${styles.thumb} ${i === activeImg ? styles.activeThumb : ''}`}
                  onClick={() => setActiveImg(i)}
                  onError={e => e.target.src = 'https://picsum.photos/100'}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.info}>
          {product.category && (
            <span className={styles.cat}>{product.category.name}</span>
          )}
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.price}>${product.price}</p>
          <p className={styles.desc}>{product.description}</p>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>ID Producto</span>
              <span>#{product.id}</span>
            </div>
            {product.category && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Categoría</span>
                <span>{product.category.name}</span>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button
              className={`${styles.addBtn} ${(inCart || added) ? styles.inCart : ''}`}
              onClick={handleAddCart}
            >
              {inCart || added ? `✓ En el carrito (${inCart?.qty || 1})` : '+ Añadir al carrito'}
            </button>
            <button className={styles.buyBtn} onClick={handleBuy}>
              Comprar ahora →
            </button>
          </div>

          {!user && (
            <p className={styles.loginNote}>
              <button onClick={() => navigate('/login')} className={styles.loginLink}>
                Inicia sesión
              </button> para poder comprar
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
