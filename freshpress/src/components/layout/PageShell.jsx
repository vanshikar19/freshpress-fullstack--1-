import styles from './PageShell.module.css';

export function PageShell({ title, subtitle, action, children }) {
  return (
    <div className={styles.shell}>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {action && <div className={styles.action}>{action}</div>}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
