import { useOrders } from '../../context/OrdersContext';
import styles from './Toast.module.css';

export function ToastContainer() {
  const { toasts } = useOrders();
  return (
    <div className={styles.container}>
      {toasts.map(t => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type || 'success']}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
