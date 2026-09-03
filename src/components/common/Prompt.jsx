import React from 'react';
import { Link } from 'react-router-dom';

const Prompt = ({ isAuthenticated, message = 'Please log in to access this feature and manage your stay.', children }) => {
  if (isAuthenticated) return children || null;

  return (
    <div className="my-6 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-gold-500/30 shadow-luxury text-center max-w-xl mx-auto">
      <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto mb-3 text-gold-400 text-xl">
        ✦
      </div>
      <h3 className="font-serif text-lg font-semibold text-gold-300 mb-1">Exclusive Guest Access</h3>
      <p className="text-sm text-gray-300 mb-4">{message}</p>
      <div className="flex items-center justify-center gap-3">
        <Link
          to="/login"
          className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-sm transition duration-200 shadow-md"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="px-5 py-2 rounded-xl border border-slate-700 hover:border-gold-500/50 text-gray-200 hover:text-white font-medium text-sm transition duration-200"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default Prompt;
