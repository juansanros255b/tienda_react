import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.brand}>◈ NEXUSSHOP</span>
      <span className={styles.copy}>© {new Date().getFullYear()} — Powered by Platzi Fake Store API</span>
    </footer>
  );
}
