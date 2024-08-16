import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "tailwindcss/tailwind.css";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-black p-4 fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">Grand Hotel</div>
        <div
          className={`flex space-x-4 ${isOpen ? "block" : "hidden"} md:flex`}
        >
          <NavLink
            to="/"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            ClassName="bg-blue-700"
            onClick={closeMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            ClassName="bg-blue-700"
            onClick={closeMenu}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            ClassName="bg-blue-700"
            onClick={closeMenu}
          >
            Contact
          </NavLink>
          <NavLink
            to="/feedback"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            ClassName="bg-blue-700"
            onClick={closeMenu}
          >
            Feedback
          </NavLink>
        </div>
        <div
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className="space-y-1">
            <span className="block w-8 h-1 bg-white"></span>
            <span className="block w-8 h-1 bg-white"></span>
            <span className="block w-8 h-1 bg-white"></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
