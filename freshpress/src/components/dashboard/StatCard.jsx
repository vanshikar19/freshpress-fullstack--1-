import styles from './StatCard.module.css';

export function StatCard({ label, value, sub, accent }) {
  return (
    <div className={styles.card} style={accent ? { borderTop: `3px solid ${accent}` } : {}}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  );
}
