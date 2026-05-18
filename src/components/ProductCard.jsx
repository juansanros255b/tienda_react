import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const { user } = useAuth();

  const inCart = items.find(i => i.id === product.id);
  const image = product.images?.[0]?.replace(/["\[\]]/g, '') || 'https://picsum.photos/400/300';

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    addItem(product);
  };

  return (
    <div className={styles.card} onClick={() => navigate(`/product/${product.id}`)}>
      <div className={styles.imageWrap}>
        <img
          src={image}
          alt={product.title}
          className={styles.image}
          onError={e => e.target.src = 'https://picsum.photos/400/300'}
        />
        <div className={styles.overlay}>
          <span className={styles.viewBtn}>Ver detalle →</span>
        </div>
        {product.category && (
          <span className={styles.categoryTag}>{product.category.name}</span>
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.bottom}>
          <span className={styles.price}>${product.price}</span>
          <button
            className={`${styles.addBtn} ${inCart ? styles.inCart : ''}`}
            onClick={handleAdd}
          >
            {inCart ? `✓ (${inCart.qty})` : '+ Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}
