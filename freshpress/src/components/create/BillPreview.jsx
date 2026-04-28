import { formatCurrency } from '../../utils';
import styles from './BillPreview.module.css';

export function BillPreview({ garments, customerName, phone, deliveryDate }) {
  const total = garments.reduce((s, g) => s + g.quantity * g.price, 0);
  const hasItems = garments.length > 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.shopName}>FreshPress</div>
        <div className={styles.shopSub}>Order Preview</div>
      </div>

      {customerName && (
        <div className={styles.customerInfo}>
          <span className={styles.infoLabel}>Customer</span>
          <span className={styles.infoVal}>{customerName}</span>
          {phone && <><span className={styles.infoLabel}>Phone</span><span className={styles.infoVal}>{phone}</span></>}
          {deliveryDate && <><span className={styles.infoLabel}>Delivery by</span><span className={styles.infoVal}>{new Date(deliveryDate).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</span></>}
        </div>
      )}

      <div className={styles.lineItems}>
        {!hasItems && <div className={styles.empty}>Add garments to see the bill</div>}
        {garments.map(g => (
          <div key={g.id} className={styles.lineRow}>
            <span className={styles.lineName}>{g.item}</span>
            <span className={styles.lineQty}>× {g.quantity}</span>
            <span className={styles.linePrice}>{formatCurrency(g.quantity * g.price)}</span>
          </div>
        ))}
      </div>

      {hasItems && (
        <div className={styles.totalRow}>
          <span>Total Amount</span>
          <span className={styles.totalAmt}>{formatCurrency(total)}</span>
        </div>
      )}
    </div>
  );
}
