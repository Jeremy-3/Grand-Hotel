import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminApi } from "../api/admin";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Swal from "sweetalert2";
import {
  FaChartLine,
  FaCog,
  FaHotel,
  FaKey,
  FaPlus,
  FaSave,
  FaUsers,
} from "react-icons/fa";

const navigation = [
  {
    id: "overview",
    label: "Dashboard",
    description: "Hotel reports",
    icon: FaChartLine,
  },
  {
    id: "access",
    label: "Access control",
    description: "Roles and permissions",
    icon: FaKey,
  },
  {
    id: "inventory",
    label: "Inventory",
    description: "Rooms and room types",
    icon: FaHotel,
  },
  {
    id: "people",
    label: "People",
    description: "Users, guests and managers",
    icon: FaUsers,
  },
];

const fieldClass =
  "w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/60";

const Superadmin = () => {
  const { isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    roles: [],
    permissions: [],
    users: [],
    managers: [],
    guests: [],
    rooms: [],
    roomTypes: [],
    reservations: [],
  });
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [roomForm, setRoomForm] = useState({
    room_number: "",
    room_type_id: "",
    room_availability: "available",
    image: "",
  });
  const [roomTypeForm, setRoomTypeForm] = useState({
    name: "",
    description: "",
    price_per_night: "",
    amenities: "",
    deposit_percentage: "",
  });
  const [roleForm, setRoleForm] = useState({ name: "", active: true });
  const [peopleForm, setPeopleForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "Manager@123",
    role_id: 2,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const results = await Promise.all([
        adminApi.getRoles({ limit: 100 }),
        adminApi.getPermissions({ limit: 100 }),
        adminApi.getUsers({ limit: 100 }),
        adminApi.getManagers({ limit: 100 }),
        adminApi.getGuests({ limit: 100 }),
        adminApi.getRooms({ limit: 100 }),
        adminApi.getRoomTypes({ limit: 100 }),
        adminApi.getReservations({ limit: 100 }),
      ]);
      setData({
        roles: results[0].data || [],
        permissions: results[1].data || [],
        users: results[2].data || [],
        managers: results[3].data || [],
        guests: results[4].data || [],
        rooms: results[5].data || [],
        roomTypes: results[6].data || [],
        reservations: results[7].data || [],
      });
    } catch (error) {
      Swal.fire({
        title: "Control center unavailable",
        text: error.message,
        icon: "error",
        background: "#0f172a",
        color: "#f8fafc",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) loadData();
  }, [isSuperAdmin]);

  const selectRole = async (role) => {
    setSelectedRole(role);
    try {
      const response = await adminApi.getRolePermissions(role.id);
      setRolePermissions(
        (response.data?.permissions || []).map((permission) => permission.id),
      );
    } catch (error) {
      Swal.fire({
        title: "Could not load permissions",
        text: error.message,
        icon: "error",
      });
    }
  };

  const saveRolePermissions = async () => {
    if (!selectedRole) return;
    try {
      const current = await adminApi.getRolePermissions(selectedRole.id);
      const currentIds = (current.data?.permissions || []).map(
        (permission) => permission.id,
      );
      const added = rolePermissions.filter((id) => !currentIds.includes(id));
      const removed = currentIds.filter((id) => !rolePermissions.includes(id));
      if (added.length)
        await adminApi.assignPermissions({
          role_id: selectedRole.id,
          permissions_id: added,
        });
      if (removed.length)
        await adminApi.deassignPermissions({
          role_id: selectedRole.id,
          permissions_id: removed,
        });
      Swal.fire({
        title: "Permissions saved",
        icon: "success",
        timer: 1300,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Could not save permissions",
        text: error.message,
        icon: "error",
      });
    }
  };

  const createRoom = async (event) => {
    event.preventDefault();
    try {
      await adminApi.createRoom({
        ...roomForm,
        room_number: Number(roomForm.room_number),
        room_type_id: Number(roomForm.room_type_id),
      });
      setRoomForm({
        room_number: "",
        room_type_id: "",
        room_availability: "available",
        image: "",
      });
      await loadData();
      Swal.fire({
        title: "Room created",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Could not create room",
        text: error.message,
        icon: "error",
      });
    }
  };

  const createManager = async (event) => {
    event.preventDefault();
    try {
      const user = await adminApi.createUser({
        ...peopleForm,
        role_id: peopleForm.role_id,
      });
      if (Number(peopleForm.role_id) === 2) {
        await adminApi.createManager({
          user_id: user.data.id,
          status: "active",
        });
      }
      setPeopleForm({
        name: "",
        email: "",
        phone_number: "",
        password: "Manager@123",
        role_id: peopleForm.role_id,
      });
      await loadData();
      Swal.fire({
        title: "Manager created",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Could not create manager",
        text: error.message,
        icon: "error",
      });
    }
  };

  const createRole = async (event) => {
    event.preventDefault();
    try {
      await adminApi.createRole({
        ...roleForm,
        name: roleForm.name.toUpperCase(),
      });
      setRoleForm({ name: "", active: true });
      await loadData();
      Swal.fire({
        title: "Role created",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Could not create role",
        text: error.message,
        icon: "error",
      });
    }
  };

  const createRoomType = async (event) => {
    event.preventDefault();
    try {
      await adminApi.createRoomType({
        ...roomTypeForm,
        price_per_night: Number(roomTypeForm.price_per_night),
        deposit_percentage: Number(roomTypeForm.deposit_percentage),
      });
      setRoomTypeForm({
        name: "",
        description: "",
        price_per_night: "",
        amenities: "",
        deposit_percentage: "",
      });
      await loadData();
      Swal.fire({
        title: "Room type created",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Could not create room type",
        text: error.message,
        icon: "error",
      });
    }
  };

  if (!isSuperAdmin)
    return (
      <div className="min-h-screen bg-slate-950 pt-32 text-center text-gray-300">
        Superadmin access required.
      </div>
    );
  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 pt-32">
        <LoadingSpinner text="Loading hotel control center..." />
      </div>
    );

  const pending = data.reservations.filter(
    (item) => item.status === "pending",
  ).length;
  const confirmed = data.reservations.filter((item) =>
    ["confirmed", "checked_in"].includes(item.status),
  ).length;
  const availableRooms = data.rooms.filter(
    (room) => room.room_availability === "available",
  ).length;
  const revenue = data.reservations.reduce(
    (total, reservation) => total + Number(reservation.total_amount || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.2em] font-semibold mb-3">
              <FaCog /> Grand Hotel administration
            </div>
            <h1 className="font-serif text-4xl font-bold text-white">
              The hotel command desk.
            </h1>
            <p className="text-gray-400 mt-2 max-w-2xl">
              Reports, access, inventory, and people operations in one focused
              workspace.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 text-sm text-gray-200 hover:border-gold-500/60 hover:text-gold-300"
            >
              <FaChartLine /> Refresh data
            </button>
            <button
              onClick={async () => {
                await logout();
                navigate("/login");
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-sm text-gray-300 hover:bg-rose-500/15 hover:text-rose-300"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[235px_1fr] gap-8 items-start">
          <aside className="lg:sticky lg:top-8 bg-slate-900 border border-slate-800 rounded-2xl p-3">
            <p className="px-3 pt-2 pb-3 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">
              Operations
            </p>
            <div className="space-y-1">
              {navigation.map(({ id, label, description, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-start gap-3 text-left px-3 py-3 rounded-xl transition ${activeTab === id ? "bg-gold-500 text-slate-950" : "text-gray-400 hover:bg-slate-800 hover:text-white"}`}
                >
                  <Icon className="mt-0.5 shrink-0" />
                  <span>
                    <strong className="block text-sm">{label}</strong>
                    <small
                      className={`${activeTab === id ? "text-slate-800" : "text-gray-500"}`}
                    >
                      {description}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <div className="min-w-0">
            {activeTab === "overview" && (
              <section className="space-y-8">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    [
                      "Available rooms",
                      availableRooms,
                      "of " + data.rooms.length + " total",
                    ],
                    ["Active stays", confirmed, "confirmed or checked in"],
                    ["Awaiting deposit", pending, "pending reservations"],
                    [
                      "Guest profiles",
                      data.guests.length,
                      data.managers.length + " managers",
                    ],
                    ["Booked value", `KES ${revenue.toLocaleString()}`, "across reservations"],
                  ].map(([label, value, note]) => (
                    <div
                      key={label}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
                    >
                      <div className="text-xs uppercase tracking-wider text-gray-500">
                        {label}
                      </div>
                      <div className="text-3xl font-bold text-white mt-2">
                        {value}
                      </div>
                      <div className="text-xs text-gold-400 mt-1">{note}</div>
                    </div>
                  ))}
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="font-serif text-xl text-white mb-4">
                      Reservation status
                    </h2>
                    {[
                      "pending",
                      "confirmed",
                      "checked_in",
                      "checked_out",
                      "cancelled",
                      "expired",
                    ].map((status) => {
                      const count = data.reservations.filter(
                        (item) => item.status === status,
                      ).length;
                      return (
                        <div
                          key={status}
                          className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0"
                        >
                          <span className="capitalize text-gray-300">
                            {status.replace("_", " ")}
                          </span>
                          <span className="font-semibold text-gold-300">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="font-serif text-xl text-white mb-4">
                      System snapshot
                    </h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Users</span>
                        <span className="text-white">{data.users.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Roles</span>
                        <span className="text-white">{data.roles.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Permissions</span>
                        <span className="text-white">
                          {data.permissions.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Inventory coverage
                        </span>
                        <span className="text-emerald-400">
                          {data.rooms.length
                            ? Math.round(
                                (availableRooms / data.rooms.length) * 100,
                              )
                            : 0}
                          % available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h2 className="font-serif text-xl text-white mb-5">
                    Hotel pulse
                  </h2>
                  <div className="grid md:grid-cols-2 gap-5">
                    {[
                      [
                        "Available",
                        availableRooms,
                        data.rooms.length,
                        "bg-emerald-400",
                      ],
                      [
                        "Active stays",
                        confirmed,
                        data.reservations.length,
                        "bg-blue-400",
                      ],
                      [
                        "Pending deposits",
                        pending,
                        data.reservations.length,
                        "bg-amber-400",
                      ],
                    ].map(([label, value, total, color]) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-gray-400">{label}</span>
                          <span className="text-white font-semibold">
                            {value}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full ${color} rounded-full transition-all`}
                            style={{
                              width: `${total ? Math.min(100, (value / total) * 100) : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeTab === "access" && (
              <section className="grid lg:grid-cols-[260px_1fr] gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1">
                  {data.roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => selectRole(role)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm ${selectedRole?.id === role.id ? "bg-gold-500 text-black font-bold" : "text-gray-300 hover:bg-slate-800"}`}
                    >
                      {role.name}
                    </button>
                  ))}
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h2 className="font-serif text-xl text-white">
                        Permission matrix
                      </h2>
                      <p className="text-sm text-gray-400">
                        Select a role, then save its access policy.
                      </p>
                    </div>
                    <button
                      disabled={!selectedRole}
                      onClick={saveRolePermissions}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 text-black text-sm font-bold disabled:opacity-40"
                    >
                      <FaSave /> Save
                    </button>
                  </div>
                  {selectedRole ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {data.permissions.map((permission) => (
                        <label
                          key={permission.id}
                          className="flex gap-2 items-start p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-gray-300"
                        >
                          <input
                            type="checkbox"
                            checked={rolePermissions.includes(permission.id)}
                            onChange={(event) =>
                              setRolePermissions(
                                event.target.checked
                                  ? [...rolePermissions, permission.id]
                                  : rolePermissions.filter(
                                      (id) => id !== permission.id,
                                    ),
                              )
                            }
                            className="mt-0.5 accent-yellow-500"
                          />{" "}
                          <span>
                            <strong className="block text-gray-100">
                              {permission.name}
                            </strong>
                            {permission.description}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center text-gray-500">
                      Choose a role to manage its permissions.
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeTab === "inventory" && (
              <section className="space-y-6">
                <form
                  onSubmit={createRoomType}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                >
                  <h2 className="font-serif text-xl text-white mb-4">
                    <FaPlus className="inline text-gold-400 mr-2" /> Add room
                    type
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <select
                      required
                      className={fieldClass}
                      value={roomTypeForm.name}
                      onChange={(e) =>
                        setRoomTypeForm({
                          ...roomTypeForm,
                          name: e.target.value,
                        })
                      }
                    >
                      <option value="">Choose a room type</option>
                      <option>Standard / Traditional</option>
                      <option>Deluxe</option>
                      <option>Superior</option>
                      <option>Executive / Club</option>
                    </select>
                    <input
                      required
                      className={fieldClass}
                      placeholder="Price per night"
                      type="number"
                      value={roomTypeForm.price_per_night}
                      onChange={(e) =>
                        setRoomTypeForm({
                          ...roomTypeForm,
                          price_per_night: e.target.value,
                        })
                      }
                    />
                    <input
                      required
                      className={fieldClass}
                      placeholder="Deposit percentage"
                      type="number"
                      value={roomTypeForm.deposit_percentage}
                      onChange={(e) =>
                        setRoomTypeForm({
                          ...roomTypeForm,
                          deposit_percentage: e.target.value,
                        })
                      }
                    />
                    <input
                      required
                      className={`${fieldClass} sm:col-span-2`}
                      placeholder="Description"
                      value={roomTypeForm.description}
                      onChange={(e) =>
                        setRoomTypeForm({
                          ...roomTypeForm,
                          description: e.target.value,
                        })
                      }
                    />
                    <input
                      required
                      className={fieldClass}
                      placeholder="Amenities"
                      value={roomTypeForm.amenities}
                      onChange={(e) =>
                        setRoomTypeForm({
                          ...roomTypeForm,
                          amenities: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 text-black text-sm font-bold">
                    <FaPlus /> Create room type
                  </button>
                </form>
                <form
                  onSubmit={createRoom}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                >
                  <h2 className="font-serif text-xl text-white mb-4">
                    <FaPlus className="inline text-gold-400 mr-2" /> Add room
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <input
                      required
                      className={fieldClass}
                      placeholder="Room number"
                      value={roomForm.room_number}
                      onChange={(e) =>
                        setRoomForm({
                          ...roomForm,
                          room_number: e.target.value,
                        })
                      }
                    />
                    <select
                      required
                      className={fieldClass}
                      value={roomForm.room_type_id}
                      onChange={(e) =>
                        setRoomForm({
                          ...roomForm,
                          room_type_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Choose room type</option>
                      {data.roomTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className={fieldClass}
                      value={roomForm.room_availability}
                      onChange={(e) =>
                        setRoomForm({
                          ...roomForm,
                          room_availability: e.target.value,
                        })
                      }
                    >
                      <option value="available">Available</option>
                      <option value="under_maintenance">Maintenance</option>
                      <option value="reserved">Reserved</option>
                    </select>
                    <input
                      required
                      className={fieldClass}
                      placeholder="Image URL"
                      value={roomForm.image}
                      onChange={(e) =>
                        setRoomForm({ ...roomForm, image: e.target.value })
                      }
                    />
                  </div>
                  <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 text-black text-sm font-bold">
                    <FaPlus /> Create room
                  </button>
                </form>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="p-6">
                    <h2 className="font-serif text-xl text-white">
                      Room inventory
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-950 text-xs uppercase text-gold-400">
                        <tr>
                          <th className="text-left px-6 py-3">Room</th>
                          <th className="text-left px-6 py-3">Type</th>
                          <th className="text-left px-6 py-3">Availability</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {data.rooms.map((room) => (
                          <tr key={room.id}>
                            <td className="px-6 py-4 text-white">
                              {room.room_number}
                            </td>
                            <td className="px-6 py-4 text-gray-400">
                              #{room.room_type_id}
                            </td>
                            <td className="px-6 py-4 capitalize text-emerald-400">
                              {room.room_availability?.replace("_", " ")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "people" && (
              <section className="space-y-6">
                <form
                  onSubmit={createManager}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                >
                  <h2 className="font-serif text-xl text-white mb-4">
                    Create manager account
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {["name", "email", "phone_number", "password"].map(
                      (field) => (
                        <input
                          key={field}
                          required
                          className={fieldClass}
                          type={
                            field === "password"
                              ? "password"
                              : field === "email"
                                ? "email"
                                : "text"
                          }
                          placeholder={field.replace("_", " ")}
                          value={peopleForm[field]}
                          onChange={(e) =>
                            setPeopleForm({
                              ...peopleForm,
                              [field]: e.target.value,
                            })
                          }
                        />
                      ),
                    )}
                    <select
                      className={fieldClass}
                      value={peopleForm.role_id}
                      onChange={(e) =>
                        setPeopleForm({
                          ...peopleForm,
                          role_id: Number(e.target.value),
                        })
                      }
                    >
                      {data.roles
                        .filter((role) => role.id !== 1)
                        .map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 text-black text-sm font-bold">
                    <FaPlus /> Create user with role
                  </button>
                </form>
                <form
                  onSubmit={createRole}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                >
                  <h2 className="font-serif text-xl text-white mb-4">
                    <FaPlus className="inline text-gold-400 mr-2" /> Create a
                    role
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      required
                      className={fieldClass}
                      placeholder="Role name"
                      value={roleForm.name}
                      onChange={(e) =>
                        setRoleForm({ ...roleForm, name: e.target.value })
                      }
                    />
                    <label className="inline-flex items-center gap-2 px-3 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={roleForm.active}
                        onChange={(e) =>
                          setRoleForm({ ...roleForm, active: e.target.checked })
                        }
                        className="accent-yellow-500"
                      />{" "}
                      Active
                    </label>
                    <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gold-500 text-black text-sm font-bold">
                      <FaPlus /> Add role
                    </button>
                  </div>
                </form>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="font-serif text-xl text-white mb-4">
                      Managers
                    </h2>
                    {data.managers.map((manager) => (
                      <div
                        key={manager.id}
                        className="flex justify-between py-3 border-b border-slate-800 last:border-0"
                      >
                        <span className="text-gray-300">
                          {manager.user?.name || `User #${manager.user_id}`}
                        </span>
                        <span className="capitalize text-gold-300">
                          {manager.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="font-serif text-xl text-white mb-4">
                      Guests
                    </h2>
                    {data.guests.slice(0, 12).map((guest) => (
                      <div
                        key={guest.id}
                        className="flex justify-between py-3 border-b border-slate-800 last:border-0"
                      >
                        <span className="text-gray-300">
                          {guest.user?.name || `User #${guest.user_id}`}
                        </span>
                        <span className="capitalize text-gold-300">
                          {guest.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Superadmin;
