import { apiClient } from './client';

export const paymentsApi = {
  createPayment: async (data) => {
    return apiClient('/payments', {
      method: 'POST',
      data,
    });
  },

  getPayment: async (uid) => {
    return apiClient(`/payments/${uid}`);
  },

  getReservationPayments: async (reservationId, params = {}) => {
    return apiClient(`/payments/reservation/${reservationId}`, { params });
  },

  confirmPayment: async (uid, params = {}) => {
    return apiClient(`/payments/${uid}/confirm`, {
      method: 'POST',
      params,
    });
  },

  failPayment: async (uid) => {
    return apiClient(`/payments/${uid}/fail`, {
      method: 'POST',
    });
  },

  refundPayment: async (uid) => {
    return apiClient(`/payments/${uid}/refund`, {
      method: 'POST',
    });
  },
};
