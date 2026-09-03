/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import Modal from "../common/Modal";
import { reservationsApi } from "../../api/reservations";
import { roomsApi } from "../../api/rooms";
import { guestsApi } from "../../api/guests";
import { useAuth } from "../../context/AuthContext";
import { PAYMENT_METHODS } from "../../utils/constants";
import { calculateNights, formatCurrency } from "../../utils/formatters";
import { getRoomImage } from "../../utils/roomImages";
import Swal from "sweetalert2";
import {
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaShieldAlt,
  FaUserCheck,
  FaMobileAlt,
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";

const steps = ["Guest details", "Room & dates", "Payment"];
const inputClass =
  "w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-400/70";

const toDateInput = (date) => date.toISOString().split("T")[0];
const addDays = (dateString, days) => {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + Number(days || 0));
  return toDateInput(date);
};

const NewReservationModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialRoomId = null,
}) => {
  const { user, isAuthenticated, isManager, hasPermission } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState({});
  const [guests, setGuests] = useState([]);
  const [guestSearch, setGuestSearch] = useState("");
  const [roomSearch, setRoomSearch] = useState("");
  const [selectedGuestId, setSelectedGuestId] = useState("self");
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId || "");
  const [newGuest, setNewGuest] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "Guest@123",
  });
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [nightsInput, setNightsInput] = useState("");
  const [paymentMode, setPaymentMode] = useState("deposit");
  const [skipPayment, setSkipPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [guestPhone, setGuestPhone] = useState(user?.phone_number || "");

  const canManageGuests = isManager && hasPermission("guest.view_all");
  const canCreateGuests = isManager && hasPermission("guest.create");

  const loadData = async () => {
    setLoading(true);
    try {
      const [roomsResponse, typesResponse] = await Promise.all([
        roomsApi.getRooms({ limit: 100, room_availability: "available" }),
        roomsApi.getRoomTypes({ limit: 100 }),
      ]);
      setRooms(roomsResponse.data || []);
      setRoomTypes(
        (typesResponse.data || []).reduce(
          (result, type) => ({ ...result, [type.id]: type }),
          {},
        ),
      );
      const firstBookableRoom = (roomsResponse.data || []).find(
        (room) =>
          room.status !== false && room.room_availability === "available",
      );
      const selectedRoomStillBookable = (roomsResponse.data || []).some(
        (room) =>
          String(room.id) === String(selectedRoomId) &&
          room.status !== false &&
          room.room_availability === "available",
      );
      if ((!selectedRoomId || !selectedRoomStillBookable) && firstBookableRoom) {
        setSelectedRoomId(firstBookableRoom.id);
      }
      if (canManageGuests) {
        const guestsResponse = await guestsApi.getGuests({ limit: 100 });
        setGuests(guestsResponse.data || []);
      }
    } catch (error) {
      Swal.fire({
        title: "Booking data unavailable",
        text: error.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkIn = toDateInput(tomorrow);
    
    // Auto-pick guest details: if user is logged in, start on Room & dates (step 1)
    // or if manager without pre-selected guest, start on step 0
    if (isAuthenticated && !canManageGuests) {
      setStep(1);
      setSelectedGuestId("self");
    } else if (canManageGuests) {
      setStep(0);
      setSelectedGuestId(canCreateGuests ? "new" : "self");
    } else {
      setStep(0);
      setSelectedGuestId("self");
    }

    setCheckInDate(checkIn);
    setNightsInput("");
    setCheckOutDate(addDays(checkIn, 3));
    setPaymentMode("deposit");
    setSkipPayment(false);
    setPaymentMethod("mpesa");
    setGuestPhone(user?.phone_number || "");

    if (initialRoomId) {
      setSelectedRoomId(initialRoomId);
    }
    loadData();
  }, [isOpen, initialRoomId, isAuthenticated, canManageGuests]);

  const selectedRoom = rooms.find(
    (room) => String(room.id) === String(selectedRoomId),
  );
  const selectedType = selectedRoom
    ? roomTypes[selectedRoom.room_type_id]
    : null;
  const calculatedNights =
    checkInDate && checkOutDate
      ? calculateNights(checkInDate, checkOutDate)
      : 0;
  const nights = Number(nightsInput) || calculatedNights;
  const pricePerNight = selectedType?.price_per_night || 0;
  const totalPrice = pricePerNight * nights;
  const depositAmount = Math.round(
    (totalPrice * (selectedType?.deposit_percentage || 20)) / 100,
  );

  const filteredGuests = useMemo(() => {
    const query = guestSearch.toLowerCase().trim();
    if (!query) return guests;
    return guests.filter((guest) =>
      [guest.user?.name, guest.user?.email, guest.user?.phone_number].some(
        (value) => value?.toLowerCase().includes(query),
      ),
    );
  }, [guests, guestSearch]);

  const filteredRooms = useMemo(() => {
    const query = roomSearch.toLowerCase().trim();
    const bookableRooms = rooms.filter(
      (room) => room.status !== false && room.room_availability === "available",
    );
    if (!query) return bookableRooms;
    return bookableRooms.filter((room) =>
      `${room.room_number} ${roomTypes[room.room_type_id]?.name || ""}`
        .toLowerCase()
        .includes(query),
    );
  }, [rooms, roomSearch, roomTypes]);

  const updateCheckIn = (value) => {
    setCheckInDate(value);
    if (nightsInput) setCheckOutDate(addDays(value, nightsInput));
  };

  const updateCheckOut = (value) => {
    setCheckOutDate(value);
    if (checkInDate && new Date(value) > new Date(checkInDate))
      setNightsInput(String(calculateNights(checkInDate, value)));
  };

  const updateNights = (value) => {
    setNightsInput(value);
    if (checkInDate && value) setCheckOutDate(addDays(checkInDate, value));
  };

  const validateStep = () => {
    if (step === 0) {
      if (selectedGuestId === "self" && !isAuthenticated) {
        return "Please sign in to book as yourself.";
      }
      if (
        selectedGuestId === "new" &&
        (!newGuest.name ||
          !newGuest.email ||
          !newGuest.phone_number ||
          !newGuest.password)
      ) {
        return "Complete all the guest details.";
      }
    }
    if (step === 1) {
      if (!selectedRoomId) return "Please choose a suite.";
      if (!checkInDate || !checkOutDate || nights < 1)
        return "Choose valid check-in and check-out dates.";
      if (new Date(checkOutDate) <= new Date(checkInDate))
        return "Check-out date must be after check-in date.";
    }
    if (step === 2 && !skipPayment) {
      if (paymentMethod === "mpesa" && !guestPhone.trim()) {
        return "Enter an M-Pesa phone number to receive the payment prompt.";
      }
    }
    return null;
  };

  const goNext = () => {
    const error = validateStep();
    if (error)
      return Swal.fire({ title: "Almost there", text: error, icon: "warning", confirmButtonColor: "#cfa64b" });
    setStep((current) => Math.min(2, current + 1));
  };

  const submitReservation = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      return Swal.fire({
        title: "Sign in required",
        text: "Please sign in before creating a reservation.",
        icon: "warning",
        confirmButtonColor: "#cfa64b",
      });
    }
    const error = validateStep();
    if (error)
      return Swal.fire({
        title: "Check your booking",
        text: error,
        icon: "warning",
        confirmButtonColor: "#cfa64b",
      });
    setSubmitting(true);
    try {
      let guestId = user?.guest_id || user?.id || 1;
      if (selectedGuestId === "new") {
        const regRes = await guestsApi.registerGuest(newGuest);
        guestId = regRes.data.id;
      } else if (selectedGuestId !== "self") {
        guestId = Number(selectedGuestId);
      }

      const response = await reservationsApi.createReservation(
        {
          guest_id: guestId,
          room_id: Number(selectedRoomId),
          check_in_date: `${checkInDate}T14:00:00Z`,
          check_out_date: `${checkOutDate}T11:00:00Z`,
          payment_due_at: new Date(Date.now() + 5 * 86400000).toISOString(),
          room_price_per_night: pricePerNight,
          deposit_percentage: selectedType?.deposit_percentage || 20,
          deposit_amount: depositAmount,
          total_amount: totalPrice,
          status: "pending",
        },
        paymentMethod,
        { payment_type: paymentMode, skip_payment: skipPayment },
      );

      const createdRes = response.data;

      Swal.fire({
        title: "Reservation Confirmed!",
        html: `
          <div class="text-left space-y-2 text-sm text-gray-300">
            <p>Your reservation for <strong>Room ${selectedRoom?.room_number}</strong> has been secured.</p>
            <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
              <div><strong>Dates:</strong> ${checkInDate} to ${checkOutDate} (${nights} nights)</div>
              <div><strong>Total Amount:</strong> ${formatCurrency(totalPrice)}</div>
              <div><strong>Deposit:</strong> <span class="text-gold-400 font-bold">${formatCurrency(depositAmount)}</span></div>
              <div><strong>Payment Mode:</strong> ${skipPayment ? 'Payment Deferred (Due in 5 days)' : `${paymentMethod.toUpperCase()} (${paymentMode === 'full_payment' ? 'Full' : 'Deposit'})`}</div>
            </div>
            ${paymentMethod === 'mpesa' && !skipPayment ? `<p class="text-emerald-400 text-xs mt-2">📱 An M-Pesa STK push prompt has been initiated to <strong>${guestPhone}</strong>.</p>` : ''}
            ${paymentMethod === 'card' && !skipPayment ? `<p class="text-blue-400 text-xs mt-2">💳 Card transaction has been logged and verified.</p>` : ''}
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#cfa64b",
        confirmButtonText: "View My Reservations",
        background: "#0f172a",
        color: "#f8fafc",
      });

      onClose();
      onSuccess?.(createdRes);
    } catch (requestError) {
      Swal.fire({
        title: "Booking error",
        text: requestError.message || "Failed to create reservation",
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
      maxWidth="max-w-4xl"
    >
      <form onSubmit={submitReservation} className="space-y-6">
        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-2 rounded-2xl border border-slate-800">
          {steps.map((label, index) => (
            <button
              type="button"
              key={label}
              onClick={() => index <= step && setStep(index)}
              className={`rounded-xl px-3 py-2.5 text-left transition ${
                step === index
                  ? "bg-gold-500 text-black shadow-md font-bold"
                  : index < step
                  ? "text-gold-300 hover:bg-slate-900/60"
                  : "text-gray-500"
              }`}
            >
              <span className="block text-[10px] uppercase tracking-widest">
                Step {index + 1}
              </span>
              <span className="text-xs sm:text-sm font-semibold">{label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-gold-300">
            Loading hotel inventory...
          </div>
        ) : (
          <>
            {/* STEP 0: Guest Details */}
            {step === 0 && (
              <section className="space-y-5 min-h-[360px]">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gold-400 font-bold">
                    Guest Information
                  </p>
                  <h3 className="font-serif text-2xl text-white mt-1">
                    Who is staying with us?
                  </h3>
                </div>

                {isAuthenticated && (
                  <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold-500 text-black font-bold flex items-center justify-center uppercase text-sm">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <strong className="block text-white text-sm">{user?.name} (You)</strong>
                        <span className="text-xs text-gray-400">{user?.email} · {user?.phone_number || "No phone registered"}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGuestId("self");
                        setStep(1);
                      }}
                      className="px-4 py-2 rounded-xl bg-gold-500 text-black font-bold text-xs hover:bg-gold-400 transition"
                    >
                      Use My Profile →
                    </button>
                  </div>
                )}

                {canCreateGuests && (
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedGuestId("new")}
                      className={`flex-1 rounded-xl border p-3 text-sm transition ${
                        selectedGuestId === "new"
                          ? "border-gold-400 bg-gold-500/15 text-gold-200 font-semibold"
                          : "border-slate-700 text-gray-400 hover:border-slate-600"
                      }`}
                    >
                      + Add New Guest Profile
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedGuestId(
                          guests[0]?.id ? String(guests[0].id) : "self",
                        )
                      }
                      className={`flex-1 rounded-xl border p-3 text-sm transition ${
                        selectedGuestId !== "new" && selectedGuestId !== "self"
                          ? "border-gold-400 bg-gold-500/15 text-gold-200 font-semibold"
                          : "border-slate-700 text-gray-400 hover:border-slate-600"
                      }`}
                    >
                      Select Existing Guest Directory
                    </button>
                  </div>
                )}

                {selectedGuestId === "new" ? (
                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400">Full Name</label>
                      <input
                        required
                        className={inputClass}
                        placeholder="e.g. Eleanor Vance"
                        value={newGuest.name}
                        onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400">Email Address</label>
                      <input
                        required
                        type="email"
                        className={inputClass}
                        placeholder="eleanor@example.com"
                        value={newGuest.email}
                        onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400">Phone Number (for M-Pesa)</label>
                      <input
                        required
                        className={inputClass}
                        placeholder="0712345678"
                        value={newGuest.phone_number}
                        onChange={(e) => setNewGuest({ ...newGuest, phone_number: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400">Initial Password</label>
                      <input
                        required
                        type="password"
                        className={inputClass}
                        value={newGuest.password}
                        onChange={(e) => setNewGuest({ ...newGuest, password: e.target.value })}
                      />
                    </div>
                  </div>
                ) : canManageGuests ? (
                  <div className="space-y-3 pt-2">
                    <div className="relative">
                      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        className={`${inputClass} pl-11`}
                        placeholder="Search name, email, or phone number"
                        value={guestSearch}
                        onChange={(event) => setGuestSearch(event.target.value)}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                      {filteredGuests.map((guest) => (
                        <button
                          type="button"
                          key={guest.id}
                          onClick={() => setSelectedGuestId(String(guest.id))}
                          className={`text-left p-3.5 rounded-xl border transition ${
                            String(selectedGuestId) === String(guest.id)
                              ? "border-gold-400 bg-gold-500/15"
                              : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                          }`}
                        >
                          <strong className="block text-white text-sm">
                            {guest.user?.name}
                          </strong>
                          <span className="text-xs text-gray-400">
                            {guest.user?.email} · {guest.user?.phone_number}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>
            )}

            {/* STEP 1: Room & Dates */}
            {step === 1 && (
              <section className="space-y-5 min-h-[360px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gold-400 font-bold">
                      Suite & Schedule
                    </p>
                    <h3 className="font-serif text-2xl text-white mt-1">
                      Select Suite & Dates
                    </h3>
                  </div>

                  {isAuthenticated && (
                    <div className="text-right text-xs text-gray-400">
                      Booking for: <strong className="text-gold-300">{selectedGuestId === "new" ? newGuest.name || "New Guest" : user?.name || "Guest"}</strong>
                    </div>
                  )}
                </div>

                {/* Selected Room Banner Preview */}
                {selectedRoom && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-gold-500/30">
                    <img
                      src={getRoomImage(selectedRoom.room_number, selectedType?.name, selectedRoom.image)}
                      alt={`Room ${selectedRoom.room_number}`}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gold-400 uppercase tracking-wider font-bold">
                          {selectedType?.name || "Suite"}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {formatCurrency(pricePerNight)} <span className="text-xs text-gray-400 font-normal">/ night</span>
                        </span>
                      </div>
                      <h4 className="font-serif text-xl font-bold text-white">
                        Suite {selectedRoom.room_number}
                      </h4>
                      <p className="text-xs text-gray-400 truncate mt-1">
                        Deposit required: {selectedType?.deposit_percentage || 20}% ({formatCurrency(depositAmount)})
                      </p>
                    </div>
                  </div>
                )}

                {/* Search & Rooms Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      Or choose a different suite
                    </label>
                    <div className="relative w-64">
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                      <input
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                        placeholder="Search suite number..."
                        value={roomSearch}
                        onChange={(event) => setRoomSearch(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-40 overflow-y-auto pr-1">
                    {filteredRooms.map((room) => {
                      const type = roomTypes[room.room_type_id];
                      const isSelected = String(selectedRoomId) === String(room.id);
                      return (
                        <button
                          type="button"
                          key={room.id}
                          onClick={() => setSelectedRoomId(room.id)}
                          className={`text-left p-2.5 rounded-xl border transition flex items-center gap-2.5 ${
                            isSelected
                              ? "border-gold-400 bg-gold-500/15"
                              : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                          }`}
                        >
                          <img
                            src={getRoomImage(room.room_number, type?.name, room.image)}
                            alt={`Room ${room.room_number}`}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <strong className="block text-white text-xs">
                              Room {room.room_number}
                            </strong>
                            <span className="text-[11px] text-gold-300 truncate block">
                              {type?.name?.split('/')[0]}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dates Selection */}
                <div className="grid md:grid-cols-3 gap-4 pt-2">
                  <label className="text-xs text-gray-400">
                    Check-in Date
                    <input
                      required
                      type="date"
                      className={`${inputClass} mt-1.5`}
                      value={checkInDate}
                      min={toDateInput(new Date())}
                      onChange={(event) => updateCheckIn(event.target.value)}
                    />
                  </label>
                  <label className="text-xs text-gray-400">
                    Number of Nights
                    <input
                      type="number"
                      min="1"
                      className={`${inputClass} mt-1.5`}
                      value={nightsInput}
                      onChange={(event) => updateNights(event.target.value)}
                      placeholder={String(calculatedNights || 3)}
                    />
                  </label>
                  <label className="text-xs text-gray-400">
                    Check-out Date
                    <input
                      required
                      type="date"
                      className={`${inputClass} mt-1.5`}
                      value={checkOutDate}
                      min={checkInDate || toDateInput(new Date())}
                      onChange={(event) => updateCheckOut(event.target.value)}
                    />
                  </label>
                </div>

                {/* Summary calculation card */}
                <div className="flex items-center justify-between rounded-2xl bg-slate-950 border border-slate-800 p-4">
                  <div>
                    <span className="text-xs text-gray-400 block">Calculated Stay Cost</span>
                    <strong className="text-white text-base">
                      {nights || 0} nights @ {formatCurrency(pricePerNight)}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gold-400 font-semibold block">Total: {formatCurrency(totalPrice)}</span>
                    <span className="text-xs text-gold-300 font-bold bg-gold-500/10 px-2.5 py-1 rounded-lg border border-gold-500/20 inline-block mt-1">
                      Required Deposit ({selectedType?.deposit_percentage || 20}%): {formatCurrency(depositAmount)}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <section className="space-y-5 min-h-[360px]">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gold-400 font-bold">
                    Payment Gateway
                  </p>
                  <h3 className="font-serif text-2xl text-white mt-1">
                    Choose Payment Method
                  </h3>
                </div>

                {/* Defer option */}
                <label className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 cursor-pointer hover:border-slate-700 transition">
                  <input
                    type="checkbox"
                    checked={skipPayment}
                    onChange={(event) => setSkipPayment(event.target.checked)}
                    className="mt-1 w-4 h-4 accent-yellow-500 rounded"
                  />
                  <span>
                    <strong className="block text-white text-sm">
                      Skip payment now (Hold reservation for 5 days)
                    </strong>
                    <span className="text-xs text-gray-400 leading-relaxed block mt-0.5">
                      You can pay the required deposit anytime within 5 days from your reservations portal before expiration.
                    </span>
                  </span>
                </label>

                {!skipPayment && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Payment Mode (Deposit vs Full) */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                        Payment Coverage
                      </label>
                      <div className="grid md:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMode("deposit")}
                          className={`p-4 rounded-xl border text-left transition ${
                            paymentMode === "deposit"
                              ? "border-gold-400 bg-gold-500/15"
                              : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                          }`}
                        >
                          <strong className="block text-white text-sm">
                            Pay Required Deposit ({selectedType?.deposit_percentage || 20}%)
                          </strong>
                          <span className="text-base font-bold text-gold-400 mt-1 block">
                            {formatCurrency(depositAmount)}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMode("full_payment")}
                          className={`p-4 rounded-xl border text-left transition ${
                            paymentMode === "full_payment"
                              ? "border-gold-400 bg-gold-500/15"
                              : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                          }`}
                        >
                          <strong className="block text-white text-sm">
                            Pay Entire Stay in Full
                          </strong>
                          <span className="text-base font-bold text-white mt-1 block">
                            {formatCurrency(totalPrice)}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Method Selector */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                        Select Gateway
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div
                          onClick={() => setPaymentMethod("mpesa")}
                          className={`cursor-pointer p-4 rounded-xl border text-center transition ${
                            paymentMethod === "mpesa"
                              ? "border-gold-400 bg-gold-500/20 text-gold-300 font-bold"
                              : "border-slate-800 bg-slate-950/40 text-gray-300 hover:border-slate-700"
                          }`}
                        >
                          <FaMobileAlt className="text-2xl mx-auto mb-1 text-emerald-400" />
                          <div className="text-xs font-semibold">M-Pesa STK Push</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">Instant Mobile Prompt</div>
                        </div>

                        <div
                          onClick={() => setPaymentMethod("card")}
                          className={`cursor-pointer p-4 rounded-xl border text-center transition ${
                            paymentMethod === "card"
                              ? "border-gold-400 bg-gold-500/20 text-gold-300 font-bold"
                              : "border-slate-800 bg-slate-950/40 text-gray-300 hover:border-slate-700"
                          }`}
                        >
                          <FaCreditCard className="text-2xl mx-auto mb-1 text-blue-400" />
                          <div className="text-xs font-semibold">Credit / Debit Card</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">Flutterwave Secure</div>
                        </div>

                        <div
                          onClick={() => setPaymentMethod("cash")}
                          className={`cursor-pointer p-4 rounded-xl border text-center transition ${
                            paymentMethod === "cash"
                              ? "border-gold-400 bg-gold-500/20 text-gold-300 font-bold"
                              : "border-slate-800 bg-slate-950/40 text-gray-300 hover:border-slate-700"
                          }`}
                        >
                          <FaMoneyBillWave className="text-2xl mx-auto mb-1 text-amber-400" />
                          <div className="text-xs font-semibold">Pay at Front Desk</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">Cash / POS on Arrival</div>
                        </div>
                      </div>
                    </div>

                    {/* M-Pesa Phone field */}
                    {paymentMethod === "mpesa" && (
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider text-gray-300 font-semibold">
                          M-Pesa Phone Number for PIN Prompt
                        </label>
                        <input
                          type="tel"
                          className={inputClass}
                          placeholder="e.g. 0712345678 or 254712345678"
                          value={guestPhone}
                          onChange={(event) => setGuestPhone(event.target.value)}
                        />
                        <p className="text-[11px] text-gray-400">
                          A prompt will appear on this device to authorize{" "}
                          <strong className="text-gold-300">
                            {formatCurrency(paymentMode === "full_payment" ? totalPrice : depositAmount)}
                          </strong>.
                        </p>
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-gray-300 space-y-1">
                        <div className="flex items-center gap-2 text-blue-400 font-semibold">
                          <FaShieldAlt /> Secure 256-bit Encrypted Card Payment
                        </div>
                        <p className="text-gray-400">
                          Supports Visa, MasterCard, and American Express. The charge will be verified through the backend payment engine.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex justify-between border-t border-slate-800 pt-5">
          <button
            type="button"
            disabled={step === 0 || loading}
            onClick={() => setStep((current) => current - 1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-slate-800 disabled:opacity-30 transition"
          >
            <FaChevronLeft /> Back
          </button>

          {step < 2 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-sm transition shadow-luxury"
            >
              Continue <FaChevronRight />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting || loading}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-black font-bold text-sm uppercase tracking-wider transition shadow-luxury disabled:opacity-50 hover:scale-105"
            >
              {submitting ? (
                "Processing Reservation..."
              ) : (
                <>
                  <FaCheck /> Confirm & Complete Reservation
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default NewReservationModal;
