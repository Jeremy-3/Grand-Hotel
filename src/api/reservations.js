import { apiClient } from './client';

export const reservationsApi = {
  getReservations: async (params = {}) => {
    return apiClient('/reservations', { params });
  },

  getGuestReservations: async (guestId, params = {}) => {
    return apiClient(`/reservations/guest/${guestId}`, { params });
  },

  getReservation: async (uid) => {
    return apiClient(`/reservations/${uid}`);
  },

  createReservation: async (data, paymentMethod = 'mpesa') => {
    return apiClient('/reservations', {
      method: 'POST',
      params: { payment_method: paymentMethod },
      data,
    });
  },

  updateReservation: async (uid, data) => {
    return apiClient(`/reservations/${uid}`, {
      method: 'PATCH',
      data,
    });
  },

  confirmReservation: async (uid) => {
    return apiClient(`/reservations/${uid}/confirm`, {
      method: 'POST',
    });
  },

  checkIn: async (uid) => {
    return apiClient(`/reservations/${uid}/check-in`, {
      method: 'POST',
    });
  },

  checkOut: async (uid) => {
    return apiClient(`/reservations/${uid}/check-out`, {
      method: 'POST',
    });
  },

  cancelReservation: async (uid) => {
    return apiClient(`/reservations/${uid}/cancel`, {
      method: 'POST',
    });
  },
};
