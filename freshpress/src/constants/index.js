export const GARMENT_PRICES = {
  Shirt: 80,
  Pants: 100,
  Saree: 200,
  'Suit (2pc)': 350,
  Jacket: 250,
  Kurta: 120,
  'Bed Sheet': 150,
  Towel: 60,
  Blanket: 300,
  Dress: 180,
  'Salwar Suit': 160,
  'Sherwani': 450,
};

export const ORDER_STATUSES = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

export const STATUS_META = {
  RECEIVED:   { label: 'Received',   color: '#185FA5', bg: '#E6F1FB', dot: '#378ADD' },
  PROCESSING: { label: 'Processing', color: '#854F0B', bg: '#FAEEDA', dot: '#EF9F27' },
  READY:      { label: 'Ready',      color: '#3B6D11', bg: '#EAF3DE', dot: '#639922' },
  DELIVERED:  { label: 'Delivered',  color: '#5F5E5A', bg: '#F1EFE8', dot: '#888780' },
};

export const NAV_LINKS = [
  { path: '/',          label: 'New Order' },
  { path: '/orders',   label: 'Orders'    },
  { path: '/dashboard', label: 'Dashboard' },
];
