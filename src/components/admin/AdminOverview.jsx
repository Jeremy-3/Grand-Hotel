/* eslint-disable react/prop-types */
import { useMemo } from "react";
import AdminStatCard from "./AdminStatCard";
import { formatCurrency } from "../../utils/formatters";
import {
  FaBed, FaCalendarCheck, FaUsers, FaCreditCard, FaUserTie,
  FaChartLine, FaCheckCircle, FaTimesCircle, FaHourglass, FaMoneyBillWave,
} from "react-icons/fa";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/formatters";

const AdminOverview = ({ data, loading }) => {
  const stats = useMemo(() => {
    if (!data) return {};
    const rooms = data.rooms || [];
    const reservations = data.reservations || [];
    const guests = data.guests || [];
    const managers = data.managers || [];

    const availableRooms = rooms.filter((r) => r.room_availability === "available").length;
    const occupiedRooms = rooms.filter((r) => r.room_availability === "occupied").length;

    const confirmed = reservations.filter((r) => r.status === "confirmed").length;
    const pending = reservations.filter((r) => r.status === "pending").length;
    const checkedIn = reservations.filter((r) => r.status === "checked_in").length;
    const cancelled = reservations.filter((r) => r.status === "cancelled").length;

    const totalRevenue = reservations
      .filter((r) => ["confirmed", "checked_in", "checked_out"].includes(r.status))
      .reduce((sum, r) => sum + (r.total_amount || 0), 0);

    const depositCollected = reservations
      .filter((r) => ["confirmed", "checked_in", "checked_out"].includes(r.status))
      .reduce((sum, r) => sum + (r.deposit_amount || 0), 0);

    return {
      totalRooms: rooms.length,
      availableRooms,
      occupiedRooms,
      occupancyRate: rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0,
      totalReservations: reservations.length,
      confirmed,
      pending,
      checkedIn,
      cancelled,
      totalGuests: guests.length,
      totalManagers: managers.length,
      totalRevenue,
      depositCollected,
    };
  }, [data]);

  const recentReservations = useMemo(() => {
    return (data?.reservations || [])
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 6);
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-white">Hotel Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Live operational overview of Grand Hotel</p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard icon={FaBed} label="Total Rooms" value={stats.totalRooms} sub={`${stats.availableRooms} available · ${stats.occupiedRooms} occupied`} color="gold" />
        <AdminStatCard icon={FaChartLine} label="Occupancy Rate" value={`${stats.occupancyRate}%`} sub="Current occupancy" color="blue" trendUp={stats.occupancyRate > 60} trend={`${stats.occupancyRate}%`} />
        <AdminStatCard icon={FaMoneyBillWave} label="Total Revenue" value={formatCurrency(stats.totalRevenue)} sub="From confirmed stays" color="emerald" />
        <AdminStatCard icon={FaUsers} label="Registered Guests" value={stats.totalGuests} sub={`${stats.totalManagers} managers/staff`} color="violet" />
      </div>

      {/* Reservation Stats */}
      <div>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Reservation Breakdown</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard icon={FaHourglass} label="Pending" value={stats.pending} sub="Awaiting confirmation" color="amber" />
          <AdminStatCard icon={FaCheckCircle} label="Confirmed" value={stats.confirmed} sub="Ready to check in" color="emerald" />
          <AdminStatCard icon={FaCalendarCheck} label="Checked In" value={stats.checkedIn} sub="Currently staying" color="blue" />
          <AdminStatCard icon={FaTimesCircle} label="Cancelled" value={stats.cancelled} sub="Cancelled reservations" color="rose" />
        </div>
      </div>

      {/* Revenue Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdminStatCard icon={FaCreditCard} label="Deposits Collected" value={formatCurrency(stats.depositCollected)} sub="Upfront deposits paid" color="cyan" />
        <AdminStatCard icon={FaUserTie} label="Management Staff" value={stats.totalManagers} sub="Active managers & staff" color="slate" />
      </div>

      {/* Recent Reservations Table */}
      <div>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Recent Reservations</h2>
        <div className="rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guest</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-in</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentReservations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500 text-sm">
                      No reservations yet
                    </td>
                  </tr>
                ) : (
                  recentReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-4 py-3 text-gray-200 font-medium">
                        {res.guest?.user?.name || res.guest?.name || `Guest #${res.guest_id}`}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        Room {res.room?.room_number || res.room_id}
                        {res.room?.room_type?.name && (
                          <span className="ml-1 text-xs text-gray-500">({res.room.room_type.name})</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(res.check_in_date)}</td>
                      <td className="px-4 py-3 text-gold-400 font-mono font-semibold">
                        {formatCurrency(res.total_amount)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={res.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
