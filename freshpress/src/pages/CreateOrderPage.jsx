import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/layout';
import { Button, Card } from '../components/ui';
import { GarmentRow } from '../components/create/GarmentRow';
import { BillPreview } from '../components/create/BillPreview';
import { useOrderForm } from '../hooks/useOrderForm';
import { useOrders } from '../context/OrdersContext';
import styles from './CreateOrderPage.module.css';

export function CreateOrderPage() {
  const navigate = useNavigate();
  const { createOrder } = useOrders();
  const form = useOrderForm();

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.validate()) return;
    createOrder(form.getFormData());
    form.reset();
    navigate('/orders');
  }

  return (
    <PageShell
      title="New Order"
      subtitle="Fill in customer details and garments to generate a bill."
    >
      <form onSubmit={handleSubmit} className={styles.layout}>
        {/* Left — form */}
        <div className={styles.formCol}>
          <Card>
            <h2 className={styles.sectionTitle}>Customer Details</h2>
            <div className={styles.fieldGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Full Name *</label>
                <input
                  className={`${styles.input} ${form.errors.customerName ? styles.inputError : ''}`}
                  placeholder="e.g. Rahul Sharma"
                  value={form.customerName}
                  onChange={e => form.setCustomerName(e.target.value)}
                />
                {form.errors.customerName && <span className={styles.error}>{form.errors.customerName}</span>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Phone Number *</label>
                <input
                  className={`${styles.input} ${form.errors.phone ? styles.inputError : ''}`}
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={e => form.setPhone(e.target.value)}
                  maxLength={10}
                />
                {form.errors.phone && <span className={styles.error}>{form.errors.phone}</span>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Estimated Delivery</label>
                <input
                  type="date"
                  className={styles.input}
                  value={form.estimatedDelivery}
                  onChange={e => form.setEstimatedDelivery(e.target.value)}
                />
              </div>
              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Notes (optional)</label>
                <input
                  className={styles.input}
                  placeholder="e.g. Use mild detergent, handle with care…"
                  value={form.notes}
                  onChange={e => form.setNotes(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className={styles.garmentHeader}>
              <h2 className={styles.sectionTitle}>Garments</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon={<Plus size={14} />}
                onClick={form.addGarment}
              >
                Add item
              </Button>
            </div>

            <div className={styles.garmentColHeaders}>
              <span>Item</span><span>Quantity</span><span>Price</span><span>Total</span><span></span>
            </div>

            {form.garments.map(g => (
              <GarmentRow
                key={g.id}
                garment={g}
                onChange={form.updateGarment}
                onRemove={form.removeGarment}
                canRemove={form.garments.length > 1}
              />
            ))}
            {form.errors.garments && <span className={styles.error}>{form.errors.garments}</span>}
          </Card>

          <Button type="submit" variant="primary" size="lg" fullWidth>
            Create Order & Generate Bill
          </Button>
        </div>

        {/* Right — preview */}
        <div className={styles.previewCol}>
          <div className={styles.previewSticky}>
            <p className={styles.previewLabel}>Live Preview</p>
            <BillPreview
              garments={form.garments}
              customerName={form.customerName}
              phone={form.phone}
              deliveryDate={form.estimatedDelivery}
            />
          </div>
        </div>
      </form>
    </PageShell>
  );
}
