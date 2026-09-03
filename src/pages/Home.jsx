import React, { useState, useEffect } from 'react';
import HeroSlider from '../components/home/HeroSlider';
import CuisinesSection from '../components/home/CuisinesSection';
import NewReservationModal from '../components/reservations/NewReservationModal';
import RoomDetailModal from '../components/rooms/RoomDetailModal';
import { roomsApi } from '../api/rooms';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import { getRoomImage } from '../utils/roomImages';
import { FaSpa, FaConciergeBell, FaSwimmer, FaWifi, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  // Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, typesRes] = await Promise.all([
          roomsApi.getRooms(),
          roomsApi.getRoomTypes(),
        ]);
        const rList = roomsRes.data || [];
        const tMap = (typesRes.data || []).reduce((acc, t) => {
          acc[t.id] = t;
          return acc;
        }, {});
        setFeaturedRooms(rList.slice(0, 3));
        setRoomTypes(tMap);
      } catch (e) {
        console.error('Failed to load featured rooms:', e);
      }
    };
    fetchData();
  }, []);

  const handleBookRoom = (roomId, e) => {
    if (e) e.stopPropagation();
    setSelectedRoomId(roomId);
    setIsModalOpen(true);
  };

  const handleOpenDetail = (room) => {
    setSelectedRoomForDetail(room);
    setDetailModalOpen(true);
  };

  return (
    <div className="bg-slate-950 text-gray-100 overflow-hidden">
      {/* Hero Section */}
      <HeroSlider />

      {/* Welcome & Philosophy Section */}
      <section className="py-24 relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-12 h-0.5 bg-gold-400 mx-auto" />
          <span className="text-xs uppercase tracking-[0.3em] text-gold-400 font-semibold block">
            A Haven of Serenity & Splendor
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
            Welcome to Grand Hotel
          </h2>
          <p className="text-gray-300 text-base sm:text-lg font-light leading-relaxed">
            Nestled in an idyllic coastal landscape, Grand Hotel seamlessly weaves historic prestige with avant-garde luxury. Whether you visit for a high-level summit, a bespoke wellness retreat, or an unforgettable celebration, our dedicated concierge team attends to your every desire.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center hover:border-gold-500/40 transition">
              <FaConciergeBell className="text-gold-400 text-3xl mx-auto mb-3" />
              <h4 className="font-serif text-base font-semibold text-white">24/7 Butler Service</h4>
              <p className="text-xs text-gray-400 mt-1">Dedicated VIP care</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center hover:border-gold-500/40 transition">
              <FaSpa className="text-gold-400 text-3xl mx-auto mb-3" />
              <h4 className="font-serif text-base font-semibold text-white">Holistic Spa & Sauna</h4>
              <p className="text-xs text-gray-400 mt-1">Therapeutic serenity</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center hover:border-gold-500/40 transition">
              <FaSwimmer className="text-gold-400 text-3xl mx-auto mb-3" />
              <h4 className="font-serif text-base font-semibold text-white">Infinity Horizon Pool</h4>
              <p className="text-xs text-gray-400 mt-1">Panoramic vistas</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center hover:border-gold-500/40 transition">
              <FaWifi className="text-gold-400 text-3xl mx-auto mb-3" />
              <h4 className="font-serif text-base font-semibold text-white">Ultra High-Speed Wi-Fi</h4>
              <p className="text-xs text-gray-400 mt-1">Seamless connectivity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Suites Catalog */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block mb-2">
                Accommodations
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Featured Luxury Suites
              </h3>
            </div>
            <Link
              to="/rooms"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-gold-400 hover:text-gold-300 transition group"
            >
              View All Suites <FaArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRooms.map((room) => {
              const type = roomTypes[room.room_type_id];
              const roomImage = getRoomImage(room.room_number, type?.name, room.image);

              return (
                <div
                  key={room.id}
                  onClick={() => handleOpenDetail(room)}
                  className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-gold-500/50 shadow-luxury group transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={roomImage}
                      alt={`Room ${room.room_number}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-gold-500/30 text-gold-400 font-semibold text-xs">
                      {formatCurrency(type?.price_per_night || 120)} / night
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-1">
                        {type?.name || 'Grand Suite'}
                      </div>
                      <h4 className="font-serif text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                        Suite {room.room_number}
                      </h4>
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                        {type?.description || 'Luxurious amenities, panoramic view, and premium comfort.'}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleBookRoom(room.id, e)}
                      className="w-full py-2.5 rounded-xl bg-gold-500/15 hover:bg-gold-500 text-gold-300 hover:text-black font-semibold text-xs uppercase tracking-wider border border-gold-500/40 transition duration-200"
                    >
                      Book Suite {room.room_number}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cuisines & Dining Section */}
      <CuisinesSection />

      {/* Room Detail Modal */}
      <RoomDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        room={selectedRoomForDetail}
        roomType={selectedRoomForDetail ? roomTypes[selectedRoomForDetail.room_type_id] : null}
        onBookNow={(roomId) => {
          setSelectedRoomId(roomId);
          setIsModalOpen(true);
        }}
      />

      {/* Booking Modal */}
      <NewReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialRoomId={selectedRoomId}
      />
    </div>
  );
};

export default Home;
