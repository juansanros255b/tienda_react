import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden'); return; }
    if (form.password.length < 4) { setError('La contraseña debe tener al menos 4 caracteres'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.logo}>◈</div>
        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.sub}>Únete a NEXUSSHOP hoy</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Nombre</label>
            <input type="text" value={form.name} onChange={set('name')} placeholder="Tu nombre" required />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="tu@email.com" required />
          </div>
          <div className={styles.field}>
            <label>Contraseña</label>
            <input type="password" value={form.password} onChange={set('password')} placeholder="Mínimo 4 caracteres" required />
          </div>
          <div className={styles.field}>
            <label>Confirmar contraseña</label>
            <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repite la contraseña" required />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className={styles.footer}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className={styles.link}>Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
}
