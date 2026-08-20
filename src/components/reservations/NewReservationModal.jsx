/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { reservationsApi } from "../../api/reservations";
import { roomsApi } from "../../api/rooms";
import { guestsApi } from "../../api/guests";
import { useAuth } from "../../context/AuthContext";
import { PAYMENT_METHODS } from "../../utils/constants";
import { formatCurrency, calculateNights } from "../../utils/formatters";
import Swal from "sweetalert2";
import { FaShieldAlt } from "react-icons/fa";

const NewReservationModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialRoomId = null,
}) => {
  const { user, isAuthenticated, isManager, hasPermission } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId || "");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [guestPhone, setGuestPhone] = useState(user?.phone_number || "");
  const [guests, setGuests] = useState([]);
  const [selectedGuestId, setSelectedGuestId] = useState("self");
  const [newGuest, setNewGuest] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "Guest@123",
  });
  const canManageGuests = isManager && hasPermission("guest.view_all");
  const canCreateGuests = isManager && hasPermission("guest.create");

  // Default dates: tomorrow to +3 days
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const after3Days = new Date(today);
      after3Days.setDate(after3Days.getDate() + 4);

      setCheckInDate(tomorrow.toISOString().split("T")[0]);
      setCheckOutDate(after3Days.toISOString().split("T")[0]);
      if (initialRoomId) setSelectedRoomId(initialRoomId);
      setSelectedGuestId(canCreateGuests ? "new" : "self");
      loadRoomsAndTypes();
      if (canManageGuests) loadGuests();
    }
  }, [isOpen, initialRoomId, canCreateGuests, canManageGuests]);

  const loadGuests = async () => {
    try {
      const response = await guestsApi.getGuests({ limit: 100 });
      setGuests(response.data || []);
    } catch (error) {
      console.error("Failed to load guests:", error);
    }
  };

  const loadRoomsAndTypes = async () => {
    setLoading(true);
    try {
      const [roomsRes, typesRes] = await Promise.all([
        roomsApi.getRooms(),
        roomsApi.getRoomTypes(),
      ]);

      const loadedRooms = roomsRes.data || [];
      const loadedTypes = (typesRes.data || []).reduce((acc, t) => {
        acc[t.id] = t;
        return acc;
      }, {});

      setRooms(loadedRooms);
      setRoomTypes(loadedTypes);

      if (!selectedRoomId && loadedRooms.length > 0) {
        setSelectedRoomId(loadedRooms[0].id);
      }
    } catch (error) {
      console.error("Failed to load rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedRoom = rooms.find(
    (r) => String(r.id) === String(selectedRoomId),
  );
  const selectedType = selectedRoom
    ? roomTypes[selectedRoom.room_type_id]
    : null;

  const pricePerNight = selectedType?.price_per_night || 150;
  const depositPercent = selectedType?.deposit_percentage || 20;
  const nights = calculateNights(checkInDate, checkOutDate);
  const totalPrice = pricePerNight * nights;
  const depositAmount = Math.round((totalPrice * depositPercent) / 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      Swal.fire({
        title: "Sign In Required",
        text: "Please log in to complete your reservation.",
        icon: "warning",
        confirmButtonColor: "#cfa64b",
      });
      return;
    }

    if (!selectedRoomId) {
      Swal.fire({
        title: "Select a Room",
        text: "Please choose a room to book.",
        icon: "warning",
      });
      return;
    }

    if (!user?.guest_id && selectedGuestId === "self") {
      Swal.fire({
        title: "Guest Profile Required",
        text: "Your account is not linked to a guest profile yet. Please contact the hotel desk.",
        icon: "error",
      });
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      Swal.fire({
        title: "Invalid Dates",
        text: "Check-out date must be after check-in date.",
        icon: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      let guestId =
        selectedGuestId === "self" ? user.guest_id : Number(selectedGuestId);
      if (selectedGuestId === "new") {
        const guestResponse = await guestsApi.registerGuest(newGuest);
        guestId = guestResponse.data.id;
      }
      // In FastAPI backend, guest_id corresponds to a Guests record or user_id
      // We pass the guest/user ID, room_id, formatted ISO datetime strings
      const checkInISO = `${checkInDate}T14:00:00Z`;
      const checkOutISO = `${checkOutDate}T11:00:00Z`;
      const paymentDueAt = checkInISO;

      const payload = {
        guest_id: guestId,
        room_id: Number(selectedRoomId),
        check_in_date: checkInISO,
        check_out_date: checkOutISO,
        payment_due_at: paymentDueAt,
        room_price_per_night: pricePerNight,
        deposit_percentage: depositPercent,
        deposit_amount: depositAmount,
        total_amount: totalPrice,
        status: "pending",
      };

      const res = await reservationsApi.createReservation(
        payload,
        paymentMethod,
      );

      Swal.fire({
        title: "Reservation Requested!",
        html: `
          <p class="text-sm text-gray-300">Your reservation for <strong>Room ${selectedRoom?.room_number}</strong> has been created.</p>
          <div class="mt-3 p-3 bg-slate-800 rounded-xl text-left text-xs text-gray-300 space-y-1">
            <div><strong>Nights:</strong> ${nights} (${checkInDate} to ${checkOutDate})</div>
            <div><strong>Total Cost:</strong> ${formatCurrency(totalPrice)}</div>
            <div><strong>Deposit Required:</strong> <span class="text-gold-400 font-bold">${formatCurrency(depositAmount)}</span> (${depositPercent}%)</div>
            <div><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</div>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#cfa64b",
        confirmButtonText: "View My Reservations",
        background: "#0f172a",
        color: "#f8fafc",
      });

      onClose();
      if (onSuccess) onSuccess(res.data);
    } catch (error) {
      Swal.fire({
        title: "Booking Error",
        text:
          error.message ||
          "Could not complete reservation. Room may already be reserved for these dates.",
        icon: "error",
        background: "#0f172a",
        color: "#f8fafc",
        confirmButtonColor: "#cfa64b",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reserve Your Luxury Suite"
      maxWidth="max-w-5xl"
    >
      {loading ? (
        <div className="py-12 text-center text-gold-400">
          Loading room inventory...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Selection */}
          {canCreateGuests && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Booking Guest
              </label>
              <select
                value={selectedGuestId}
                onChange={(event) => setSelectedGuestId(event.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              >
                <option value="self">My account</option>
                {guests.map((guest) => (
                  <option key={guest.id} value={guest.id}>
                    {guest.user?.name} ({guest.user?.email})
                  </option>
                ))}
                <option value="new">Register new walk-in guest</option>
              </select>
              {selectedGuestId === "new" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["name", "email", "phone_number", "password"].map(
                    (field) => (
                      <input
                        key={field}
                        type={
                          field === "password"
                            ? "password"
                            : field === "email"
                              ? "email"
                              : "text"
                        }
                        required
                        placeholder={field.replace("_", " ")}
                        value={newGuest[field]}
                        onChange={(event) =>
                          setNewGuest({
                            ...newGuest,
                            [field]: event.target.value,
                          })
                        }
                        className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                      />
                    ),
                  )}
                </div>
              )}
            </div>
          )}

          {/* Room Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Select Room & Suite
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
              {rooms.map((room) => {
                const type = roomTypes[room.room_type_id];
                const isSelected = String(room.id) === String(selectedRoomId);
                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`cursor-pointer p-3 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                      isSelected
                        ? "bg-gold-500/15 border-gold-500 shadow-md"
                        : "bg-slate-800/60 border-slate-700/80 hover:border-slate-600"
                    }`}
                  >
                    <img
                      src={room.image}
                      alt={`Room ${room.room_number}`}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">
                          Room {room.room_number}
                        </span>
                        <span className="text-xs text-gold-400 font-semibold">
                          ${type?.price_per_night || 120}/nt
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 truncate">
                        {type?.name || "Standard"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Check-in Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkInDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Check-out Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkOutDate}
                  min={checkInDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/60"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Deposit Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Duration</span>
              <span className="text-gray-200 font-medium">
                {nights} {nights === 1 ? "Night" : "Nights"}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Nightly Rate ({selectedType?.name || "Room"})</span>
              <span className="text-gray-200 font-medium">
                {formatCurrency(pricePerNight)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-200 font-semibold pt-1 border-t border-slate-800">
              <span>Total Stay Cost</span>
              <span className="text-white">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm text-gold-400 font-bold bg-gold-500/10 p-2.5 rounded-xl border border-gold-500/20">
              <span className="flex items-center gap-1.5">
                <FaShieldAlt className="text-gold-400" /> Required Deposit (
                {depositPercent}%)
              </span>
              <span>{formatCurrency(depositAmount)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Deposit Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`cursor-pointer p-3 rounded-xl border transition-all text-center ${
                      isSelected
                        ? "bg-gold-500/20 border-gold-500 text-gold-300 font-bold"
                        : "bg-slate-800/40 border-slate-700/60 text-gray-300 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-xl mb-1">{method.icon}</div>
                    <div className="text-xs font-semibold">{method.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* M-Pesa Phone field if Mpesa selected */}
          {paymentMethod === "mpesa" && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 animate-fadeIn">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                M-Pesa Phone Number for STK Push
              </label>
              <input
                type="text"
                placeholder="0712345678 or 254712345678"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-gold-500/60"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                You will receive a PIN prompt on this phone to confirm the{" "}
                {formatCurrency(depositAmount)} deposit.
              </p>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-black font-bold text-sm tracking-wider uppercase transition duration-200 shadow-luxury ${
              submitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-[1.01]"
            }`}
          >
            {submitting
              ? "Processing Reservation..."
              : `Confirm & Pay Deposit (${formatCurrency(depositAmount)})`}
          </button>
        </form>
      )}
    </Modal>
  );
};

export default NewReservationModal;
