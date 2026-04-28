import { Search, X } from 'lucide-react';
import { ORDER_STATUSES, GARMENT_PRICES } from '../../constants';
import styles from './OrderFilters.module.css';

export function OrderFilters({
  search, onSearch,
  status, onStatus,
  garmentFilter, onGarmentFilter,
  deliveryFilter, onDeliveryFilter,
  onClearAll, hasFilters,
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.searchWrap}>
        <Search size={15} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search by name, phone or order ID…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
        {search && (
          <button className={styles.clearBtn} onClick={() => onSearch('')}>
            <X size={14} />
          </button>
        )}
      </div>

      <div className={styles.filtersRow}>
        <select
          className={styles.select}
          value={garmentFilter}
          onChange={e => onGarmentFilter(e.target.value)}
        >
          <option value="">All garment types</option>
          {Object.keys(GARMENT_PRICES).map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <div className={styles.dateWrap}>
          <label className={styles.dateLabel}>Delivery on</label>
          <input
            type="date"
            className={styles.dateInput}
            value={deliveryFilter}
            onChange={e => onDeliveryFilter(e.target.value)}
          />
        </div>

        <div className={styles.pills}>
          <button className={`${styles.pill} ${!status ? styles.active : ''}`} onClick={() => onStatus('')}>All</button>
          {ORDER_STATUSES.map(s => (
            <button key={s} className={`${styles.pill} ${status === s ? styles.active : ''}`} onClick={() => onStatus(s)}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {hasFilters && (
          <button className={styles.clearAll} onClick={onClearAll}>
            <X size={12} /> Clear all
          </button>
        )}
      </div>
    </div>
  );
}
