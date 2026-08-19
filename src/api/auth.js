import { apiClient } from './client';

export const authApi = {
  login: async (email, password) => {
    return apiClient('/auth/login', {
      method: 'POST',
      data: { email, password },
    });
  },

  signup: async ({ name, email, phone_number, password }) => {
    return apiClient('/auth/signup', {
      method: 'POST',
      data: { name, email, phone_number, password },
    });
  },

  logout: async () => {
    return apiClient('/auth/logout', {
      method: 'POST',
    });
  },
};
