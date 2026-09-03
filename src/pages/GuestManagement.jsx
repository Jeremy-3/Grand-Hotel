import { useEffect, useState } from "react";
import { guestsApi } from "../api/guests";
import { reservationsApi } from "../api/reservations";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Prompt from "../components/common/Prompt";
import { formatKenyanPhone, formatDate } from "../utils/formatters";
import Swal from "sweetalert2";
import {
  FaUserFriends,
  FaSearch,
  FaUserShield,
  FaCheck,
  FaBan,
} from "react-icons/fa";

const GuestManagement = () => {
  const { isAuthenticated, isStaffOrManager } = useAuth();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isAuthenticated && isStaffOrManager) {
      fetchGuests();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isStaffOrManager]);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const [guestResponse, reservationResponse] = await Promise.all([
        guestsApi.getGuests({ limit: 100 }),
        reservationsApi.getReservations({ limit: 100 }),
      ]);
      const reservations = reservationResponse.data || [];
      setGuests(
        (guestResponse.data || []).map((guest) => {
          const guestReservations = reservations.filter(
            (reservation) => reservation.guest_id === guest.id,
          );
          const total = guestReservations.reduce(
            (sum, reservation) => sum + Number(reservation.total_amount || 0),
            0,
          );
          const paid = guestReservations.reduce(
            (sum, reservation) =>
              sum +
              (reservation.payments || [])
                .filter((payment) => payment.payment_status === "paid")
                .reduce(
                  (paymentSum, payment) =>
                    paymentSum + Number(payment.amount || 0),
                  0,
                ),
            0,
          );
          const dueDate = guestReservations
            .filter((reservation) => reservation.status === "pending")
            .map((reservation) => new Date(reservation.payment_due_at))
            .sort((a, b) => a - b)[0];
          return {
            ...guest,
            financials: {
              total,
              paid,
              balance: Math.max(0, total - paid),
              dueDate,
            },
          };
        }),
      );
    } catch (error) {
      console.error("Error fetching guests:", error);
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (guest) => {
    const nextStatus = guest.status === "active" ? "inactive" : "active";
    try {
      await guestsApi.updateGuest(guest.uid, { status: nextStatus });
      Swal.fire({
        title: "Status Updated",
        text: `Guest profile marked as ${nextStatus}.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#f8fafc",
      });
      fetchGuests();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Could not update guest status.",
        icon: "error",
        background: "#0f172a",
        color: "#f8fafc",
      });
    }
  };

  if (!isAuthenticated || !isStaffOrManager) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-100 pt-28 pb-20">
        <div className="container mx-auto px-4 text-center">
          <Prompt
            isAuthenticated={false}
            message="This section is strictly reserved for Grand Hotel Managers and Front Desk Staff."
          />
        </div>
      </div>
    );
  }

  const filteredGuests = guests.filter((g) => {
    const q = searchTerm.toLowerCase();
    const name = g.user?.name?.toLowerCase() || "";
    const email = g.user?.email?.toLowerCase() || "";
    const phone = g.user?.phone_number || "";
    return name.includes(q) || email.includes(q) || phone.includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-2">
              <FaUserShield /> Hotel Staff Management
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Guest Profiles Directory
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Search, verify, and manage registered hotel guests and room
              accounts.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/60 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Table / List */}
        {loading ? (
          <LoadingSpinner text="Loading guest profiles..." />
        ) : filteredGuests.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 max-w-lg mx-auto">
            <FaUserFriends className="text-gold-400 text-5xl mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl font-bold text-white">
              No Guests Found
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              No registered guests match your search query.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-luxury overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-xs uppercase tracking-wider text-gold-400 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Guest Info</th>
                    <th className="px-6 py-4">Contact Phone</th>
                    <th className="px-6 py-4">Account Status</th>
                    <th className="px-6 py-4">Paid / Balance</th>
                    <th className="px-6 py-4">Payment Due</th>
                    <th className="px-6 py-4">Member Since</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredGuests.map((guest) => {
                    const isActive = guest.status === "active";
                    const dueDate = guest.financials?.dueDate;
                    const daysUntilDue = dueDate
                      ? Math.ceil((dueDate - new Date()) / 86400000)
                      : null;
                    const paymentUrgent =
                      daysUntilDue !== null && daysUntilDue <= 2;
                    return (
                      <tr
                        key={guest.id}
                        className="hover:bg-slate-800/40 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400 font-bold flex items-center justify-center text-sm">
                              {guest.user?.name?.charAt(0) || "G"}
                            </div>
                            <div>
                              <div className="font-semibold text-white">
                                {guest.user?.name || "Guest User"}
                              </div>
                              <div className="text-xs text-gray-400">
                                {guest.user?.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 font-mono text-xs">
                          {formatKenyanPhone(guest.user?.phone_number) || "N/A"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              isActive
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-gray-500/10 text-gray-400 border-gray-500/30"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? "bg-emerald-400" : "bg-gray-400"
                              }`}
                            />
                            {guest.status?.toUpperCase() || "ACTIVE"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-xs">
                          <span className="text-emerald-400">
                            Paid {guest.financials?.paid || 0}
                          </span>
                          <span className="block text-amber-300">
                            Balance {guest.financials?.balance || 0}
                          </span>
                        </td>

                        <td
                          className={`px-6 py-4 text-xs font-semibold ${paymentUrgent ? "text-rose-400" : "text-gray-400"}`}
                        >
                          {dueDate
                            ? daysUntilDue <= 0
                              ? "Expired"
                              : `${daysUntilDue} days left`
                            : "No pending payment"}
                        </td>

                        <td className="px-6 py-4 text-xs text-gray-400">
                          {formatDate(
                            guest.created_at || guest.user?.created_at,
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleToggleStatus(guest)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                              isActive
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                            }`}
                          >
                            {isActive ? (
                              <>
                                <FaBan size={10} /> Deactivate
                              </>
                            ) : (
                              <>
                                <FaCheck size={10} /> Activate
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestManagement;
