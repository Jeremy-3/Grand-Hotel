import React from 'react';
import ImageScroller from './ImageScroller';
import { FaUtensils, FaWineGlassAlt, FaLeaf } from 'react-icons/fa';

const CuisinesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
            Gastronomy & Lounges
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Exceptional Cuisines in Sublime Spaces
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            Culinary art is at the heart of the Grand Hotel experience. From morning artisan patisseries to twilight degustation dinners, every dish is crafted with locally-sourced organic ingredients and boundless passion.
          </p>
        </div>

        {/* Feature Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-20 shadow-luxury">
          <div className="lg:col-span-6 overflow-hidden rounded-2xl border border-slate-700/60 group">
            <img
              src="https://plus.unsplash.com/premium_photo-1661962950572-61c3b7b4d5ba?q=80&w=1569&auto=format&fit=crop"
              alt="Gourmet Dining Experience"
              className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gold-300">
              The Grand Terrace & Sommelier Cellar
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Step into an intimate ambiance where our award-winning executive chefs combine authentic continental gastronomy with modern culinary innovation. Relax under ambient chandeliers and let our sommelier pair your evening with rare vintage wines.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="text-center p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <FaUtensils className="text-gold-400 mx-auto mb-1.5 text-lg" />
                <span className="text-xs font-semibold text-white block">Michelin Star</span>
                <span className="text-[10px] text-gray-400">Head Chef</span>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <FaWineGlassAlt className="text-gold-400 mx-auto mb-1.5 text-lg" />
                <span className="text-xs font-semibold text-white block">500+ Labels</span>
                <span className="text-[10px] text-gray-400">Vintage Cellar</span>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <FaLeaf className="text-gold-400 mx-auto mb-1.5 text-lg" />
                <span className="text-xs font-semibold text-white block">Farm-to-Table</span>
                <span className="text-[10px] text-gray-400">Fresh Produce</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Carousel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">Culinary Gallery</h3>
              <p className="text-xs text-gray-400">Scroll to explore our dining spaces & signature creations</p>
            </div>
          </div>
          <ImageScroller />
        </div>
      </div>
    </section>
  );
};

export default CuisinesSection;
