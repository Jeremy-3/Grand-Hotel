export const ROLES = {
  SUPERADMIN: 1,
  MANAGER: 2,
  STAFF: 3,
  GUEST: 4,
};

export const RESERVATION_STATUS_CONFIG = {
  pending: {
    label: 'Pending Deposit',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
  },
  confirmed: {
    label: 'Confirmed',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  checked_in: {
    label: 'Checked In',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
  },
  checked_out: {
    label: 'Checked Out',
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
    border: 'border-gray-500/30',
    dot: 'bg-gray-400',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    dot: 'bg-rose-400',
  },
};

export const PAYMENT_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  paid: {
    label: 'Paid',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  failed: {
    label: 'Failed',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  refunded: {
    label: 'Refunded',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
};

export const ROOM_AVAILABILITY_CONFIG = {
  available: {
    label: 'Available',
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
  },
  occupied: {
    label: 'Occupied',
    bg: 'bg-rose-500/20',
    text: 'text-rose-300',
    border: 'border-rose-500/30',
  },
  under_maintenance: {
    label: 'Maintenance',
    bg: 'bg-amber-500/20',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
  },
};

export const PAYMENT_METHODS = [
  { id: 'mpesa', name: 'M-Pesa (STK Push)', icon: '📱', desc: 'Instant mobile prompt to your phone' },
  { id: 'card', name: 'Credit / Debit Card', icon: '💳', desc: 'Secure Flutterwave checkout' },
  { id: 'cash', name: 'Pay at Front Desk', icon: '💵', desc: 'Direct cash or POS payment' },
];
