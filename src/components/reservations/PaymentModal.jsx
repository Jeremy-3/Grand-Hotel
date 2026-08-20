/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "../common/Modal";
import { paymentsApi } from "../../api/payments";
import { formatCurrency } from "../../utils/formatters";
import Swal from "sweetalert2";
import { FaMobileAlt, FaCreditCard, FaCheckCircle } from "react-icons/fa";

const PaymentModal = ({ isOpen, onClose, reservation, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phone, setPhone] = useState(
    reservation?.guest?.user?.phone_number || "",
  );
  const [loading, setLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  if (!reservation) return null;

  const pendingPayment = reservation.payments?.find(
    (payment) => payment.payment_status === "pending",
  );
  const paymentType = pendingPayment?.payment_type || "deposit";
  const payableAmount =
    pendingPayment?.amount ||
    (paymentType === "full_payment"
      ? reservation.total_amount
      : reservation.deposit_amount) ||
    50;

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (paymentMethod === "mpesa") {
        const payload = {
          reservation_id: reservation.id,
          amount: payableAmount,
          payment_type: paymentType,
          payment_method: "mpesa",
          phone: phone,
          payment_status: "pending",
        };

        const paymentRecord =
          pendingPayment || (await paymentsApi.createPayment(payload)).data;

        // Automatically simulate / confirm payment for demonstration or trigger STK
        if (paymentRecord?.uid) {
          await paymentsApi.confirmPayment(paymentRecord.uid, {
            mpesa_receipt: `MPESA-${Date.now().toString().slice(-6)}`,
          });
        }

        setPaymentDone(true);
        Swal.fire({
          title: "Deposit Received!",
          text: `Payment of ${formatCurrency(payableAmount)} confirmed successfully. Reservation is now confirmed.`,
          icon: "success",
          confirmButtonColor: "#cfa64b",
          background: "#0f172a",
          color: "#f8fafc",
        });

        if (onSuccess) onSuccess();
      } else if (paymentMethod === "card") {
        const payload = {
          reservation_id: reservation.id,
          amount: payableAmount,
          payment_type: paymentType,
          payment_method: "card",
          payment_status: "pending",
        };

        const paymentRecord =
          pendingPayment || (await paymentsApi.createPayment(payload)).data;
        if (paymentRecord?.uid) {
          await paymentsApi.confirmPayment(paymentRecord.uid, {
            tx_ref: `FLW-${Date.now().toString().slice(-6)}`,
          });
        }

        setPaymentDone(true);
        Swal.fire({
          title: "Card Payment Successful!",
          text: `Payment of ${formatCurrency(payableAmount)} verified.`,
          icon: "success",
          confirmButtonColor: "#cfa64b",
          background: "#0f172a",
          color: "#f8fafc",
        });

        if (onSuccess) onSuccess();
      }
    } catch (error) {
      Swal.fire({
        title: "Payment Error",
        text: error.message || "Payment could not be processed.",
        icon: "error",
        background: "#0f172a",
        color: "#f8fafc",
        confirmButtonColor: "#cfa64b",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Deposit Payment"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        {/* Reservation summary */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Reservation Reference</span>
            <span className="font-mono text-gray-200">
              #RES-{reservation.id}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Room</span>
            <span className="text-gray-200 font-medium">
              Room {reservation.room?.room_number || reservation.room_id}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Nightly Rate</span>
            <span className="text-gray-200">
              {formatCurrency(reservation.room_price_per_night)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-gold-400 pt-2 border-t border-slate-800">
            <span>Deposit Payable</span>
            <span>{formatCurrency(payableAmount)}</span>
          </div>
        </div>

        {paymentDone ? (
          <div className="text-center py-6 space-y-3">
            <FaCheckCircle className="text-emerald-400 text-5xl mx-auto" />
            <h4 className="font-serif text-xl font-bold text-white">
              Payment Confirmed!
            </h4>
            <p className="text-sm text-gray-400">
              Your reservation has been confirmed by Grand Hotel.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-gold-500 text-black font-semibold text-sm hover:bg-gold-400 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-5">
            {/* Method selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Select Gateway
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentMethod("mpesa")}
                  className={`cursor-pointer p-3.5 rounded-xl border text-center transition ${
                    paymentMethod === "mpesa"
                      ? "bg-gold-500/20 border-gold-500 text-gold-300 font-bold"
                      : "bg-slate-800/40 border-slate-700/60 text-gray-300"
                  }`}
                >
                  <FaMobileAlt className="text-2xl mx-auto mb-1 text-emerald-400" />
                  <span className="text-xs">M-Pesa STK</span>
                </div>

                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`cursor-pointer p-3.5 rounded-xl border text-center transition ${
                    paymentMethod === "card"
                      ? "bg-gold-500/20 border-gold-500 text-gold-300 font-bold"
                      : "bg-slate-800/40 border-slate-700/60 text-gray-300"
                  }`}
                >
                  <FaCreditCard className="text-2xl mx-auto mb-1 text-blue-400" />
                  <span className="text-xs">Card / Flutterwave</span>
                </div>
              </div>
            </div>

            {paymentMethod === "mpesa" && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  M-Pesa Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712345678"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/60"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-sm tracking-wider uppercase transition shadow-luxury ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading
                ? "Authorizing Payment..."
                : `Pay ${formatCurrency(payableAmount)} Now`}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;
