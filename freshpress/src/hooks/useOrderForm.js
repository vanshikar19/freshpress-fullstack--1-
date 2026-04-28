import { useState } from 'react';
import { GARMENT_PRICES } from '../constants';
import { defaultDeliveryDate } from '../utils';

const emptyGarment = () => ({
  id: Date.now() + Math.random(),
  item: Object.keys(GARMENT_PRICES)[0],
  quantity: 1,
  price: Object.values(GARMENT_PRICES)[0],
});

export function useOrderForm() {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState(defaultDeliveryDate());
  const [notes, setNotes] = useState('');
  const [garments, setGarments] = useState([emptyGarment()]);
  const [errors, setErrors] = useState({});

  const addGarment = () =>
    setGarments(prev => [...prev, emptyGarment()]);

  const removeGarment = (id) =>
    setGarments(prev => prev.filter(g => g.id !== id));

  const updateGarment = (id, field, value) =>
    setGarments(prev => prev.map(g => {
      if (g.id !== id) return g;
      const updated = { ...g, [field]: value };
      if (field === 'item') updated.price = GARMENT_PRICES[value] || 0;
      return updated;
    }));

  const validate = () => {
    const e = {};
    if (!customerName.trim()) e.customerName = 'Name is required';
    if (!phone.trim()) e.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(phone.trim())) e.phone = 'Enter a valid 10-digit number';
    if (garments.length === 0) e.garments = 'Add at least one garment';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const reset = () => {
    setCustomerName('');
    setPhone('');
    setEstimatedDelivery(defaultDeliveryDate());
    setNotes('');
    setGarments([emptyGarment()]);
    setErrors({});
  };

  const getFormData = () => ({
    customerName: customerName.trim(),
    phone: phone.trim(),
    estimatedDelivery,
    notes,
    garments,
  });

  return {
    customerName, setCustomerName,
    phone, setPhone,
    estimatedDelivery, setEstimatedDelivery,
    notes, setNotes,
    garments,
    errors,
    addGarment, removeGarment, updateGarment,
    validate, reset, getFormData,
  };
}
