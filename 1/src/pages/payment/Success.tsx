import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getOrder, getStripeSession, updateOrderStatus, type Order } from "../../services/api";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = params.get("session_id");
    const txn = params.get("txn");
    const orderId = params.get("orderId");
    const gateway = params.get("gateway");

    const confirmPayment = async () => {
      try {
        if (sessionId) {
          // Stripe — retrieve session and update order
          const { session } = await getStripeSession(sessionId) as { session: { metadata?: { orderId?: string }; payment_status: string } };
          const sid = (session as { metadata?: { orderId?: string } }).metadata?.orderId;
          if (sid) {
            const { order: o } = await updateOrderStatus(sid, { status: "paid", txnRef: sessionId, gateway: "stripe" });
            setOrder(o);
          }
        } else if (orderId) {
          // Other gateways — update order status
          const { order: o } = await updateOrderStatus(orderId, {
            status: "paid",
            txnRef: txn || undefined,
            gateway: gateway || undefined,
          });
          setOrder(o);
        }
      } catch (err) {
        console.error("Could not confirm order:", err);
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [params]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-navy-deep to-[#0f172a]">
        <div className="text-silver animate-pulse">Confirming payment…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-navy-deep to-[#0f172a] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-success/30 bg-navy-card p-8 text-center space-y-6 shadow-2xl">
        <div className="text-6xl">🎉</div>
        <div>
          <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
          <p className="text-silver mt-2 text-sm">
            Congratulations — your purchase is complete.
          </p>
        </div>
        {order && (
          <div className="rounded-xl bg-navy-surface/50 p-4 text-sm space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-silver">Order ID</span>
              <span className="font-mono text-white text-xs">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-silver">Amount</span>
              <span className="font-bold text-success">{order.currency} {order.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-silver">Gateway</span>
              <span className="capitalize text-white">{order.gateway || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-silver">Status</span>
              <span className="text-success font-semibold uppercase">{order.status}</span>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full rounded-xl bg-gradient-primary py-3 font-bold text-white hover:opacity-90 transition-opacity"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
