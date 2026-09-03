import React from 'react';

const galleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1695606452817-e28a67339e57?q=80&w=1470&auto=format&fit=crop',
    title: 'Artisan Pastries & Breakfast',
    category: 'Bakery',
  },
  {
    url: 'https://images.unsplash.com/photo-1688084403060-3594a4b8ff8d?q=80&w=1632&auto=format&fit=crop',
    title: 'Prime Wagyu Cut',
    category: 'Grill & Steakhouse',
  },
  {
    url: 'https://images.unsplash.com/photo-1695606392727-d8b959879721?q=80&w=1460&auto=format&fit=crop',
    title: 'Signature Cocktails',
    category: 'Rooftop Lounge',
  },
  {
    url: 'https://images.unsplash.com/photo-1695605302261-75b7f9be5653?q=80&w=1374&auto=format&fit=crop',
    title: 'Mediterranean Seafood',
    category: 'Fine Dining',
  },
  {
    url: 'https://images.unsplash.com/photo-1688084546323-fcd3f9d8389b?q=80&w=1632&auto=format&fit=crop',
    title: 'Caviar & Hors D’oeuvres',
    category: 'VIP Club Lounge',
  },
  {
    url: 'https://images.unsplash.com/photo-1688084398814-8926f7d56ebe?q=80&w=1632&auto=format&fit=crop',
    title: 'French Patisserie Delicacies',
    category: 'Desserts',
  },
  {
    url: 'https://images.unsplash.com/photo-1607269832078-1a3bd22a306d?q=80&w=1374&auto=format&fit=crop',
    title: 'Vintage Reserve Cellar',
    category: 'Wine Bar',
  },
];

const ImageScroller = () => {
  return (
    <div className="relative w-full py-6">
      <div className="flex gap-6 overflow-x-auto pb-6 pt-2 px-4 no-scrollbar snap-x snap-mandatory">
        {galleryImages.map((item, index) => (
          <div
            key={index}
            className="flex-none w-80 sm:w-96 h-80 rounded-2xl overflow-hidden relative group snap-start border border-slate-800 shadow-luxury hover:border-gold-500/50 transition-all duration-300"
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-[11px] uppercase tracking-widest text-gold-400 font-semibold block mb-1">
                {item.category}
              </span>
              <h4 className="font-serif text-lg font-bold text-white leading-tight">
                {item.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageScroller;
