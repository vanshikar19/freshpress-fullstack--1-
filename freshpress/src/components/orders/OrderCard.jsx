import { Trash2 } from 'lucide-react';
import { StatusBadge } from '../ui';
import { ORDER_STATUSES } from '../../constants';
import { formatCurrency, formatDate } from '../../utils';
import { useOrders } from '../../context/OrdersContext';
import styles from './OrderCard.module.css';

export function OrderCard({ order }) {
  const { updateStatus, deleteOrder } = useOrders();
  const id = order.orderId || order.id;

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.meta}>
          <span className={styles.orderId}>{id}</span>
          <h3 className={styles.name}>{order.customerName}</h3>
          <span className={styles.phone}>{order.phone}</span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className={styles.dates}>
        <span>Created {formatDate(order.createdAt)}</span>
        {order.estimatedDelivery && (
          <span>· Delivery {formatDate(order.estimatedDelivery)}</span>
        )}
      </div>

      <div className={styles.garments}>
        {order.garments.map((g, i) => (
          <span key={i} className={styles.tag}>{g.item} ×{g.quantity}</span>
        ))}
      </div>

      {order.notes && <p className={styles.notes}>"{order.notes}"</p>}

      <div className={styles.footer}>
        <span className={styles.total}>{formatCurrency(order.total)}</span>
        <div className={styles.actions}>
          <select
            className={styles.statusSelect}
            value={order.status}
            onChange={e => updateStatus(id, e.target.value)}
          >
            {ORDER_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            className={styles.deleteBtn}
            onClick={() => deleteOrder(id)}
            title="Delete order"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
