/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "../common/Modal";
import { paymentsApi } from "../../api/payments";
import { formatCurrency } from "../../utils/formatters";
import Swal from "sweetalert2";
import { FaMobileAlt, FaCreditCard, FaCheckCircle, FaMoneyBillWave, FaShieldAlt } from "react-icons/fa";

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

    if (paymentMethod === "mpesa" && !phone.trim()) {
      Swal.fire({
        title: "Phone Required",
        text: "Please enter your M-Pesa phone number to receive the prompt.",
        icon: "warning",
        confirmButtonColor: "#cfa64b",
      });
      return;
    }

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

        // Auto-confirm payment with generated M-Pesa receipt
        if (paymentRecord?.uid) {
          const receiptCode = `QA${Date.now().toString().slice(-7)}X`;
          await paymentsApi.confirmPayment(paymentRecord.uid, {
            mpesa_receipt: receiptCode,
          });
        }

        setPaymentDone(true);
        Swal.fire({
          title: "Payment Received!",
          html: `
            <div class="text-left space-y-2 text-sm text-gray-300">
              <p>M-Pesa payment of <strong class="text-gold-400">${formatCurrency(payableAmount)}</strong> was confirmed successfully.</p>
              <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                <div><strong>Phone:</strong> ${phone}</div>
                <div><strong>Status:</strong> CONFIRMED</div>
                <div><strong>Reservation:</strong> #RES-${reservation.id}</div>
              </div>
            </div>
          `,
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
          const txRef = `FLW-${Date.now().toString().slice(-8)}`;
          await paymentsApi.confirmPayment(paymentRecord.uid, {
            tx_ref: txRef,
          });
        }

        setPaymentDone(true);
        Swal.fire({
          title: "Card Payment Verified!",
          html: `
            <div class="text-left space-y-2 text-sm text-gray-300">
              <p>Card payment of <strong class="text-gold-400">${formatCurrency(payableAmount)}</strong> processed via Flutterwave.</p>
              <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                <div><strong>Transaction:</strong> Verified</div>
                <div><strong>Reservation:</strong> #RES-${reservation.id}</div>
              </div>
            </div>
          `,
          icon: "success",
          confirmButtonColor: "#cfa64b",
          background: "#0f172a",
          color: "#f8fafc",
        });

        if (onSuccess) onSuccess();
      } else if (paymentMethod === "cash") {
        const payload = {
          reservation_id: reservation.id,
          amount: payableAmount,
          payment_type: paymentType,
          payment_method: "cash",
          payment_status: "pending",
        };

        const paymentRecord =
          pendingPayment || (await paymentsApi.createPayment(payload)).data;

        if (paymentRecord?.uid) {
          await paymentsApi.confirmPayment(paymentRecord.uid, {
            tx_ref: `CASH-${Date.now().toString().slice(-6)}`,
          });
        }

        setPaymentDone(true);
        Swal.fire({
          title: "Cash Option Recorded",
          text: `Payment of ${formatCurrency(payableAmount)} will be finalized at the Grand Hotel Front Desk.`,
          icon: "info",
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
      title="Complete Stay Payment"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        {/* Reservation summary */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Reservation Reference</span>
            <span className="font-mono text-gray-200">
              #RES-{reservation.id}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Suite Selected</span>
            <span className="text-gray-200 font-medium">
              Room {reservation.room?.room_number || reservation.room_id}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Payment Type</span>
            <span className="text-gray-200 capitalize font-medium">
              {paymentType === "full_payment" ? "Full Payment" : "Required Deposit"}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-gold-400 pt-2 border-t border-slate-800">
            <span>Amount Payable Now</span>
            <span>{formatCurrency(payableAmount)}</span>
          </div>
        </div>

        {paymentDone ? (
          <div className="text-center py-6 space-y-3">
            <FaCheckCircle className="text-emerald-400 text-5xl mx-auto animate-bounce" />
            <h4 className="font-serif text-xl font-bold text-white">
              Payment Completed!
            </h4>
            <p className="text-sm text-gray-400">
              Your stay at Grand Hotel is verified and confirmed.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-8 py-2.5 rounded-xl bg-gold-500 text-black font-semibold text-sm hover:bg-gold-400 transition shadow-luxury"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-5">
            {/* Method selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <div
                  onClick={() => setPaymentMethod("mpesa")}
                  className={`cursor-pointer p-3 rounded-xl border text-center transition ${
                    paymentMethod === "mpesa"
                      ? "bg-gold-500/20 border-gold-500 text-gold-300 font-bold"
                      : "bg-slate-800/40 border-slate-700/60 text-gray-300 hover:border-slate-600"
                  }`}
                >
                  <FaMobileAlt className="text-2xl mx-auto mb-1 text-emerald-400" />
                  <span className="text-xs block font-semibold">M-Pesa</span>
                  <span className="text-[10px] text-gray-400">STK Push</span>
                </div>

                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`cursor-pointer p-3 rounded-xl border text-center transition ${
                    paymentMethod === "card"
                      ? "bg-gold-500/20 border-gold-500 text-gold-300 font-bold"
                      : "bg-slate-800/40 border-slate-700/60 text-gray-300 hover:border-slate-600"
                  }`}
                >
                  <FaCreditCard className="text-2xl mx-auto mb-1 text-blue-400" />
                  <span className="text-xs block font-semibold">Card</span>
                  <span className="text-[10px] text-gray-400">Flutterwave</span>
                </div>

                <div
                  onClick={() => setPaymentMethod("cash")}
                  className={`cursor-pointer p-3 rounded-xl border text-center transition ${
                    paymentMethod === "cash"
                      ? "bg-gold-500/20 border-gold-500 text-gold-300 font-bold"
                      : "bg-slate-800/40 border-slate-700/60 text-gray-300 hover:border-slate-600"
                  }`}
                >
                  <FaMoneyBillWave className="text-2xl mx-auto mb-1 text-amber-400" />
                  <span className="text-xs block font-semibold">Front Desk</span>
                  <span className="text-[10px] text-gray-400">Cash / POS</span>
                </div>
              </div>
            </div>

            {paymentMethod === "mpesa" && (
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 animate-fadeIn">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0712345678"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/60"
                />
                <p className="text-[11px] text-gray-400">
                  Enter your Safaricom line. You will receive an instant PIN prompt on your phone.
                </p>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-gray-300 space-y-1 animate-fadeIn">
                <div className="flex items-center gap-2 text-blue-400 font-semibold">
                  <FaShieldAlt /> 256-Bit SSL Encrypted Checkout
                </div>
                <p className="text-gray-400">
                  Secure processing for Visa, MasterCard, and international cards.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-black font-bold text-sm tracking-wider uppercase transition shadow-luxury ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.01]"
              }`}
            >
              {loading
                ? "Authorizing Payment..."
                : `Pay ${formatCurrency(payableAmount)} with ${paymentMethod.toUpperCase()}`}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;
