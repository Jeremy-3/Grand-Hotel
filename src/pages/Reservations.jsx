import { useEffect, useState } from "react";
import { reservationsApi } from "../api/reservations";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/common/StatusBadge";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Prompt from "../components/common/Prompt";
import NewReservationModal from "../components/reservations/NewReservationModal";
import PaymentModal from "../components/reservations/PaymentModal";
import {
  formatCurrency,
  formatDate,
  calculateNights,
} from "../utils/formatters";
import Swal from "sweetalert2";
import {
  FaCalendarCheck,
  FaPlus,
  FaCreditCard,
  FaTimesCircle,
  FaConciergeBell,
  FaBed,
} from "react-icons/fa";

const Reservations = () => {
  const { user, isAuthenticated, isStaffOrManager, hasPermission } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReservations();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      // If staff/manager, fetch all reservations, else fetch user's own reservations
      let res;
      if (isStaffOrManager && hasPermission("reservations.view_all")) {
        res = await reservationsApi.getReservations();
      } else if (hasPermission("reservations.view_own") && user?.guest_id) {
        res = await reservationsApi
          .getGuestReservations(user.guest_id)
          .catch(() => {
            return { data: [] };
          });
      } else {
        setReservations([]);
        return;
      }

      setReservations(res.data || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (resItem) => {
    const result = await Swal.fire({
      title: "Cancel Reservation?",
      text: `Are you sure you want to cancel the reservation for Room ${resItem.room?.room_number || resItem.room_id}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#334155",
      confirmButtonText: "Yes, Cancel Stay",
      background: "#0f172a",
      color: "#f8fafc",
    });

    if (result.isConfirmed) {
      try {
        await reservationsApi.cancelReservation(resItem.uid || resItem.id);
        Swal.fire({
          title: "Cancelled",
          text: "Your reservation has been cancelled.",
          icon: "success",
          timer: 1800,
          showConfirmButton: false,
          background: "#0f172a",
          color: "#f8fafc",
        });
        fetchReservations();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.message || "Could not cancel reservation.",
          icon: "error",
          background: "#0f172a",
          color: "#f8fafc",
        });
      }
    }
  };

  const handleOpenPayment = (resItem) => {
    setSelectedReservation(resItem);
    setIsPaymentOpen(true);
  };

  const filteredReservations = reservations.filter((item) => {
    if (statusFilter === "all") return true;
    return item.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title & CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-2">
              <FaConciergeBell />{" "}
              {isStaffOrManager ? "Management Portal" : "Guest Portal"}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              {isStaffOrManager ? "All Hotel Bookings" : "My Reservations"}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              View and manage confirmed bookings, deposit receipts, and check-in
              schedules.
            </p>
          </div>

          {isAuthenticated && (
            <button
              onClick={() => setIsNewBookingOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-black font-bold text-xs uppercase tracking-wider transition duration-200 shadow-luxury hover:scale-105"
            >
              <FaPlus /> Book New Stay
            </button>
          )}
        </div>

        {!isAuthenticated ? (
          <Prompt
            isAuthenticated={false}
            message="Please sign in to view your reservation history, deposit vouchers, and stay details."
          />
        ) : (
          <>
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
              {[
                "all",
                "pending",
                "confirmed",
                "checked_in",
                "checked_out",
                "cancelled",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                    statusFilter === tab
                      ? "bg-gold-500 text-black shadow-md"
                      : "bg-slate-900 border border-slate-800 text-gray-300 hover:bg-slate-800"
                  }`}
                >
                  {tab.replace("_", " ")}
                </button>
              ))}
            </div>

            {/* Content List */}
            {loading ? (
              <LoadingSpinner text="Retrieving booking records..." />
            ) : filteredReservations.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 max-w-lg mx-auto space-y-4">
                <FaCalendarCheck className="text-gold-400 text-5xl mx-auto opacity-60" />
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">
                    No Reservations Found
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {statusFilter !== "all"
                      ? `No reservations with status "${statusFilter}".`
                      : "You do not have any active room bookings."}
                  </p>
                </div>
                <button
                  onClick={() => setIsNewBookingOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-gold-500 text-black font-semibold text-xs uppercase tracking-wider hover:bg-gold-400 transition"
                >
                  Explore Suites & Book
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReservations.map((resItem) => {
                  const nights = calculateNights(
                    resItem.check_in_date,
                    resItem.check_out_date,
                  );
                  const totalPrice =
                    (resItem.room_price_per_night || 150) * nights;
                  const isPending = resItem.status?.toLowerCase() === "pending";
                  const isCancellable = ["pending", "confirmed"].includes(
                    resItem.status?.toLowerCase(),
                  );

                  return (
                    <div
                      key={resItem.id}
                      className="bg-slate-900 border border-slate-800 hover:border-gold-500/30 rounded-2xl p-5 sm:p-6 shadow-luxury transition duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                    >
                      {/* Left info: Room & Dates */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                        {resItem.room?.image ? (
                          <img
                            src={resItem.room.image}
                            alt="Room"
                            className="w-20 h-20 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-slate-800 flex items-center justify-center text-gold-400 flex-shrink-0">
                            <FaBed size={28} />
                          </div>
                        )}

                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-3">
                            <h3 className="font-serif text-lg font-bold text-white">
                              Room{" "}
                              {resItem.room?.room_number || resItem.room_id}
                            </h3>
                            <StatusBadge status={resItem.status} />
                          </div>

                          <div className="text-xs text-gray-300">
                            <span className="font-medium text-white">
                              {formatDate(resItem.check_in_date)}
                            </span>
                            <span className="text-gray-500 mx-1.5">→</span>
                            <span className="font-medium text-white">
                              {formatDate(resItem.check_out_date)}
                            </span>
                            <span className="text-gold-400 font-semibold ml-2">
                              ({nights} {nights === 1 ? "Night" : "Nights"})
                            </span>
                          </div>

                          {isStaffOrManager && resItem.guest?.user && (
                            <div className="text-xs text-gray-400">
                              Guest:{" "}
                              <strong className="text-gray-200">
                                {resItem.guest.user.name}
                              </strong>{" "}
                              ({resItem.guest.user.email})
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Middle: Financials */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y sm:border-y-0 sm:border-l sm:border-r border-slate-800 py-3 sm:py-0 sm:px-6">
                        <div>
                          <div className="text-[11px] text-gray-400 uppercase tracking-wider">
                            Nightly Rate
                          </div>
                          <div className="text-sm font-semibold text-white">
                            {formatCurrency(resItem.room_price_per_night)}
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] text-gray-400 uppercase tracking-wider">
                            Total Amount
                          </div>
                          <div className="text-sm font-bold text-white">
                            {formatCurrency(totalPrice)}
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] text-gray-400 uppercase tracking-wider">
                            Required Deposit
                          </div>
                          <div className="text-sm font-bold text-gold-400">
                            {formatCurrency(resItem.deposit_amount)} (
                            {resItem.deposit_percentage || 20}%)
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-3 self-end lg:self-center">
                        {isPending && (
                          <button
                            onClick={() => handleOpenPayment(resItem)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs tracking-wider uppercase transition shadow-md"
                          >
                            <FaCreditCard /> Pay Deposit
                          </button>
                        )}

                        {isCancellable && (
                          <button
                            onClick={() => handleCancel(resItem)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-medium text-xs transition"
                          >
                            <FaTimesCircle /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <NewReservationModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onSuccess={() => fetchReservations()}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        reservation={selectedReservation}
        onSuccess={() => fetchReservations()}
      />
    </div>
  );
};

export default Reservations;
