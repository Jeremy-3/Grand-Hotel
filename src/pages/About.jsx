import React from 'react';
import { Link } from 'react-router-dom';
import { FaAward, FaCrown, FaGlassCheers, FaSpa } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-20 border border-slate-800 shadow-luxury">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1470&auto=format&fit=crop"
            alt="Grand Hotel Heritage"
            className="w-full h-[450px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/30" />
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] text-gold-400 font-semibold block">
              Our Story & Heritage
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              A Legacy of Uncompromising Elegance
            </h1>
            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
              Founded on the belief that true hospitality is an art form, Grand Hotel offers an unforgettable escape into architectural grace, culinary mastery, and heartfelt service.
            </p>
          </div>
        </div>

        {/* Narrative Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">
              The Grand Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              Crafted for Discerning Travelers & Connoisseurs
            </h2>
            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
              Located along the scenic Grand Vilas coastline, Grand Hotel combines timeless European architecture with contemporary luxury. Each suite has been thoughtfully styled with marble finishes, king-size bedding, and private balconies overlooking the azure horizons.
            </p>
            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
              From business summits in our state-of-the-art executive boardrooms to relaxed afternoons at the wellness spa, we curate every second of your stay to exceed your highest expectations.
            </p>
            <div className="pt-2">
              <Link
                to="/rooms"
                className="inline-block px-7 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs tracking-wider uppercase transition shadow-md"
              >
                Explore Accommodations
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1470&auto=format&fit=crop"
              alt="Resort Exterior"
              className="rounded-2xl h-56 w-full object-cover border border-slate-800 shadow-md"
            />
            <img
              src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1450&auto=format&fit=crop"
              alt="Suite Interior"
              className="rounded-2xl h-56 w-full object-cover border border-slate-800 shadow-md mt-6"
            />
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <FaCrown className="text-gold-400 text-3xl mx-auto" />
            <h3 className="font-serif text-lg font-bold text-white">Bespoke Suites</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Individually crafted suites with custom artisan furnishings and luxury amenities.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <FaGlassCheers className="text-gold-400 text-3xl mx-auto" />
            <h3 className="font-serif text-lg font-bold text-white">Michelin Dining</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Award-winning culinary creations and sommelier-curated vintage wines.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <FaSpa className="text-gold-400 text-3xl mx-auto" />
            <h3 className="font-serif text-lg font-bold text-white">Wellness & Spa</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Hydrotherapy, deep tissue massages, and thermal pools for complete restoration.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <FaAward className="text-gold-400 text-3xl mx-auto" />
            <h3 className="font-serif text-lg font-bold text-white">5-Star Standards</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Consistently recognized worldwide for flawless service and concierge hospitality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
