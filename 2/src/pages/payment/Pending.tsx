import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentPending() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const gateway = params.get("gateway");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-navy-deep to-[#0f172a] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-warm-yellow/30 bg-navy-card p-8 text-center space-y-6 shadow-2xl">
        <div className="text-6xl">⏳</div>
        <div>
          <h1 className="text-2xl font-bold text-white">Payment Pending</h1>
          <p className="text-silver mt-2 text-sm">
            {gateway === "jazzcash"
              ? "Check your JazzCash app to approve the payment request."
              : "We're waiting for your bank transfer to be confirmed."}
          </p>
        </div>
        {orderId && (
          <div className="rounded-xl bg-navy-surface/50 p-4 text-sm space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-silver">Order ID</span>
              <span className="font-mono text-white text-xs">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-silver">Gateway</span>
              <span className="capitalize text-white">{gateway || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-silver">Status</span>
              <span className="text-warm-yellow font-semibold">PENDING</span>
            </div>
          </div>
        )}
        <p className="text-xs text-silver/60">
          You'll receive a confirmation email once the payment is verified. Keep your Order ID for reference.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full rounded-xl border border-silver/20 py-3 font-semibold text-silver hover:border-silver/40 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
