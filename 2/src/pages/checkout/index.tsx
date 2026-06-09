import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentMethodSelector from "../../components/payment/PaymentMethodSelector";
import BankTransferDetails from "../../components/payment/BankTransferDetails";
import {
  createOrder,
  createStripeCheckout,
  initiateJazzcash,
  initiateAlfalah,
  initiateMeezan,
  type BankDetails,
} from "../../services/api";

// Demo cart items — in a real app these come from cart state / route params
const DEMO_ITEMS = [
  { name: "PlayBeat Pro Plan", price: 999, quantity: 1 },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [gateway, setGateway] = useState("stripe");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bankDetails, setBankDetails] = useState<(BankDetails & { bank?: string; amount?: number; orderId?: string }) | null>(null);

  const total = DEMO_ITEMS.reduce((s, i) => s + i.price * i.quantity, 0);

  const handlePay = async () => {
    setError("");
    setLoading(true);
    try {
      // 1. Create order on backend
      const { order } = await createOrder({
        items: DEMO_ITEMS,
        customerEmail: email || undefined,
        gateway,
      });

      // 2. Route to chosen gateway
      if (gateway === "stripe") {
        const { url } = await createStripeCheckout({
          items: DEMO_ITEMS.map((i) => ({ ...i, images: [] })),
          orderId: order.id,
          customerEmail: email || undefined,
        });
        window.location.href = url; // redirect to Stripe hosted page
        return;
      }

      if (gateway === "jazzcash") {
        await initiateJazzcash({ amount: total, orderId: order.id, mobileNumber: mobile || undefined });
        navigate(`/payment/pending?orderId=${order.id}&gateway=jazzcash`);
        return;
      }

      if (gateway === "alfalah") {
        const res = await initiateAlfalah({ amount: total, orderId: order.id });
        setBankDetails({ ...res.bankDetails, bank: "Bank Alfalah", amount: total, orderId: order.id });
        return;
      }

      if (gateway === "meezan") {
        const res = await initiateMeezan({ amount: total, orderId: order.id });
        if (res.bankDetails) {
          setBankDetails({ ...res.bankDetails, bank: "Meezan Bank", amount: total, orderId: order.id });
        }
        return;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-deep to-[#0f172a] text-white">
      <div className="mx-auto max-w-lg px-4 py-10 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
          <p className="text-silver text-sm mt-1">Complete your purchase securely</p>
        </div>

        {/* Order Summary */}
        <div className="rounded-xl border border-silver/20 bg-navy-card p-5 space-y-3">
          <h2 className="font-semibold text-white">Order Summary</h2>
          {DEMO_ITEMS.map((item) => (
            <div key={item.name} className="flex justify-between text-sm">
              <span className="text-silver">{item.name} × {item.quantity}</span>
              <span className="text-white font-medium">PKR {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-silver/20 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-crimson">PKR {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm text-silver">Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-silver/20 bg-navy-card px-4 py-3 text-white placeholder-silver/40 outline-none focus:border-crimson transition-colors"
          />
        </div>

        {/* JazzCash mobile number */}
        {gateway === "jazzcash" && (
          <div className="space-y-2">
            <label className="text-sm text-silver">JazzCash Mobile Number</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="03xxxxxxxxx"
              className="w-full rounded-xl border border-silver/20 bg-navy-card px-4 py-3 text-white placeholder-silver/40 outline-none focus:border-crimson transition-colors"
            />
          </div>
        )}

        {/* Payment Method */}
        <div className="space-y-3">
          <h2 className="font-semibold text-white">Payment Method</h2>
          <PaymentMethodSelector selected={gateway} onChange={setGateway} currency="PKR" />
        </div>

        {/* Bank Transfer Details */}
        {bankDetails && (
          <BankTransferDetails
            bank={bankDetails}
            amount={bankDetails.amount!}
            orderId={bankDetails.orderId!}
          />
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-crimson">
            ⚠️ {error}
          </div>
        )}

        {/* Pay Button */}
        {!bankDetails && (
          <button
            type="button"
            onClick={handlePay}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-primary py-4 font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing…" : `Pay PKR ${total.toLocaleString()} via ${gateway.charAt(0).toUpperCase() + gateway.slice(1)}`}
          </button>
        )}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full text-center text-sm text-silver hover:text-white transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
