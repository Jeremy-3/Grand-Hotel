import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaConciergeBell,
  FaHotel,
  FaCog,
} from "react-icons/fa";

const Navbar = () => {
  const {
    user,
    isAuthenticated,
    isStaffOrManager,
    isSuperAdmin,
    role,
    logout,
  } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setIsOpen(false);
    await logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium tracking-wider uppercase transition-colors duration-200 ${
      isActive
        ? "text-gold-400 border-b-2 border-gold-400 pb-1"
        : "text-gray-300 hover:text-gold-300 hover:border-b-2 hover:border-gold-500/50 pb-1"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-md shadow-lg border-b border-slate-800/80 py-3"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border border-gold-400/50 bg-gold-500/10 flex items-center justify-center text-gold-400 group-hover:scale-105 transition duration-200">
            <FaHotel className="text-lg" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-widest text-gold-300 block leading-tight">
              GRAND HOTEL
            </span>
            <span className="text-[10px] tracking-[0.25em] text-gray-400 block uppercase">
              Luxury Resort & Spa
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/rooms" className={navLinkClass}>
            Rooms & Suites
          </NavLink>
          <NavLink to="/reservations" className={navLinkClass}>
            Reservations
          </NavLink>
          {!isStaffOrManager && (
            <>
              <NavLink to="/about" className={navLinkClass}>
                About Us
              </NavLink>
              <NavLink to="/feedback" className={navLinkClass}>
                Feedback
              </NavLink>
            </>
          )}

          {isStaffOrManager && !isSuperAdmin && (
            <NavLink to="/guests" className={navLinkClass}>
              Guest Directory
            </NavLink>
          )}
          {isSuperAdmin && (
            <NavLink to="/admin" className={({ isActive }) =>
              `text-sm font-medium tracking-wider uppercase transition-colors duration-200 ${
                isActive
                  ? "text-gold-400 border-b-2 border-gold-400 pb-1"
                  : "text-gold-400/70 hover:text-gold-300 hover:border-b-2 hover:border-gold-500/50 pb-1"
              }`
            }>
              Admin Dashboard
            </NavLink>
          )}
        </nav>

        {/* User Auth Buttons / Profile Menu */}
        <div className="hidden lg:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-3.5 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-gold-500/30 transition duration-200"
              >
                <div className="w-7 h-7 rounded-full bg-gold-500 text-black font-bold text-xs flex items-center justify-center uppercase">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-gray-200 truncate max-w-[100px]">
                    {user?.name}
                  </div>
                  <div className="text-[10px] text-gold-400 uppercase tracking-wider">
                    {role}
                  </div>
                </div>
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-gold-500/30 rounded-2xl shadow-luxury py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/reservations"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-gold-300 hover:bg-slate-800 transition"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaConciergeBell className="text-gold-400" /> My
                    Reservations
                  </Link>

                  {isStaffOrManager && (
                    <Link
                      to="/guests"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-gold-300 hover:bg-slate-800 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaUserCircle className="text-gold-400" /> Guest
                      Management
                    </Link>
                  )}

                  {isSuperAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-gold-300 hover:bg-slate-800 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaCog className="text-gold-400" /> Control Center
                    </Link>
                  )}

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-slate-800 transition"
                  >
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-200 hover:text-gold-300 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-sm transition duration-200 shadow-md"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 backdrop-blur-lg px-6 py-6 space-y-4 animate-fadeIn">
          {isAuthenticated && (
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-black font-bold text-sm flex items-center justify-center uppercase">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{user?.name}</div>
                <div className="text-xs text-gold-400">
                  {user?.email} ({role})
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-3">
            <NavLink
              to="/"
              className={navLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/rooms"
              className={navLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Rooms & Suites
            </NavLink>
            <NavLink
              to="/reservations"
              className={navLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Reservations
            </NavLink>
            {!isStaffOrManager && (
              <>
                <NavLink
                  to="/about"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </NavLink>
                <NavLink
                  to="/feedback"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Feedback
                </NavLink>
              </>
            )}
            {isStaffOrManager && (
              <NavLink
                to="/guests"
                className={navLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Guest Directory
              </NavLink>
            )}
            {isSuperAdmin && (
              <NavLink
                to="/admin"
                className={navLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Control Center
              </NavLink>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 text-sm font-medium hover:bg-rose-500/20 transition"
              >
                Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 text-center rounded-xl border border-slate-700 text-gray-200 text-sm font-medium hover:bg-slate-800 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-gold-500 text-black text-sm font-semibold hover:bg-gold-400 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
