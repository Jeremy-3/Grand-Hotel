import { apiClient } from './client';

export const guestsApi = {
  getGuests: async (params = {}) => {
    return apiClient('/guests', { params });
  },

  getGuest: async (uid) => {
    return apiClient(`/guests/${uid}`);
  },

  createGuest: async (data) => {
    return apiClient('/guests', {
      method: 'POST',
      data,
    });
  },

  updateGuest: async (uid, data) => {
    return apiClient(`/guests/${uid}`, {
      method: 'PUT',
      data,
    });
  },
};
