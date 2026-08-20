/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import Modal from "../common/Modal";
import { reservationsApi } from "../../api/reservations";
import { roomsApi } from "../../api/rooms";
import { guestsApi } from "../../api/guests";
import { useAuth } from "../../context/AuthContext";
import { PAYMENT_METHODS } from "../../utils/constants";
import { calculateNights, formatCurrency } from "../../utils/formatters";
import Swal from "sweetalert2";
import {
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";

const steps = ["Booking guest", "Room & dates", "Payment"];
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
      if ((!selectedRoomId || !selectedRoomStillBookable) && firstBookableRoom)
        setSelectedRoomId(firstBookableRoom.id);
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
    setStep(0);
    setCheckInDate(checkIn);
    setNightsInput("");
    setCheckOutDate(addDays(checkIn, 3));
    setSelectedGuestId(canCreateGuests ? "new" : "self");
    setPaymentMode("deposit");
    setSkipPayment(false);
    if (initialRoomId) setSelectedRoomId(initialRoomId);
    loadData();
  }, [isOpen, initialRoomId]);

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
    if (step === 0 && selectedGuestId === "self" && !user?.guest_id)
      return "This account has no guest profile.";
    if (
      step === 0 &&
      selectedGuestId === "new" &&
      (!newGuest.name ||
        !newGuest.email ||
        !newGuest.phone_number ||
        !newGuest.password)
    )
      return "Complete the new guest details.";
    if (
      step === 1 &&
      (!selectedRoomId || !checkInDate || !checkOutDate || nights < 1)
    )
      return "Choose a room and valid stay dates.";
    if (step === 1 && new Date(checkOutDate) <= new Date(checkInDate))
      return "Check-out must be after check-in.";
    return null;
  };

  const goNext = () => {
    const error = validateStep();
    if (error)
      return Swal.fire({ title: "Almost there", text: error, icon: "warning" });
    setStep((current) => Math.min(2, current + 1));
  };

  const submitReservation = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      return Swal.fire({
        title: "Sign in required",
        text: "Please sign in before creating a reservation.",
        icon: "warning",
      });
    }
    const error = validateStep();
    if (error)
      return Swal.fire({
        title: "Check your booking",
        text: error,
        icon: "warning",
      });
    setSubmitting(true);
    try {
      let guestId =
        selectedGuestId === "self" ? user.guest_id : Number(selectedGuestId);
      if (selectedGuestId === "new")
        guestId = (await guestsApi.registerGuest(newGuest)).data.id;
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
      Swal.fire({
        title: "Reservation created",
        text: skipPayment
          ? "Payment is due within five days or the reservation will expire."
          : "The reservation is awaiting payment confirmation.",
        icon: "success",
        confirmButtonColor: "#cfa64b",
      });
      onClose();
      onSuccess?.(response.data);
    } catch (requestError) {
      Swal.fire({
        title: "Booking error",
        text: requestError.message,
        icon: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a reservation"
      maxWidth="max-w-6xl"
    >
      <form onSubmit={submitReservation} className="space-y-6">
        <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-2 rounded-2xl border border-slate-800">
          {steps.map((label, index) => (
            <button
              type="button"
              key={label}
              onClick={() => index <= step && setStep(index)}
              className={`rounded-xl px-3 py-3 text-left transition ${step === index ? "bg-gold-500 text-black" : index < step ? "text-gold-300" : "text-gray-500"}`}
            >
              <span className="block text-[10px] uppercase tracking-widest font-bold">
                Step {index + 1}
              </span>
              <span className="text-sm font-semibold">{label}</span>
            </button>
          ))}
        </div>
        {loading ? (
          <div className="py-20 text-center text-gold-300">
            Loading hotel inventory...
          </div>
        ) : (
          <>
            {step === 0 && (
              <section className="space-y-5 min-h-[360px]">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gold-400 font-bold">
                    Booking guest
                  </p>
                  <h3 className="font-serif text-2xl text-white mt-1">
                    Who is staying with us?
                  </h3>
                </div>
                {canCreateGuests && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedGuestId("new")}
                      className={`flex-1 rounded-xl border p-3 text-sm ${selectedGuestId === "new" ? "border-gold-400 bg-gold-500/15 text-gold-200" : "border-slate-700 text-gray-400"}`}
                    >
                      Add new guest
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedGuestId(
                          guests[0]?.id ? String(guests[0].id) : "self",
                        )
                      }
                      className={`flex-1 rounded-xl border p-3 text-sm ${selectedGuestId !== "new" ? "border-gold-400 bg-gold-500/15 text-gold-200" : "border-slate-700 text-gray-400"}`}
                    >
                      Select existing guest
                    </button>
                  </div>
                )}
                {selectedGuestId === "new" ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.keys(newGuest).map((field) => (
                      <input
                        key={field}
                        required
                        className={inputClass}
                        type={
                          field === "password"
                            ? "password"
                            : field === "email"
                              ? "email"
                              : "text"
                        }
                        placeholder={field.replace("_", " ")}
                        value={newGuest[field]}
                        onChange={(event) =>
                          setNewGuest({
                            ...newGuest,
                            [field]: event.target.value,
                          })
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        className={`${inputClass} pl-11`}
                        placeholder="Search name, email, or phone number"
                        value={guestSearch}
                        onChange={(event) => setGuestSearch(event.target.value)}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                      {filteredGuests.map((guest) => (
                        <button
                          type="button"
                          key={guest.id}
                          onClick={() => setSelectedGuestId(String(guest.id))}
                          className={`text-left p-4 rounded-xl border ${String(selectedGuestId) === String(guest.id) ? "border-gold-400 bg-gold-500/10" : "border-slate-800 bg-slate-950/60"}`}
                        >
                          <strong className="block text-white">
                            {guest.user?.name}
                          </strong>
                          <span className="text-xs text-gray-400">
                            {guest.user?.email} · {guest.user?.phone_number}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}
            {step === 1 && (
              <section className="space-y-5 min-h-[360px]">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gold-400 font-bold">
                    Room & dates
                  </p>
                  <h3 className="font-serif text-2xl text-white mt-1">
                    Shape the stay
                  </h3>
                </div>
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    className={`${inputClass} pl-11`}
                    placeholder="Search by room number or room type"
                    value={roomSearch}
                    onChange={(event) => setRoomSearch(event.target.value)}
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-1">
                  {filteredRooms.map((room) => (
                    <button
                      type="button"
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`text-left p-3 rounded-xl border ${String(selectedRoomId) === String(room.id) ? "border-gold-400 bg-gold-500/10" : "border-slate-800 bg-slate-950/60"}`}
                    >
                      <strong className="block text-white">
                        Room {room.room_number}
                      </strong>
                      <span className="text-xs text-gold-300">
                        {roomTypes[room.room_type_id]?.name}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {formatCurrency(
                          roomTypes[room.room_type_id]?.price_per_night || 0,
                        )}{" "}
                        / night
                      </span>
                    </button>
                  ))}
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <label className="text-xs text-gray-400">
                    Check in
                    <input
                      required
                      type="date"
                      className={`${inputClass} mt-2`}
                      value={checkInDate}
                      onChange={(event) => updateCheckIn(event.target.value)}
                    />
                  </label>
                  <label className="text-xs text-gray-400">
                    Nights
                    <input
                      type="number"
                      min="1"
                      className={`${inputClass} mt-2`}
                      value={nightsInput}
                      onChange={(event) => updateNights(event.target.value)}
                      placeholder={calculatedNights || "e.g. 3"}
                    />
                  </label>
                  <label className="text-xs text-gray-400">
                    Check out
                    <input
                      required
                      type="date"
                      className={`${inputClass} mt-2`}
                      value={checkOutDate}
                      onChange={(event) => updateCheckOut(event.target.value)}
                    />
                  </label>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gold-500/10 border border-gold-500/20 p-4">
                  <span className="text-sm text-gray-300">Estimated stay</span>
                  <strong className="text-gold-300">
                    {nights || 0} nights · {formatCurrency(totalPrice)}
                  </strong>
                </div>
              </section>
            )}
            {step === 2 && (
              <section className="space-y-5 min-h-[360px]">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gold-400 font-bold">
                    Payment
                  </p>
                  <h3 className="font-serif text-2xl text-white mt-1">
                    Settle now or hold the booking
                  </h3>
                </div>
                <label className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <input
                    type="checkbox"
                    checked={skipPayment}
                    onChange={(event) => setSkipPayment(event.target.checked)}
                    className="mt-1 accent-yellow-500"
                  />
                  <span>
                    <strong className="block text-white">
                      Skip payment for now
                    </strong>
                    <span className="text-xs text-gray-400">
                      Deposit payment is due within five days, otherwise this
                      reservation expires.
                    </span>
                  </span>
                </label>
                {!skipPayment && (
                  <>
                    <div className="grid md:grid-cols-2 gap-3">
                      {["deposit", "full_payment"].map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setPaymentMode(type)}
                          className={`p-4 rounded-xl border text-left ${paymentMode === type ? "border-gold-400 bg-gold-500/10" : "border-slate-800"}`}
                        >
                          <strong className="block text-white">
                            {type === "deposit" ? "Pay deposit" : "Pay in full"}
                          </strong>
                          <span className="text-xs text-gray-400">
                            {formatCurrency(
                              type === "deposit" ? depositAmount : totalPrice,
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      {PAYMENT_METHODS.map((method) => (
                        <button
                          type="button"
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-3 rounded-xl border text-sm ${paymentMethod === method.id ? "border-gold-400 text-gold-200" : "border-slate-800 text-gray-400"}`}
                        >
                          {method.name}
                        </button>
                      ))}
                    </div>
                    {paymentMethod === "mpesa" && (
                      <input
                        className={inputClass}
                        placeholder="M-Pesa phone number"
                        value={guestPhone}
                        onChange={(event) => setGuestPhone(event.target.value)}
                      />
                    )}
                  </>
                )}
              </section>
            )}
          </>
        )}
        <div className="flex justify-between border-t border-slate-800 pt-5">
          <button
            type="button"
            disabled={step === 0 || loading}
            onClick={() => setStep((current) => current - 1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-slate-800 disabled:opacity-30"
          >
            <FaChevronLeft /> Back
          </button>
          {step < 2 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-black font-bold text-sm"
            >
              Continue <FaChevronRight />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting || loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-black font-bold text-sm disabled:opacity-50"
            >
              {submitting ? (
                "Creating..."
              ) : (
                <>
                  <FaCheck /> Create reservation
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
