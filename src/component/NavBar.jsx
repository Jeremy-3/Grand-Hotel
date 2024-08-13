import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <a href="#">Grand Hotel</a>
        </div>
        <div className={`flex space-x-4 ${isOpen ? 'block' : 'hidden'} md:flex`}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Rooms</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">About</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Services</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Contact</button>
        </div>
        <div className="md:hidden" onClick={toggleMenu}>
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
