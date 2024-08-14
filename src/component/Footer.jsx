import React from 'react'

function Footer() {
  return (
    <footer className="bg-black p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-white text-lg font-bold">
          Grand Hotel
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-white hover:text-gray-400">Rooms</a>
          <a href="#" className="text-white hover:text-gray-400">About</a>
          <a href="#" className="text-white hover:text-gray-400">Services</a>
          <a href="#" className="text-white hover:text-gray-400">Contact</a>
        </div>
        <div className="text-white mt-4 md:mt-0">
          © 2024 Grand Hotel. All copyrights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer