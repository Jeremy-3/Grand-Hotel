import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "tailwindcss/tailwind.css";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-gray-900 p-4 fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">Grand Hotel</div>
        
        {/* Main navigation items */}
        <div className="hidden md:flex space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) => 
              `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "text-white hover:bg-gray-700"}`
            }
            onClick={closeMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => 
              `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "text-white hover:bg-gray-700"}`
            }
            onClick={closeMenu}
          >
            About
          </NavLink>
          
          
          <div className="relative">
            <button
              className="px-4 py-2 text-white hover:bg-gray-700 rounded"
              onClick={toggleDropdown}
            >
              More
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg">
                <NavLink
                  to="/feedback"
                  className="block px-4 py-2 text-white hover:bg-gray-700"
                  onClick={closeMenu}
                >
                  Feedback
                </NavLink>
                <NavLink
                  to="/login"
                  className="block px-4 py-2 text-white hover:bg-gray-700"
                  onClick={closeMenu}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="block px-4 py-2 text-white hover:bg-gray-700"
                  onClick={closeMenu}
                >
                  Register
                </NavLink>
                <NavLink
                  to="/reservations"
                  className="block px-4 py-2 text-white hover:bg-gray-700"
                  onClick={closeMenu}
                >
                  Reservations
                </NavLink>
                <NavLink
                  to="/guests"
                  className="block px-4 py-2 text-white hover:bg-gray-700"
                  onClick={closeMenu}
                >
                  Guests
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu" aria-expanded={isOpen} aria-controls="mobile-menu">
          <div className="space-y-1">
            <span className="block w-8 h-1 bg-white"></span>
            <span className="block w-8 h-1 bg-white"></span>
            <span className="block w-8 h-1 bg-white"></span>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`} id="mobile-menu">
        <div className="flex flex-col space-y-2 p-4 bg-gray-800">
          <NavLink
            to="/"
            className={({ isActive }) => 
              `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "text-white hover:bg-gray-700"}`
            }
            onClick={closeMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => 
              `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "text-white hover:bg-gray-700"}`
            }
            onClick={closeMenu}
          >
            About
          </NavLink>
          <NavLink
            to="/feedback"
            className={({ isActive }) => 
              `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "text-white hover:bg-gray-700"}`
            }
            onClick={closeMenu}
          >
            Feedback
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) => 
              `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "text-white hover:bg-gray-700"}`
            }
            onClick={closeMenu}
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) => 
              `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "text-white hover:bg-gray-700"}`
            }
            onClick={closeMenu}
          >
            Register
          </NavLink>
          <NavLink
            to="/reservations"
            className={({ isActive }) => 
              `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "text-white hover:bg-gray-700"}`
            }
            onClick={closeMenu}
          >
            Reservations
          </NavLink>
          <NavLink
            to="/guests"
            className={({ isActive }) => 
              `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "text-white hover:bg-gray-700"}`
            }
            onClick={closeMenu}
          >
            Guests
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
