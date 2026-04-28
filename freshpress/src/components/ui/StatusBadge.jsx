import { STATUS_META } from '../../constants';
import styles from './StatusBadge.module.css';

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.RECEIVED;
  return (
    <span
      className={styles.badge}
      style={{ background: meta.bg, color: meta.color }}
    >
      <span className={styles.dot} style={{ background: meta.dot }} />
      {meta.label}
    </span>
  );
}
