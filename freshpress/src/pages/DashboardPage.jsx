import { useMemo } from 'react';
import { PageShell } from '../components/layout';
import { Card } from '../components/ui';
import { StatCard } from '../components/dashboard/StatCard';
import { StatusBadge } from '../components/ui';
import { useOrders } from '../context/OrdersContext';
import { STATUS_META, ORDER_STATUSES } from '../constants';
import { formatCurrency, formatDate } from '../utils';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { orders } = useOrders();

  const stats = useMemo(() => {
    const total = orders.length;
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const delivered = orders.filter(o => o.status === 'DELIVERED').length;
    const avg = total ? revenue / total : 0;
    const perStatus = ORDER_STATUSES.reduce((acc, s) => {
      acc[s] = orders.filter(o => o.status === s).length;
      return acc;
    }, {});
    const topGarment = (() => {
      const counts = {};
      orders.forEach(o => o.garments.forEach(g => {
        counts[g.item] = (counts[g.item] || 0) + g.quantity;
      }));
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    })();
    return { total, revenue, delivered, avg, perStatus, topGarment };
  }, [orders]);

  const recent = orders.slice(0, 5);

  return (
    <PageShell
      title="Dashboard"
      subtitle="Overview of your laundry business"
    >
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Orders"
          value={stats.total}
          sub="All time"
          accent="#2C5F3F"
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(stats.revenue)}
          sub="All orders combined"
          accent="#C9B89A"
        />
        <StatCard
          label="Delivered"
          value={stats.delivered}
          sub={stats.total ? `${Math.round(stats.delivered / stats.total * 100)}% completion rate` : '—'}
          accent="#3B6D11"
        />
        <StatCard
          label="Avg Order Value"
          value={stats.total ? formatCurrency(Math.round(stats.avg)) : '—'}
          sub="Per order average"
          accent="#5C4A32"
        />
      </div>

      <div className={styles.secondRow}>
        {/* Status breakdown */}
        <Card>
          <h2 className={styles.cardTitle}>Orders by Status</h2>
          <div className={styles.statusGrid}>
            {ORDER_STATUSES.map(s => {
              const meta = STATUS_META[s];
              const count = stats.perStatus[s] || 0;
              const pct = stats.total ? Math.round(count / stats.total * 100) : 0;
              return (
                <div key={s} className={styles.statusBlock} style={{ background: meta.bg }}>
                  <span className={styles.statusCount} style={{ color: meta.color }}>{count}</span>
                  <StatusBadge status={s} />
                  <div className={styles.statusBar}>
                    <div
                      className={styles.statusBarFill}
                      style={{ width: `${pct}%`, background: meta.dot }}
                    />
                  </div>
                  <span className={styles.statusPct} style={{ color: meta.color }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top garment */}
        <Card>
          <h2 className={styles.cardTitle}>Top Garment</h2>
          {stats.topGarment ? (
            <div className={styles.topGarment}>
              <div className={styles.tgName}>{stats.topGarment[0]}</div>
              <div className={styles.tgCount}>{stats.topGarment[1]} pcs washed</div>
            </div>
          ) : (
            <p className={styles.noData}>No data yet</p>
          )}
        </Card>
      </div>

      {/* Recent orders */}
      {recent.length > 0 && (
        <Card>
          <h2 className={styles.cardTitle}>Recent Orders</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(o => (
                <tr key={o.id}>
                  <td className={styles.monoCell}>{o.id}</td>
                  <td>
                    <div className={styles.custName}>{o.customerName}</div>
                    <div className={styles.custPhone}>{o.phone}</div>
                  </td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td className={styles.amtCell}>{formatCurrency(o.total)}</td>
                  <td><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </PageShell>
  );
}
