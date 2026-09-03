import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { getRoomImage } from '../../utils/roomImages';
import {
  FaBed,
  FaShieldAlt,
  FaTag,
  FaCheckCircle,
  FaCalendarCheck,
  FaPercent,
  FaWineGlass,
  FaTv,
  FaWifi,
  FaShower,
  FaCoffee,
} from 'react-icons/fa';

const RoomDetailModal = ({ isOpen, onClose, room, roomType, onBookNow }) => {
  if (!room) return null;

  const typeName = roomType?.name || 'Grand Suite';
  const price = roomType?.price_per_night || 150;
  const depositPercent = roomType?.deposit_percentage || 20;
  const isAvailable = room.room_availability === 'available';
  const roomImg = getRoomImage(room.room_number, typeName, room.image);

  // Parse amenities from roomType string
  const rawAmenities = roomType?.amenities ? roomType.amenities.split('. ') : [];
  const parsedAmenities = rawAmenities
    .map((item) => item.trim().replace(/\.$/, ''))
    .filter((item) => item.length > 0);

  // Discount calculation
  // Executive and Superior suites have special seasonal discount offers
  const hasDiscount = roomType?.id === 4 || roomType?.id === 2;
  const discountPercent = roomType?.id === 4 ? 15 : roomType?.id === 2 ? 10 : 0;
  const discountedPrice = hasDiscount ? Math.round(price * (1 - discountPercent / 100)) : price;

  const handleBookClick = () => {
    onClose();
    if (onBookNow) onBookNow(room.id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Suite Overview — Room ${room.room_number}`} maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Photo & Header Badges */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-luxury h-72 sm:h-80 group">
          <img
            src={roomImg}
            alt={`Room ${room.room_number}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute top-4 left-4 flex gap-2 items-center">
            <StatusBadge status={room.room_availability} type="room" size="lg" />
            {hasDiscount && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-black shadow-md uppercase tracking-wider">
                <FaPercent size={10} /> {discountPercent}% Seasonal Off
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-400 font-bold block mb-1">
                {typeName}
              </span>
              <h2 className="font-serif text-3xl font-bold text-white drop-shadow">
                Suite {room.room_number}
              </h2>
            </div>
            
            <div className="text-right bg-slate-950/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-gold-500/30">
              {hasDiscount && (
                <div className="text-xs text-gray-400 line-through">
                  {formatCurrency(price)}
                </div>
              )}
              <div className="text-xl sm:text-2xl font-bold text-gold-400">
                {formatCurrency(discountedPrice)}{' '}
                <span className="text-xs text-gray-300 font-normal">/ night</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Deposit Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 text-lg flex-shrink-0">
              <FaTag />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Nightly Rate</div>
              <div className="text-base font-bold text-white">
                {formatCurrency(discountedPrice)}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 text-lg flex-shrink-0">
              <FaShieldAlt />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Required Deposit</div>
              <div className="text-base font-bold text-gold-300">
                {depositPercent}% at booking
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 text-lg flex-shrink-0">
              <FaCalendarCheck />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Availability</div>
              <div className="text-base font-bold text-emerald-400 capitalize">
                {room.room_availability}
              </div>
            </div>
          </div>
        </div>

        {/* Suite Description */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-widest text-gold-400 font-bold">
            Suite Description & Ambience
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            {roomType?.description ||
              'Step into unrivaled luxury with custom plush bedding, ambient lighting, Italian marble bathroom, and panoramic city or coastal vistas.'}
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest text-gold-400 font-bold">
            Features & In-Suite Amenities
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {parsedAmenities.length > 0 ? (
              parsedAmenities.map((amenity, idx) => {
                const [title, desc] = amenity.includes(':') ? amenity.split(':') : [null, amenity];
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5"
                  >
                    <FaCheckCircle className="text-gold-400 text-sm mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-gray-300">
                      {title && <strong className="text-white block font-medium">{title.trim()}</strong>}
                      <span>{desc?.trim() || amenity}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5 text-xs text-gray-300">
                  <FaWifi className="text-gold-400" /> High-speed complimentary Wi-Fi
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5 text-xs text-gray-300">
                  <FaTv className="text-gold-400" /> 55" 4K Smart TV & Audio System
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5 text-xs text-gray-300">
                  <FaShower className="text-gold-400" /> Rain-style deep shower & robes
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5 text-xs text-gray-300">
                  <FaCoffee className="text-gold-400" /> Espresso maker & complimentary bar
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-slate-800 transition"
          >
            Close
          </button>
          <button
            onClick={handleBookClick}
            disabled={!isAvailable}
            className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-luxury ${
              isAvailable
                ? 'bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-black hover:scale-105'
                : 'bg-slate-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAvailable ? `Reserve Suite ${room.room_number}` : 'Currently Reserved'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RoomDetailModal;
