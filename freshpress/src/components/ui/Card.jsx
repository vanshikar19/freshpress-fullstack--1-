import styles from './Card.module.css';

export function Card({ children, className = '', style }) {
  return (
    <div className={`${styles.card} ${className}`} style={style}>
      {children}
    </div>
  );
}
