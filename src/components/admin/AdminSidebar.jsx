/* eslint-disable react/prop-types */
import { useAuth } from "../../context/AuthContext";
import {
  FaHotel, FaChartBar, FaBed, FaLayerGroup, FaUsers, FaUserTie,
  FaUserShield, FaCalendarCheck, FaCreditCard, FaKey, FaShieldAlt,
  FaSignOutAlt, FaChevronLeft, FaChevronRight, FaTachometerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const navItems = [
  { section: "Overview" },
  { id: "dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { id: "reports", label: "Reports & Analytics", icon: FaChartBar },
  { section: "Hotel Management" },
  { id: "rooms", label: "Rooms", icon: FaBed },
  { id: "room-types", label: "Room Types", icon: FaLayerGroup },
  { id: "reservations", label: "Reservations", icon: FaCalendarCheck },
  { id: "payments", label: "Payments", icon: FaCreditCard },
  { section: "People" },
  { id: "guests", label: "Guests", icon: FaUsers },
  { id: "managers", label: "Managers & Staff", icon: FaUserTie },
  { id: "users", label: "System Users", icon: FaUserShield },
  { section: "Access Control" },
  { id: "roles", label: "Roles", icon: FaKey },
  { id: "permissions", label: "Permissions", icon: FaShieldAlt },
];

const AdminSidebar = ({ activeSection, onSelect, collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Sign Out?",
      text: "You will be returned to the main site.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sign Out",
      confirmButtonColor: "#cfa64b",
      cancelButtonColor: "#334155",
      background: "#0f172a",
      color: "#f8fafc",
    });
    if (result.isConfirmed) {
      await logout();
      navigate("/login");
    }
  };

  return (
    <aside
      className={`h-screen bg-slate-950 border-r border-slate-800/80 flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } flex-shrink-0 relative z-20`}
    >
      {/* Brand */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-800/60 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 rounded-full border border-gold-400/50 bg-gold-500/10 flex items-center justify-center text-gold-400 flex-shrink-0">
          <FaHotel className="text-base" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-serif text-sm font-bold text-gold-300 leading-tight tracking-wider">GRAND HOTEL</p>
            <p className="text-[9px] tracking-[0.2em] text-gray-500 uppercase">Admin Console</p>
          </div>
        )}
      </div>

      {/* Admin Profile */}
      {!collapsed && (
        <div className="px-4 py-3 mx-3 mt-3 rounded-xl bg-slate-900/70 border border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gold-500 text-black font-bold text-xs flex items-center justify-center uppercase flex-shrink-0">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || "Administrator"}</p>
              <p className="text-[10px] text-gold-400 uppercase tracking-wider">Super Admin</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2 mt-2">
        {navItems.map((item, idx) => {
          if (item.section) {
            if (collapsed) return null;
            return (
              <p key={idx} className="px-2 pt-4 pb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
                {item.section}
              </p>
            );
          }
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                isActive
                  ? "bg-gold-500/15 text-gold-300 border border-gold-500/30"
                  : "text-gray-400 hover:bg-slate-800/60 hover:text-gray-200"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className={`flex-shrink-0 text-base ${isActive ? "text-gold-400" : "text-gray-500 group-hover:text-gray-300"}`} />
              {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-slate-800/60 space-y-1">
        <button
          onClick={() => navigate("/")}
          title={collapsed ? "Go to Website" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-slate-800/50 hover:text-gray-200 transition text-sm ${collapsed ? "justify-center" : ""}`}
        >
          <FaHotel className="flex-shrink-0 text-gold-500/70" />
          {!collapsed && <span>View Website</span>}
        </button>
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition text-sm ${collapsed ? "justify-center" : ""}`}
        >
          <FaSignOutAlt className="flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-500/50 transition z-30"
      >
        {collapsed ? <FaChevronRight className="text-[10px]" /> : <FaChevronLeft className="text-[10px]" />}
      </button>
    </aside>
  );
};

export default AdminSidebar;
