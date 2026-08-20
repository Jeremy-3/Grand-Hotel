import { apiClient } from "./client";

export const adminApi = {
  getRoles: (params = {}) => apiClient("/roles/", { params }),
  createRole: (data) => apiClient("/roles/", { method: "POST", data }),
  updateRole: (uid, data) =>
    apiClient(`/roles/${uid}`, { method: "PUT", data }),
  getPermissions: (params = {}) => apiClient("/permissions", { params }),
  getRolePermissions: (roleId) => apiClient(`/role-permissions/role/${roleId}`),
  assignPermissions: (data) =>
    apiClient("/role-permissions/assign", { method: "POST", data }),
  deassignPermissions: (data) =>
    apiClient("/role-permissions/deassign", { method: "POST", data }),

  getUsers: (params = {}) => apiClient("/users", { params }),
  createUser: (data) => apiClient("/users", { method: "POST", data }),
  updateUser: (uid, data) =>
    apiClient(`/users/${uid}`, { method: "PUT", data }),
  getManagers: (params = {}) => apiClient("/managers", { params }),
  createManager: (data) => apiClient("/managers", { method: "POST", data }),
  updateManager: (uid, data) =>
    apiClient(`/managers/${uid}`, { method: "PUT", data }),

  getRooms: (params = {}) => apiClient("/rooms", { params }),
  getRoomTypes: (params = {}) => apiClient("/room-types", { params }),
  createRoomType: (data) => apiClient("/room-types", { method: "POST", data }),
  createRoom: (data) => apiClient("/rooms", { method: "POST", data }),
  updateRoom: (uid, data) =>
    apiClient(`/rooms/${uid}`, { method: "PUT", data }),
  getGuests: (params = {}) => apiClient("/guests", { params }),
  updateGuest: (uid, data) =>
    apiClient(`/guests/${uid}`, { method: "PUT", data }),
  getReservations: (params = {}) => apiClient("/reservations", { params }),
};
