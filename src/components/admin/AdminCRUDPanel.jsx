/* eslint-disable react/prop-types */
import { useState } from "react";
import { adminApi } from "../../api/admin";
import StatusBadge from "../common/StatusBadge";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getRoomImage } from "../../utils/roomImages";
import Swal from "sweetalert2";
import {
  FaPlus, FaEdit, FaCheck, FaTimes, FaSave, FaSearch,
  FaCheckCircle, FaBan, FaSignInAlt, FaSignOutAlt, FaMoneyBillWave,
} from "react-icons/fa";

// ─────────────────────────── HELPERS ────────────────────────────
const fieldCls = "w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/60 placeholder-gray-600";
const labelCls = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1";

const Input = ({ label, ...props }) => (
  <div>
    {label && <label className={labelCls}>{label}</label>}
    <input className={fieldCls} {...props} />
  </div>
);

const Select = ({ label, options = [], ...props }) => (
  <div>
    {label && <label className={labelCls}>{label}</label>}
    <select className={fieldCls} {...props}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

const Textarea = ({ label, rows = 3, ...props }) => (
  <div>
    {label && <label className={labelCls}>{label}</label>}
    <textarea className={fieldCls} rows={rows} {...props} />
  </div>
);

const TH = ({ children }) => (
  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
    {children}
  </th>
);
const TD = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>
);

const ActionBtn = ({ onClick, color = "gold", title, children }) => {
  const colors = {
    gold: "text-gold-400 hover:bg-gold-500/15",
    red: "text-red-400 hover:bg-red-500/15",
    green: "text-emerald-400 hover:bg-emerald-500/15",
    blue: "text-blue-400 hover:bg-blue-500/15",
    amber: "text-amber-400 hover:bg-amber-500/15",
  };
  return (
    <button onClick={onClick} title={title} className={`p-1.5 rounded-lg transition ${colors[color]}`}>
      {children}
    </button>
  );
};

// ─────────────────────────── FORM MODAL ────────────────────────────
const FormModal = ({ title, fields, initialValues = {}, onSave, onClose }) => {
  const [form, setForm] = useState(initialValues);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try { await onSave(form); onClose(); }
    catch (e) {
      Swal.fire({ title: "Error", text: e.message || "Failed to save", icon: "error", background: "#0f172a", color: "#f8fafc", confirmButtonColor: "#cfa64b" });
    }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-luxury overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="font-serif text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition"><FaTimes /></button>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {fields.map((f) => {
            if (f.type === "select") {
              return <Select key={f.key} label={f.label} options={f.options || []} value={form[f.key] ?? ""} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} />;
            }
            if (f.type === "textarea") {
              return <Textarea key={f.key} label={f.label} value={form[f.key] ?? ""} placeholder={f.placeholder} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} />;
            }
            return <Input key={f.key} label={f.label} type={f.type || "text"} value={form[f.key] ?? ""} placeholder={f.placeholder} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} />;
          })}
        </div>
        <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white border border-slate-700 hover:border-slate-600 transition">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-xl text-sm bg-gold-500 hover:bg-gold-400 text-black font-bold flex items-center gap-2 transition disabled:opacity-50">
            <FaSave /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────── SECTION WRAPPER ────────────────────────────
const SectionHeader = ({ title, sub, onAdd, addLabel = "Add New", loading }) => (
  <div className="flex items-start justify-between mb-5 gap-4">
    <div>
      <h2 className="text-xl font-serif font-bold text-white">{title}</h2>
      {sub && <p className="text-sm text-gray-400 mt-0.5">{sub}</p>}
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      {loading && <div className="w-4 h-4 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />}
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-sm transition">
          <FaPlus /> {addLabel}
        </button>
      )}
    </div>
  </div>
);

const TableWrapper = ({ children }) => (
  <div className="rounded-2xl border border-slate-800 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">{children}</table>
    </div>
  </div>
);

const TableHead = ({ cols }) => (
  <thead>
    <tr className="border-b border-slate-800 bg-slate-900/60">
      {cols.map((c) => <TH key={c}>{c}</TH>)}
    </tr>
  </thead>
);

const EmptyRow = ({ cols, message = "No records found" }) => (
  <tr><td colSpan={cols} className="text-center py-10 text-gray-500">{message}</td></tr>
);

// ─────────────────────────── ROOMS ────────────────────────────
const RoomsPanel = ({ data, onReload }) => {
  const [modal, setModal] = useState(null); // null | {mode:'create'|'edit', record?}
  const rooms = data?.rooms || [];
  const roomTypes = data?.roomTypes || [];
  const rtOptions = roomTypes.map((rt) => ({ value: rt.id, label: rt.name }));

  const fields = [
    { key: "room_number", label: "Room Number", placeholder: "e.g. 101" },
    { key: "room_type_id", label: "Room Type", type: "select", options: [{ value: "", label: "Select..." }, ...rtOptions] },
    { key: "room_availability", label: "Availability", type: "select", options: [{ value: "available", label: "Available" }, { value: "occupied", label: "Occupied" }, { value: "maintenance", label: "Maintenance" }] },
    { key: "image", label: "Image URL (optional)", placeholder: "https://..." },
  ];

  const handleSave = async (form) => {
    const payload = { ...form, room_type_id: Number(form.room_type_id) };
    if (modal.mode === "create") await adminApi.createRoom(payload);
    else await adminApi.updateRoom(modal.record.uid, payload);
    await onReload();
  };

  return (
    <div>
      <SectionHeader title="Rooms" sub={`${rooms.length} total rooms`} onAdd={() => setModal({ mode: "create" })} addLabel="Add Room" />
      <TableWrapper>
        <TableHead cols={["Room No.", "Type", "Price/Night", "Availability", "Actions"]} />
        <tbody className="divide-y divide-slate-800/50">
          {rooms.length === 0 ? <EmptyRow cols={5} /> : rooms.map((r) => (
            <tr key={r.id} className="hover:bg-slate-800/20 transition">
              <TD className="font-semibold text-white">
                <div className="flex items-center gap-3">
                  <img src={getRoomImage(r.room_number, r.room_type?.name)} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-700 flex-shrink-0" />
                  Room {r.room_number}
                </div>
              </TD>
              <TD className="text-gray-400">{r.room_type?.name || "—"}</TD>
              <TD className="text-gold-400 font-mono">{formatCurrency(r.room_type?.price_per_night)}</TD>
              <TD><StatusBadge status={r.room_availability} /></TD>
              <TD>
                <ActionBtn onClick={() => setModal({ mode: "edit", record: r })} title="Edit" color="gold"><FaEdit /></ActionBtn>
              </TD>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
      {modal && <FormModal title={modal.mode === "create" ? "Add Room" : "Edit Room"} fields={fields} initialValues={modal.record || { room_availability: "available" }} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
};

// ─────────────────────────── ROOM TYPES ────────────────────────────
const RoomTypesPanel = ({ data, onReload }) => {
  const [modal, setModal] = useState(null);
  const roomTypes = data?.roomTypes || [];

  const fields = [
    { key: "name", label: "Type Name", placeholder: "e.g. Deluxe Suite" },
    { key: "description", label: "Description", type: "textarea", placeholder: "Room description..." },
    { key: "price_per_night", label: "Price per Night (KES)", type: "number", placeholder: "15000" },
    { key: "deposit_percentage", label: "Deposit %", type: "number", placeholder: "30" },
    { key: "amenities", label: "Amenities (comma-separated)", type: "textarea", placeholder: "WiFi, AC, TV, Mini Bar..." },
  ];

  const handleSave = async (form) => {
    const payload = { ...form, price_per_night: Number(form.price_per_night), deposit_percentage: Number(form.deposit_percentage) };
    if (modal.mode === "create") await adminApi.createRoomType(payload);
    else await adminApi.updateRoomType(modal.record.uid, payload);
    await onReload();
  };

  return (
    <div>
      <SectionHeader title="Room Types" sub="Configure suite categories and pricing" onAdd={() => setModal({ mode: "create" })} addLabel="Add Type" />
      <TableWrapper>
        <TableHead cols={["Name", "Price / Night", "Deposit %", "Amenities", "Actions"]} />
        <tbody className="divide-y divide-slate-800/50">
          {roomTypes.length === 0 ? <EmptyRow cols={5} /> : roomTypes.map((rt) => (
            <tr key={rt.id} className="hover:bg-slate-800/20 transition">
              <TD className="font-semibold text-white">{rt.name}</TD>
              <TD className="text-gold-400 font-mono">{formatCurrency(rt.price_per_night)}</TD>
              <TD className="text-gray-400">{rt.deposit_percentage ?? "—"}%</TD>
              <TD className="text-gray-400 max-w-xs truncate text-xs">{rt.amenities || "—"}</TD>
              <TD>
                <ActionBtn onClick={() => setModal({ mode: "edit", record: rt })} title="Edit" color="gold"><FaEdit /></ActionBtn>
              </TD>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
      {modal && <FormModal title={modal.mode === "create" ? "Add Room Type" : "Edit Room Type"} fields={fields} initialValues={modal.record || {}} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
};

// ─────────────────────────── RESERVATIONS ────────────────────────────
const ReservationsPanel = ({ data, onReload }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const reservations = data?.reservations || [];

  const filtered = reservations.filter((r) => {
    const matchStatus = filter === "all" || r.status === filter;
    const guestName = r.guest?.user?.name || r.guest?.name || "";
    const roomNo = String(r.room?.room_number || r.room_id || "");
    const matchSearch = !search || guestName.toLowerCase().includes(search.toLowerCase()) || roomNo.includes(search);
    return matchStatus && matchSearch;
  });

  const handleAction = async (res, action) => {
    const labels = { confirm: "Confirm", "check-in": "Check In", "check-out": "Check Out", cancel: "Cancel" };
    const apiFn = {
      confirm: () => adminApi.confirmReservation(res.uid),
      "check-in": () => adminApi.checkInReservation(res.uid),
      "check-out": () => adminApi.checkOutReservation(res.uid),
      cancel: () => adminApi.cancelReservation(res.uid),
    };
    const result = await Swal.fire({
      title: `${labels[action]} Reservation #${res.id}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: labels[action],
      confirmButtonColor: action === "cancel" ? "#ef4444" : "#cfa64b",
      background: "#0f172a", color: "#f8fafc",
    });
    if (result.isConfirmed) {
      try { await apiFn[action](); await onReload(); }
      catch (e) { Swal.fire({ title: "Error", text: e.message, icon: "error", background: "#0f172a", color: "#f8fafc", confirmButtonColor: "#cfa64b" }); }
    }
  };

  return (
    <div>
      <SectionHeader title="Reservations" sub={`${reservations.length} total — ${filtered.length} shown`} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search guest or room..." className={`${fieldCls} pl-8`} />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${fieldCls} max-w-[180px]`}>
          {["all","pending","confirmed","checked_in","checked_out","cancelled"].map((s) => (
            <option key={s} value={s}>{s === "all" ? "All Statuses" : s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      <TableWrapper>
        <TableHead cols={["Res #", "Guest", "Room", "Dates", "Amount", "Status", "Actions"]} />
        <tbody className="divide-y divide-slate-800/50">
          {filtered.length === 0 ? <EmptyRow cols={7} /> : filtered.map((res) => (
            <tr key={res.id} className="hover:bg-slate-800/20 transition">
              <TD className="text-gray-500 font-mono text-xs">#{res.id}</TD>
              <TD className="text-white font-medium">{res.guest?.user?.name || res.guest?.name || `Guest #${res.guest_id}`}</TD>
              <TD className="text-gray-400">Room {res.room?.room_number || res.room_id}</TD>
              <TD className="text-gray-400 text-xs whitespace-nowrap">{formatDate(res.check_in_date)} → {formatDate(res.check_out_date)}</TD>
              <TD className="text-gold-400 font-mono">{formatCurrency(res.total_amount)}</TD>
              <TD><StatusBadge status={res.status} /></TD>
              <TD>
                <div className="flex items-center gap-1">
                  {res.status === "pending" && <ActionBtn onClick={() => handleAction(res, "confirm")} title="Confirm" color="green"><FaCheckCircle /></ActionBtn>}
                  {res.status === "confirmed" && <ActionBtn onClick={() => handleAction(res, "check-in")} title="Check In" color="blue"><FaSignInAlt /></ActionBtn>}
                  {res.status === "checked_in" && <ActionBtn onClick={() => handleAction(res, "check-out")} title="Check Out" color="gold"><FaSignOutAlt /></ActionBtn>}
                  {["pending","confirmed"].includes(res.status) && <ActionBtn onClick={() => handleAction(res, "cancel")} title="Cancel" color="red"><FaBan /></ActionBtn>}
                </div>
              </TD>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
    </div>
  );
};

// ─────────────────────────── PAYMENTS ────────────────────────────
const PaymentsPanel = ({ data, onReload }) => {
  const reservations = data?.reservations || [];
  const allPayments = reservations.flatMap((r) =>
    (r.payments || []).map((p) => ({ ...p, reservation: r }))
  ).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  const handleRefund = async (payment) => {
    const result = await Swal.fire({
      title: "Refund Payment?",
      text: `Refund ${formatCurrency(payment.amount)} to guest?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Refund",
      confirmButtonColor: "#ef4444",
      background: "#0f172a", color: "#f8fafc",
    });
    if (result.isConfirmed) {
      try { await adminApi.refundPayment(payment.uid); await onReload(); }
      catch (e) { Swal.fire({ title: "Error", text: e.message, icon: "error", background: "#0f172a", color: "#f8fafc", confirmButtonColor: "#cfa64b" }); }
    }
  };

  return (
    <div>
      <SectionHeader title="Payments" sub={`${allPayments.length} payment records`} />
      <TableWrapper>
        <TableHead cols={["Res #", "Guest", "Amount", "Method", "Type", "Status", "Actions"]} />
        <tbody className="divide-y divide-slate-800/50">
          {allPayments.length === 0 ? <EmptyRow cols={7} /> : allPayments.map((p) => (
            <tr key={p.uid || p.id} className="hover:bg-slate-800/20 transition">
              <TD className="text-gray-500 font-mono text-xs">#{p.reservation?.id}</TD>
              <TD className="text-white font-medium">{p.reservation?.guest?.user?.name || p.reservation?.guest?.name || "—"}</TD>
              <TD className="text-gold-400 font-mono">{formatCurrency(p.amount)}</TD>
              <TD className="text-gray-400 capitalize">{p.payment_method || "—"}</TD>
              <TD className="text-gray-400 capitalize">{(p.payment_type || "—").replace("_", " ")}</TD>
              <TD><StatusBadge status={p.payment_status} /></TD>
              <TD>
                {p.payment_status === "confirmed" && (
                  <ActionBtn onClick={() => handleRefund(p)} title="Refund" color="red"><FaMoneyBillWave /></ActionBtn>
                )}
              </TD>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
    </div>
  );
};

// ─────────────────────────── GUESTS ────────────────────────────
const GuestsPanel = ({ data, onReload }) => {
  const guests = data?.guests || [];
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);

  const filtered = guests.filter((g) => {
    const name = g.user?.name || g.name || "";
    const email = g.user?.email || g.email || "";
    return !search || name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase());
  });

  const fields = [
    { key: "name", label: "Full Name", placeholder: "Jane Doe" },
    { key: "email", label: "Email", type: "email", placeholder: "jane@example.com" },
    { key: "phone_number", label: "Phone Number", placeholder: "+254700000000" },
    { key: "password", label: "Password (for new accounts)", type: "password", placeholder: "Min 8 chars" },
    { key: "id_number", label: "ID / Passport Number", placeholder: "12345678" },
  ];

  const handleSave = async (form) => {
    if (modal.mode === "create") {
      await adminApi.registerGuest(form);
    } else {
      await adminApi.updateGuest(modal.record.uid, form);
    }
    await onReload();
  };

  return (
    <div>
      <SectionHeader title="Guests" sub={`${guests.length} registered guests`} onAdd={() => setModal({ mode: "create" })} addLabel="Register Guest" />
      <div className="mb-5 relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search guests..." className={`${fieldCls} pl-8`} />
      </div>
      <TableWrapper>
        <TableHead cols={["Name", "Email", "Phone", "ID Number", "Reservations", "Actions"]} />
        <tbody className="divide-y divide-slate-800/50">
          {filtered.length === 0 ? <EmptyRow cols={6} /> : filtered.map((g) => (
            <tr key={g.id} className="hover:bg-slate-800/20 transition">
              <TD className="text-white font-medium">{g.user?.name || g.name || "—"}</TD>
              <TD className="text-gray-400 text-xs">{g.user?.email || g.email || "—"}</TD>
              <TD className="text-gray-400 text-xs">{g.user?.phone_number || g.phone_number || "—"}</TD>
              <TD className="text-gray-400 text-xs">{g.id_number || "—"}</TD>
              <TD className="text-gray-400">{g.reservations?.length ?? 0}</TD>
              <TD>
                <ActionBtn onClick={() => setModal({ mode: "edit", record: { ...g, name: g.user?.name || g.name, email: g.user?.email || g.email, phone_number: g.user?.phone_number || g.phone_number } })} title="Edit" color="gold"><FaEdit /></ActionBtn>
              </TD>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
      {modal && <FormModal title={modal.mode === "create" ? "Register Guest" : "Edit Guest"} fields={fields} initialValues={modal.record || {}} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
};

// ─────────────────────────── MANAGERS ────────────────────────────
const ManagersPanel = ({ data, onReload }) => {
  const managers = data?.managers || [];
  const [modal, setModal] = useState(null);

  const fields = [
    { key: "name", label: "Full Name", placeholder: "John Smith" },
    { key: "email", label: "Email", type: "email", placeholder: "manager@grandhotel.com" },
    { key: "phone_number", label: "Phone", placeholder: "+254700000000" },
    { key: "password", label: "Password", type: "password", placeholder: "Manager@123" },
    { key: "department", label: "Department", placeholder: "Front Desk, Housekeeping..." },
  ];

  const handleSave = async (form) => {
    if (modal.mode === "create") {
      const payload = { ...form, role_id: 2 };
      await adminApi.createManager(payload);
    } else {
      await adminApi.updateManager(modal.record.uid, form);
    }
    await onReload();
  };

  return (
    <div>
      <SectionHeader title="Managers & Staff" sub={`${managers.length} staff members`} onAdd={() => setModal({ mode: "create" })} addLabel="Add Manager" />
      <TableWrapper>
        <TableHead cols={["Name", "Email", "Phone", "Department", "Active", "Actions"]} />
        <tbody className="divide-y divide-slate-800/50">
          {managers.length === 0 ? <EmptyRow cols={6} /> : managers.map((m) => (
            <tr key={m.id} className="hover:bg-slate-800/20 transition">
              <TD className="text-white font-medium">{m.user?.name || m.name || "—"}</TD>
              <TD className="text-gray-400 text-xs">{m.user?.email || m.email || "—"}</TD>
              <TD className="text-gray-400 text-xs">{m.user?.phone_number || m.phone_number || "—"}</TD>
              <TD className="text-gray-400 text-xs">{m.department || "—"}</TD>
              <TD>{m.user?.active !== false ? <span className="text-emerald-400 text-xs font-semibold">Active</span> : <span className="text-red-400 text-xs">Inactive</span>}</TD>
              <TD>
                <ActionBtn onClick={() => setModal({ mode: "edit", record: { ...m, name: m.user?.name || m.name, email: m.user?.email || m.email, phone_number: m.user?.phone_number || m.phone_number } })} title="Edit" color="gold"><FaEdit /></ActionBtn>
              </TD>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
      {modal && <FormModal title={modal.mode === "create" ? "Add Manager" : "Edit Manager"} fields={fields} initialValues={modal.record || { password: "Manager@123" }} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
};

// ─────────────────────────── USERS ────────────────────────────
const UsersPanel = ({ data, onReload }) => {
  const users = data?.users || [];
  const roles = data?.roles || [];
  const [modal, setModal] = useState(null);

  const roleOptions = [{ value: "", label: "Select Role..." }, ...roles.map((r) => ({ value: r.id, label: r.name }))];

  const fields = [
    { key: "name", label: "Full Name", placeholder: "Jane Doe" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone_number", label: "Phone" },
    { key: "password", label: "Password", type: "password", placeholder: "Min 8 chars" },
    { key: "role_id", label: "Role", type: "select", options: roleOptions },
  ];

  const handleSave = async (form) => {
    const payload = { ...form, role_id: Number(form.role_id) };
    if (modal.mode === "create") await adminApi.createUser(payload);
    else await adminApi.updateUser(modal.record.uid, payload);
    await onReload();
  };

  return (
    <div>
      <SectionHeader title="System Users" sub={`${users.length} total users`} onAdd={() => setModal({ mode: "create" })} addLabel="Create User" />
      <TableWrapper>
        <TableHead cols={["Name", "Email", "Phone", "Role", "Active", "Actions"]} />
        <tbody className="divide-y divide-slate-800/50">
          {users.length === 0 ? <EmptyRow cols={6} /> : users.map((u) => (
            <tr key={u.id} className="hover:bg-slate-800/20 transition">
              <TD className="text-white font-medium">{u.name}</TD>
              <TD className="text-gray-400 text-xs">{u.email}</TD>
              <TD className="text-gray-400 text-xs">{u.phone_number || "—"}</TD>
              <TD><span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-gray-300 border border-slate-700">{u.role?.name || "—"}</span></TD>
              <TD>{u.active !== false ? <FaCheck className="text-emerald-400" /> : <FaTimes className="text-red-400" />}</TD>
              <TD>
                <ActionBtn onClick={() => setModal({ mode: "edit", record: u })} title="Edit" color="gold"><FaEdit /></ActionBtn>
              </TD>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
      {modal && <FormModal title={modal.mode === "create" ? "Create User" : "Edit User"} fields={fields} initialValues={modal.record || {}} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
};

// ─────────────────────────── ROLES ────────────────────────────
const RolesPanel = ({ data, onReload }) => {
  const roles = data?.roles || [];
  const permissions = data?.permissions || [];
  const [modal, setModal] = useState(null);
  const [permModal, setPermModal] = useState(null);
  const [rolePerms, setRolePerms] = useState([]);
  const [loadingPerms, setLoadingPerms] = useState(false);

  const openPermissions = async (role) => {
    setLoadingPerms(true);
    setPermModal({ role, saving: false });
    try {
      const res = await adminApi.getRolePermissions(role.id);
      setRolePerms((res.data || []).map((rp) => rp.permission_id || rp.id));
    } catch { setRolePerms([]); }
    finally { setLoadingPerms(false); }
  };

  const handleTogglePerm = async (permId) => {
    const hasIt = rolePerms.includes(permId);
    try {
      if (hasIt) {
        await adminApi.deassignPermissions({ role_id: permModal.role.id, permission_ids: [permId] });
        setRolePerms((p) => p.filter((id) => id !== permId));
      } else {
        await adminApi.assignPermissions({ role_id: permModal.role.id, permission_ids: [permId] });
        setRolePerms((p) => [...p, permId]);
      }
    } catch (e) {
      Swal.fire({ title: "Error", text: e.message, icon: "error", background: "#0f172a", color: "#f8fafc", confirmButtonColor: "#cfa64b" });
    }
  };

  const handleSave = async (form) => {
    if (modal.mode === "create") await adminApi.createRole(form);
    else await adminApi.updateRole(modal.record.uid, form);
    await onReload();
  };

  return (
    <div>
      <SectionHeader title="Roles" sub={`${roles.length} roles`} onAdd={() => setModal({ mode: "create" })} addLabel="Add Role" />
      <TableWrapper>
        <TableHead cols={["Role Name", "Active", "Permissions", "Actions"]} />
        <tbody className="divide-y divide-slate-800/50">
          {roles.length === 0 ? <EmptyRow cols={4} /> : roles.map((r) => (
            <tr key={r.id} className="hover:bg-slate-800/20 transition">
              <TD className="text-white font-semibold">{r.name}</TD>
              <TD>{r.active !== false ? <FaCheck className="text-emerald-400" /> : <FaTimes className="text-red-400" />}</TD>
              <TD>
                <button onClick={() => openPermissions(r)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition">
                  <FaShieldAlt /> Manage Permissions
                </button>
              </TD>
              <TD>
                <ActionBtn onClick={() => setModal({ mode: "edit", record: r })} title="Edit" color="gold"><FaEdit /></ActionBtn>
              </TD>
            </tr>
          ))}
        </tbody>
      </TableWrapper>

      {modal && (
        <FormModal
          title={modal.mode === "create" ? "Add Role" : "Edit Role"}
          fields={[{ key: "name", label: "Role Name", placeholder: "e.g. Staff" }, { key: "active", label: "Active", type: "select", options: [{ value: true, label: "Active" }, { value: false, label: "Inactive" }] }]}
          initialValues={modal.record || { active: true }}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {permModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-luxury overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Permissions — {permModal.role.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Toggle permissions for this role</p>
              </div>
              <button onClick={() => setPermModal(null)} className="text-gray-500 hover:text-white transition"><FaTimes /></button>
            </div>
            <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
              {loadingPerms ? (
                <div className="text-center py-6"><div className="w-6 h-6 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" /></div>
              ) : (
                <div className="space-y-2">
                  {permissions.map((perm) => {
                    const active = rolePerms.includes(perm.id);
                    return (
                      <button key={perm.id} onClick={() => handleTogglePerm(perm.id)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition text-sm ${active ? "bg-gold-500/10 border-gold-500/30 text-gold-300" : "bg-slate-800/40 border-slate-700/50 text-gray-400 hover:border-slate-600"}`}
                      >
                        <span className="font-mono text-xs">{perm.name}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${active ? "bg-gold-500 border-gold-500" : "border-slate-600"}`}>
                          {active && <FaCheck className="text-[8px] text-black" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-800">
              <button onClick={() => setPermModal(null)} className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-sm transition">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────── PERMISSIONS ────────────────────────────
const PermissionsPanel = ({ data, onReload }) => {
  const permissions = data?.permissions || [];
  const [modal, setModal] = useState(null);

  const fields = [
    { key: "name", label: "Permission Key", placeholder: "e.g. room.create" },
    { key: "description", label: "Description", type: "textarea", placeholder: "Allows creating new rooms" },
  ];

  const handleSave = async (form) => {
    if (modal.mode === "create") await adminApi.createPermission(form);
    else await adminApi.updatePermission(modal.record.uid, form);
    await onReload();
  };

  return (
    <div>
      <SectionHeader title="Permissions" sub={`${permissions.length} system permissions`} onAdd={() => setModal({ mode: "create" })} addLabel="Add Permission" />
      <TableWrapper>
        <TableHead cols={["Permission Key", "Description", "Actions"]} />
        <tbody className="divide-y divide-slate-800/50">
          {permissions.length === 0 ? <EmptyRow cols={3} /> : permissions.map((p) => (
            <tr key={p.id} className="hover:bg-slate-800/20 transition">
              <TD className="font-mono text-gold-400 text-xs">{p.name}</TD>
              <TD className="text-gray-400 text-xs">{p.description || "—"}</TD>
              <TD>
                <ActionBtn onClick={() => setModal({ mode: "edit", record: p })} title="Edit" color="gold"><FaEdit /></ActionBtn>
              </TD>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
      {modal && <FormModal title={modal.mode === "create" ? "Add Permission" : "Edit Permission"} fields={fields} initialValues={modal.record || {}} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
};

// ─────────────────────────── MAIN EXPORT ────────────────────────────
const AdminCRUDPanel = ({ section, data, onReload, loading }) => {
  const panels = {
    rooms: <RoomsPanel data={data} onReload={onReload} />,
    "room-types": <RoomTypesPanel data={data} onReload={onReload} />,
    reservations: <ReservationsPanel data={data} onReload={onReload} />,
    payments: <PaymentsPanel data={data} onReload={onReload} />,
    guests: <GuestsPanel data={data} onReload={onReload} />,
    managers: <ManagersPanel data={data} onReload={onReload} />,
    users: <UsersPanel data={data} onReload={onReload} />,
    roles: <RolesPanel data={data} onReload={onReload} />,
    permissions: <PermissionsPanel data={data} onReload={onReload} />,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return panels[section] || (
    <div className="flex items-center justify-center h-48 text-gray-500 text-sm">Select a section from the sidebar.</div>
  );
};

export default AdminCRUDPanel;
