import { Link } from "react-router-dom";
import { PageShell } from "../components/layout";
import { Button, ErrorBoundary } from "../components/ui";
import { OrderCard } from "../components/orders/OrderCard";
import { OrderFilters } from "../components/orders/OrderFilters";
import { useOrderFilter } from "../hooks/useOrderFilter";
import { ORDER_STATUSES, STATUS_META } from "../constants";
import styles from "./OrdersPage.module.css";

function KanbanBoard({ filtered }) {
  const grouped = ORDER_STATUSES.reduce((acc, s) => {
    acc[s] = filtered.filter((o) => o.status === s);
    return acc;
  }, {});

  return (
    <div className={styles.kanban}>
      {ORDER_STATUSES.map((status) => {
        const meta = STATUS_META[status];
        const cols = grouped[status] || [];
        return (
          <div key={status} className={styles.column}>
            <div
              className={styles.colHeader}
              style={{ borderTopColor: meta.dot }}
            >
              <div className={styles.colTitle}>
                <span
                  className={styles.colDot}
                  style={{ background: meta.dot }}
                />
                <span className={styles.colLabel}>{meta.label}</span>
              </div>
              <span
                className={styles.colCount}
                style={{ background: meta.bg, color: meta.color }}
              >
                {cols.length}
              </span>
            </div>
            <div className={styles.colBody}>
              {cols.length === 0 ? (
                <div className={styles.colEmpty}>No orders</div>
              ) : (
                cols.map((order) => (
                  <OrderCard
                    key={order.orderId || order.id || Math.random()}
                    order={order}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function OrdersPage() {
  const {
    filtered,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    garmentFilter,
    setGarmentFilter,
    deliveryFilter,
    setDeliveryFilter,
    clearAll,
    hasFilters,
  } = useOrderFilter();

  const isEmpty = filtered.length === 0;

  return (
    <PageShell
      title="Orders"
      subtitle={`${filtered.length} order${filtered.length !== 1 ? "s" : ""}`}
      action={
        <Link to="/">
          <Button variant="primary" size="sm">
            + New Order
          </Button>
        </Link>
      }
    >
      <OrderFilters
        search={search}
        onSearch={setSearch}
        status={statusFilter}
        onStatus={setStatusFilter}
        garmentFilter={garmentFilter}
        onGarmentFilter={setGarmentFilter}
        deliveryFilter={deliveryFilter}
        onDeliveryFilter={setDeliveryFilter}
        onClearAll={clearAll}
        hasFilters={hasFilters}
      />

      {isEmpty ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>◎</div>
          <p className={styles.emptyTitle}>No orders found</p>
          <p className={styles.emptySub}>
            {hasFilters
              ? "Try adjusting your filters or clear them"
              : "Create your first order to get started"}
          </p>
          {!hasFilters && (
            <Link to="/">
              <Button variant="primary" size="sm">
                Create Order
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <ErrorBoundary>
          <KanbanBoard filtered={filtered} />
        </ErrorBoundary>
      )}
    </PageShell>
  );
}
