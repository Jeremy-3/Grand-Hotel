import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3',
    title: 'An Oasis of Architectural Grandeur',
    subtitle: 'WINE & DINE IN TIMELESS LUXURY',
    description: 'Immerse yourself in world-class hospitality, lavish private suites, and panoramic ocean vistas designed for unforgettable moments.',
  },
  {
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3',
    title: 'Bespoke Comfort & Master Suites',
    subtitle: 'REDEFINING CONTEMPORARY ELEGANCE',
    description: 'Each room is a masterpiece of fine craftsmanship, offering plush king beds, marble baths, and tailored concierge care.',
  },
  {
    image: 'https://images.unsplash.com/photo-1462539405390-d0bdb635c7d1?q=80&w=1520&auto=format&fit=crop&ixlib=rb-4.0.3',
    title: 'World-Class Gastronomic Escapes',
    subtitle: 'MICHELIN-INSPIRED CULINARY DELIGHTS',
    description: 'Savor organic seasonal pairings and signature cocktails curated by master sommeliers in atmospheric rooftop lounges.',
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-screen min-h-[650px] w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transition: 'opacity 1s ease-in-out, transform 8s ease' }}
        >
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/40" />

          {/* Slide Content */}
          <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
            <div className="max-w-3xl space-y-6 pt-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-semibold uppercase tracking-[0.2em] animate-fadeIn">
                <span>✦</span> {slide.subtitle} <span>✦</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-none drop-shadow-md">
                {slide.title}
              </h1>

              <p className="text-base sm:text-lg text-gray-300 font-light leading-relaxed max-w-2xl mx-auto drop-shadow">
                {slide.description}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to="/reservations"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-black font-semibold text-sm tracking-wider uppercase transition duration-300 shadow-luxury hover:scale-105"
                >
                  Book Your Stay
                </Link>
                <Link
                  to="/rooms"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-gray-200 hover:text-white border border-gold-500/30 text-sm font-medium tracking-wider uppercase backdrop-blur-md transition duration-300"
                >
                  Explore Suites
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center transition hover:scale-110 backdrop-blur-sm"
        aria-label="Previous Slide"
      >
        <FaChevronLeft size={16} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center transition hover:scale-110 backdrop-blur-sm"
        aria-label="Next Slide"
      >
        <FaChevronRight size={16} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-gold-400' : 'w-2 bg-gray-500/60 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
