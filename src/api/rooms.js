import { apiClient } from './client';

export const roomsApi = {
  getRooms: async (params = {}) => {
    return apiClient('/rooms', { params });
  },

  getRoom: async (uid) => {
    return apiClient(`/rooms/${uid}`);
  },

  getRoomTypes: async (params = {}) => {
    return apiClient('/room-types', { params });
  },

  getRoomType: async (uid) => {
    return apiClient(`/room-types/${uid}`);
  },
};
