import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ordersApi } from '../utils/api';
import { generateOrderId, calcTotal } from '../utils';

const OrdersContext = createContext(null);
const API_MODE = import.meta.env.VITE_API_MODE === 'true';

export function OrdersProvider({ children }) {
  const [orders, setOrders]   = useState([]);
  const [toasts, setToasts]   = useState([]);
  const [loading, setLoading] = useState(false);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  // Fetch from MongoDB if API mode
  const fetchOrders = useCallback(async (params = {}) => {
    if (!API_MODE) return;
    try {
      setLoading(true);
      const data = await ordersApi.list(params);
      setOrders(data.orders);
    } catch (e) {
      addToast('Failed to load orders — check API connection', 'info');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Create order — saves to MongoDB or local state
  const createOrder = useCallback(async (formData) => {
    const enriched = formData.garments.map(g => ({
      item: g.item, quantity: Number(g.quantity), price: Number(g.price),
    }));

    if (API_MODE) {
      try {
        const data = await ordersApi.create({ ...formData, garments: enriched });
        setOrders(prev => [data.order, ...prev]);
        addToast(`Order ${data.order.orderId} created — ₹${data.order.total}`);
        return data.order;
      } catch (e) {
        addToast(e.message, 'info'); return null;
      }
    }

    // Offline / demo mode
    const order = {
      orderId: generateOrderId(),
      customerName: formData.customerName,
      phone: formData.phone,
      garments: enriched,
      total: calcTotal(enriched),
      status: 'RECEIVED',
      notes: formData.notes || '',
      createdAt: new Date().toISOString(),
      estimatedDelivery: formData.estimatedDelivery || null,
    };
    setOrders(prev => [order, ...prev]);
    addToast(`Order ${order.orderId} created — ₹${order.total.toLocaleString('en-IN')}`);
    return order;
  }, [addToast]);

  // Update status — persists to MongoDB + moves card in Kanban instantly
  const updateStatus = useCallback(async (id, status) => {
    // Optimistic update — move card immediately in UI
    setOrders(prev => prev.map(o =>
      (o.orderId || o.id) === id
        ? { ...o, status, updatedAt: new Date().toISOString() }
        : o
    ));
    addToast(`${id} → ${status}`);

    if (API_MODE) {
      try {
        await ordersApi.updateStatus(id, status);
        // Optionally re-fetch to confirm DB state
      } catch (e) {
        // Revert on failure
        addToast(`Failed to update ${id}`, 'info');
        fetchOrders();
      }
    }
  }, [addToast, fetchOrders]);

  // Delete order
  const deleteOrder = useCallback(async (id) => {
    setOrders(prev => prev.filter(o => (o.orderId || o.id) !== id));
    addToast(`Order ${id} deleted`, 'info');

    if (API_MODE) {
      try {
        await ordersApi.delete(id);
      } catch (e) {
        addToast(`Failed to delete ${id}`, 'info');
        fetchOrders();
      }
    }
  }, [addToast, fetchOrders]);

  return (
    <OrdersContext.Provider value={{
      orders, toasts, loading,
      createOrder, updateStatus, deleteOrder, fetchOrders,
    }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used inside OrdersProvider');
  return ctx;
}
