import React from 'react';
import { NavLink } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

function Footer() {
  return (
    <footer className="bg-black p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-white text-lg font-bold">
          Grand Hotel
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <NavLink to="/rooms" className="text-white hover:text-gray-400" activeClassName="text-gray-400">Rooms</NavLink>
          <NavLink to="/about" className="text-white hover:text-gray-400" activeClassName="text-gray-400">About</NavLink>
          <NavLink to="/services" className="text-white hover:text-gray-400" activeClassName="text-gray-400">Services</NavLink>
          <NavLink to="/contact" className="text-white hover:text-gray-400" activeClassName="text-gray-400">Contact</NavLink>
        </div>
        <div className="text-white mt-4 md:mt-0">
          © 2024 Grand Hotel. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
