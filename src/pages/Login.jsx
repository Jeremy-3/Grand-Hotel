import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaHotel } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    }
  };

  const autofillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4 relative bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1471&auto=format&fit=crop')`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-slate-900/90 border border-gold-500/30 rounded-3xl p-8 shadow-luxury z-10 backdrop-blur-xl">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-full border border-gold-400/50 bg-gold-500/10 flex items-center justify-center text-gold-400 mx-auto">
            <FaHotel className="text-xl" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Sign In to Grand Hotel
          </h2>
          <p className="text-xs text-gray-400">
            Access your reservations, suites, and concierge services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/60 transition"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/60 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-black font-bold text-sm tracking-wider uppercase transition duration-200 shadow-luxury ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'
            }`}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Quick-Fill */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-[11px] text-gray-400 text-center uppercase tracking-wider font-semibold mb-3">
            Quick Demo Autofill
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => autofillDemo('john.kamau@example.com', 'Guest@123')}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-gray-300 text-center transition"
            >
              <strong className="text-gold-300 block">Guest</strong>
              john.kamau@example.com
            </button>
            <button
              type="button"
              onClick={() => autofillDemo('david.mwangi@grandhotel.com', 'Manager@123')}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-gray-300 text-center transition"
            >
              <strong className="text-gold-300 block">Manager</strong>
              david.mwangi@grandhotel.com
            </button>
          </div>
        </div>

        {/* Register footer link */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Don't have a Grand Hotel account?{' '}
          <Link to="/register" className="text-gold-400 hover:underline font-semibold">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
