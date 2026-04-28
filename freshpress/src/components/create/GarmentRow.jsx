import { Trash2 } from 'lucide-react';
import { GARMENT_PRICES } from '../../constants';
import styles from './GarmentRow.module.css';

export function GarmentRow({ garment, onChange, onRemove, canRemove }) {
  return (
    <div className={styles.row}>
      <select
        className={styles.select}
        value={garment.item}
        onChange={e => onChange(garment.id, 'item', e.target.value)}
      >
        {Object.keys(GARMENT_PRICES).map(k => (
          <option key={k} value={k}>{k}</option>
        ))}
      </select>

      <div className={styles.qtyWrap}>
        <button
          type="button"
          className={styles.stepper}
          onClick={() => onChange(garment.id, 'quantity', Math.max(1, garment.quantity - 1))}
        >−</button>
        <span className={styles.qtyVal}>{garment.quantity}</span>
        <button
          type="button"
          className={styles.stepper}
          onClick={() => onChange(garment.id, 'quantity', garment.quantity + 1)}
        >+</button>
      </div>

      <div className={styles.priceWrap}>
        <span className={styles.rupee}>₹</span>
        <input
          type="number"
          className={styles.priceInput}
          value={garment.price}
          min={0}
          onChange={e => onChange(garment.id, 'price', Number(e.target.value))}
        />
      </div>

      <div className={styles.lineTotal}>
        ₹{(garment.quantity * garment.price).toLocaleString('en-IN')}
      </div>

      <button
        type="button"
        className={styles.removeBtn}
        onClick={() => onRemove(garment.id)}
        disabled={!canRemove}
        title="Remove"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
