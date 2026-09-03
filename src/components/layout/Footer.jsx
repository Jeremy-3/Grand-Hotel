import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaTripadvisor, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaHotel } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-gray-400 border-t border-slate-800/80 pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-gold-400/50 bg-gold-500/10 flex items-center justify-center text-gold-400">
                <FaHotel />
              </div>
              <span className="font-serif text-xl font-bold tracking-widest text-gold-300">
                GRAND HOTEL
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Where luxury meets architectural perfection. Experience bespoke hospitality, Michelin-inspired dining, and serene coastal views in every stay.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-500/40 transition"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-500/40 transition"
              >
                <FaInstagram size={14} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-500/40 transition"
              >
                <FaTwitter size={14} />
              </a>
              <a
                href="https://tripadvisor.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-500/40 transition"
              >
                <FaTripadvisor size={14} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/rooms" className="hover:text-gold-300 transition">
                  Luxury Rooms & Suites
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="hover:text-gold-300 transition">
                  Book A Reservation
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-300 transition">
                  Heritage & Story
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-gold-300 transition">
                  Guest Reviews & Ratings
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Concierge Desk
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-gold-400 mt-1 flex-shrink-0" />
                <span>Roshet Along Grand Vilas, Coastal Boulevard, Suite 100</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-gold-400 flex-shrink-0" />
                <span>+254 700 000 000 / +254 711 000 000</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-gold-400 flex-shrink-0" />
                <span>reservations@grandhotel.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Privilege Club
            </h4>
            <p className="text-sm text-gray-400 mb-3">
              Subscribe for exclusive seasonal offers, culinary invites, and suite upgrades.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-500/50"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-gold-500 hover:bg-gold-400 text-black font-semibold rounded-xl text-sm transition duration-200"
              >
                Join Privilege Club
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Grand Hotel International. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-400 cursor-pointer">Booking Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
