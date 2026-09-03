import React, { useEffect, useState } from 'react';
import { roomsApi } from '../api/rooms';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import NewReservationModal from '../components/reservations/NewReservationModal';
import RoomDetailModal from '../components/rooms/RoomDetailModal';
import { formatCurrency } from '../utils/formatters';
import { getRoomImage } from '../utils/roomImages';
import { FaBed, FaShieldAlt, FaFilter, FaPercent, FaInfoCircle } from 'react-icons/fa';

const Rooms = () => {
  const { isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Reservation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingRoomId, setBookingRoomId] = useState(null);

  // Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState(null);

  useEffect(() => {
    fetchRoomsAndTypes();
  }, []);

  const fetchRoomsAndTypes = async () => {
    setLoading(true);
    try {
      const [roomsRes, typesRes] = await Promise.all([
        roomsApi.getRooms(),
        roomsApi.getRoomTypes(),
      ]);
      setRooms(roomsRes.data || []);
      setRoomTypes(typesRes.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const typesMap = roomTypes.reduce((acc, t) => {
    acc[t.id] = t;
    return acc;
  }, {});

  const filteredRooms = rooms.filter((room) => {
    const type = typesMap[room.room_type_id];
    const matchesType =
      selectedType === 'all' || (type && type.name.toLowerCase().includes(selectedType.toLowerCase()));
    const matchesAvailability = !availableOnly || room.room_availability === 'available';
    return matchesType && matchesAvailability;
  });

  const handleOpenBooking = (roomId, e) => {
    if (e) e.stopPropagation();
    setBookingRoomId(roomId);
    setIsModalOpen(true);
  };

  const handleOpenDetail = (room) => {
    setSelectedRoomForDetail(room);
    setDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
            Accommodations
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Luxury Rooms & Private Suites
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Click any suite to view its high-definition gallery, tailored amenities, pricing breakdown, and current promotional discounts.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-10 shadow-luxury flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Room Type Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mr-2">
              <FaFilter className="text-gold-400" /> Filter:
            </span>
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                selectedType === 'all'
                  ? 'bg-gold-500 text-black shadow-md'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              All Suites
            </button>
            {roomTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.name)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedType === type.name
                    ? 'bg-gold-500 text-black shadow-md'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>

          {/* Availability Toggle */}
          <label className="flex items-center gap-2 text-xs font-medium text-gray-300 cursor-pointer self-start md:self-auto">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded border-slate-700 bg-slate-950 text-gold-500 focus:ring-gold-400 w-4 h-4"
            />
            <span>Available for booking only</span>
          </label>
        </div>

        {/* Room Grid */}
        {loading ? (
          <LoadingSpinner text="Fetching Grand Hotel suite collection..." />
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 max-w-lg mx-auto">
            <FaBed className="text-gold-400 text-4xl mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-lg font-bold text-white mb-1">No Rooms Match Your Criteria</h3>
            <p className="text-sm text-gray-400">Try clearing your filters to see more luxury suites.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => {
              const type = typesMap[room.room_type_id];
              const isAvailable = room.room_availability === 'available';
              const roomImage = getRoomImage(room.room_number, type?.name, room.image);

              const hasDiscount = type?.id === 4 || type?.id === 2;
              const discountPercent = type?.id === 4 ? 15 : type?.id === 2 ? 10 : 0;
              const price = type?.price_per_night || 150;
              const discountedPrice = hasDiscount ? Math.round(price * (1 - discountPercent / 100)) : price;

              return (
                <div
                  key={room.id}
                  onClick={() => handleOpenDetail(room)}
                  className="bg-slate-900 border border-slate-800 hover:border-gold-500/50 rounded-3xl overflow-hidden shadow-luxury transition-all duration-300 group flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
                >
                  <div>
                    {/* Image & Badges */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={roomImage}
                        alt={`Room ${room.room_number}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />
                      <div className="absolute top-4 left-4 flex gap-1.5 items-center">
                        <StatusBadge status={room.room_availability} type="room" />
                        {hasDiscount && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-black shadow">
                            <FaPercent size={9} /> {discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-gold-500/30 text-gold-400 font-bold text-sm">
                        {formatCurrency(discountedPrice)}{' '}
                        <span className="text-[10px] text-gray-300 font-normal">/ night</span>
                      </div>

                      <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-sm text-gold-300 text-xs px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FaInfoCircle /> Click to inspect
                      </div>
                    </div>

                    {/* Room Info */}
                    <div className="p-6 space-y-4">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-1">
                          {type?.name || 'Grand Suite'}
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-white group-hover:text-gold-300 transition-colors">
                          Suite {room.room_number}
                        </h3>
                        <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">
                          {type?.description || 'Indulge in spacious interiors, private balcony, and opulent decor.'}
                        </p>
                      </div>

                      {/* Amenities pills */}
                      {type?.amenities && (
                        <div className="pt-2 border-t border-slate-800/80">
                          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Key Amenities
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {type.amenities.split('.').slice(0, 3).map((item, idx) => (
                              item.trim() && (
                                <span
                                  key={idx}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-gray-300 border border-slate-700/60"
                                >
                                  ✦ {item.split(':')[0].trim()}
                                </span>
                              )
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Deposit info */}
                      <div className="flex items-center justify-between text-xs text-gray-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="flex items-center gap-1 text-gray-300 font-medium">
                          <FaShieldAlt className="text-gold-400" /> Booking Deposit
                        </span>
                        <span className="font-semibold text-gold-300">
                          {type?.deposit_percentage || 20}% required
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Trigger Button */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={(e) => handleOpenBooking(room.id, e)}
                      disabled={!isAvailable}
                      className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition duration-200 shadow-md ${
                        isAvailable
                          ? 'bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-black hover:scale-[1.01]'
                          : 'bg-slate-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isAvailable ? `Reserve Room ${room.room_number}` : 'Currently Reserved'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Room Detail Modal */}
      <RoomDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        room={selectedRoomForDetail}
        roomType={selectedRoomForDetail ? typesMap[selectedRoomForDetail.room_type_id] : null}
        onBookNow={(roomId) => {
          setBookingRoomId(roomId);
          setIsModalOpen(true);
        }}
      />

      {/* Reservation Booking Modal */}
      <NewReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialRoomId={bookingRoomId}
        onSuccess={() => fetchRoomsAndTypes()}
      />
    </div>
  );
};

export default Rooms;
