import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './Cart.module.css';

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ordered, setOrdered] = useState(false);

  const handleOrder = () => {
    if (!user) { navigate('/login'); return; }
    setOrdered(true);
    clearCart();
  };

  if (ordered) return (
    <main className={styles.main}>
      <div className={styles.success}>
        <div className={styles.successIcon}>✓</div>
        <h2>¡Pedido realizado!</h2>
        <p>Gracias por tu compra. Recibirás un email de confirmación en breve.</p>
        <button className={styles.continuBtn} onClick={() => navigate('/')}>
          Seguir comprando
        </button>
      </div>
    </main>
  );

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Carrito de la compra</h1>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🛍</span>
          <p>Tu carrito está vacío.</p>
          <button className={styles.continuBtn} onClick={() => navigate('/')}>
            Ver productos
          </button>
        </div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.itemsList}>
            {items.map(item => {
              const img = item.images?.[0]?.replace(/["\[\]]/g, '') || 'https://picsum.photos/100';
              return (
                <div key={item.id} className={styles.item}>
                  <img
                    src={img}
                    alt={item.title}
                    className={styles.itemImg}
                    onError={e => e.target.src = 'https://picsum.photos/100'}
                    onClick={() => navigate(`/product/${item.id}`)}
                  />
                  <div className={styles.itemInfo}>
                    <p className={styles.itemTitle}
                       onClick={() => navigate(`/product/${item.id}`)}>
                      {item.title}
                    </p>
                    <p className={styles.itemPrice}>${item.price} c/u</p>
                  </div>
                  <div className={styles.qtyControls}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <p className={styles.itemSubtotal}>${(item.price * item.qty).toFixed(2)}</p>
                  <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>✕</button>
                </div>
              );
            })}
          </div>

          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Resumen</h2>
            {items.map(i => (
              <div key={i.id} className={styles.summaryLine}>
                <span>{i.title.slice(0, 22)}… ×{i.qty}</span>
                <span>${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className={styles.orderBtn} onClick={handleOrder}>
              {user ? 'Finalizar pedido →' : 'Inicia sesión para comprar'}
            </button>
            <button className={styles.clearBtn} onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
