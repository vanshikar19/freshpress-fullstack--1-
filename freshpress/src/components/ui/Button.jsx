import styles from './Button.module.css';

export function Button({ children, variant = 'primary', size = 'md', onClick, type = 'button', disabled, fullWidth, icon }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        disabled ? styles.disabled : '',
      ].join(' ')}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
}
