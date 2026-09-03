import { apiClient } from "./client";

export const adminApi = {
  // Roles
  getRoles: (params = {}) => apiClient("/roles/", { params }),
  createRole: (data) => apiClient("/roles/", { method: "POST", data }),
  updateRole: (uid, data) => apiClient(`/roles/${uid}`, { method: "PUT", data }),
  
  // Permissions & Assignments
  getPermissions: (params = {}) => apiClient("/permissions", { params }),
  createPermission: (data) => apiClient("/permissions", { method: "POST", data }),
  updatePermission: (uid, data) => apiClient(`/permissions/${uid}`, { method: "PUT", data }),
  getRolePermissions: (roleId) => apiClient(`/role-permissions/role/${roleId}`),
  assignPermissions: (data) => apiClient("/role-permissions/assign", { method: "POST", data }),
  deassignPermissions: (data) => apiClient("/role-permissions/deassign", { method: "POST", data }),

  // Users
  getUsers: (params = {}) => apiClient("/users", { params }),
  createUser: (data) => apiClient("/users", { method: "POST", data }),
  updateUser: (uid, data) => apiClient(`/users/${uid}`, { method: "PUT", data }),

  // Managers
  getManagers: (params = {}) => apiClient("/managers", { params }),
  createManager: (data) => apiClient("/managers", { method: "POST", data }),
  updateManager: (uid, data) => apiClient(`/managers/${uid}`, { method: "PUT", data }),

  // Guests
  getGuests: (params = {}) => apiClient("/guests", { params }),
  createGuest: (data) => apiClient("/guests", { method: "POST", data }),
  registerGuest: (data) => apiClient("/guests/register", { method: "POST", data }),
  updateGuest: (uid, data) => apiClient(`/guests/${uid}`, { method: "PUT", data }),

  // Rooms & Room Types
  getRooms: (params = {}) => apiClient("/rooms", { params }),
  createRoom: (data) => apiClient("/rooms", { method: "POST", data }),
  updateRoom: (uid, data) => apiClient(`/rooms/${uid}`, { method: "PUT", data }),
  getRoomTypes: (params = {}) => apiClient("/room-types", { params }),
  createRoomType: (data) => apiClient("/room-types", { method: "POST", data }),
  updateRoomType: (uid, data) => apiClient(`/room-types/${uid}`, { method: "PUT", data }),

  // Reservations
  getReservations: (params = {}) => apiClient("/reservations", { params }),
  createReservation: (data, paymentMethod = "mpesa", queryParams = {}) =>
    apiClient("/reservations", {
      method: "POST",
      params: { payment_method: paymentMethod, ...queryParams },
      data,
    }),
  updateReservation: (uid, data) => apiClient(`/reservations/${uid}`, { method: "PATCH", data }),
  confirmReservation: (uid) => apiClient(`/reservations/${uid}/confirm`, { method: "POST" }),
  checkInReservation: (uid) => apiClient(`/reservations/${uid}/check-in`, { method: "POST" }),
  checkOutReservation: (uid) => apiClient(`/reservations/${uid}/check-out`, { method: "POST" }),
  cancelReservation: (uid) => apiClient(`/reservations/${uid}/cancel`, { method: "POST" }),

  // Payments
  getPaymentsByReservation: (reservationId, params = {}) =>
    apiClient(`/payments/reservation/${reservationId}`, { params }),
  createPayment: (data) => apiClient("/payments", { method: "POST", data }),
  confirmPayment: (uid, params = {}) => apiClient(`/payments/${uid}/confirm`, { method: "POST", params }),
  failPayment: (uid) => apiClient(`/payments/${uid}/fail`, { method: "POST" }),
  refundPayment: (uid) => apiClient(`/payments/${uid}/refund`, { method: "POST" }),
};
