import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminApi } from "../api/admin";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminOverview from "../components/admin/AdminOverview";
import AdminCRUDPanel from "../components/admin/AdminCRUDPanel";
import Swal from "sweetalert2";
import { FaSync } from "react-icons/fa";

const AdminDashboard = () => {
  const { isSuperAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!isSuperAdmin) { navigate("/"); return; }
  }, [isAuthenticated, isSuperAdmin, navigate]);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
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
        title: "Could not load data",
        text: error.message || "Failed to connect to the server.",
        icon: "error",
        background: "#0f172a",
        color: "#f8fafc",
        confirmButtonColor: "#cfa64b",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isSuperAdmin) loadData();
  }, [isSuperAdmin, loadData]);

  const sectionTitle = {
    dashboard: "Dashboard",
    reports: "Reports & Analytics",
    rooms: "Rooms",
    "room-types": "Room Types",
    reservations: "Reservations",
    payments: "Payments",
    guests: "Guests",
    managers: "Managers & Staff",
    users: "System Users",
    roles: "Roles",
    permissions: "Permissions",
  };

  if (!isAuthenticated || !isSuperAdmin) return null;

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSelect={setActiveSection}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex-shrink-0 h-14 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800/80 flex items-center justify-between px-6 gap-4">
          <div>
            <h1 className="text-sm font-semibold text-white">{sectionTitle[activeSection] || "Admin"}</h1>
            <p className="text-[11px] text-gray-500">Grand Hotel Control Center</p>
          </div>
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-gray-400 hover:text-gold-400 hover:bg-slate-800/60 border border-slate-800 transition"
          >
            <FaSync className={refreshing ? "animate-spin text-gold-500" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeSection === "dashboard" || activeSection === "reports" ? (
            <AdminOverview data={data} loading={loading} />
          ) : (
            <AdminCRUDPanel
              section={activeSection}
              data={data}
              onReload={() => loadData(true)}
              loading={loading}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
