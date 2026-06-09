import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Order } from "../../services/api";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_COLORS: Record<string, string> = {
  pending:   "text-warm-yellow",
  paid:      "text-success",
  failed:    "text-crimson",
  refunded:  "text-silver",
  cancelled: "text-silver",
};

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = () => {
    setLoading(true);
    fetch(`${BASE}/api/orders`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-deep to-[#0f172a] text-white">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-silver text-sm mt-1">Admin — all transactions</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchOrders} className="rounded-xl border border-silver/20 px-4 py-2 text-sm text-silver hover:border-silver/40 transition-colors">
              ↻ Refresh
            </button>
            <button onClick={() => navigate("/")} className="rounded-xl border border-silver/20 px-4 py-2 text-sm text-silver hover:border-silver/40 transition-colors">
              ← Home
            </button>
          </div>
        </div>

        {/* Stats */}
        {orders.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(["pending","paid","failed","cancelled"] as const).map((s) => (
              <div key={s} className="rounded-xl border border-silver/20 bg-navy-card p-4 text-center">
                <div className={`text-2xl font-bold ${STATUS_COLORS[s]}`}>
                  {orders.filter((o) => o.status === s).length}
                </div>
                <div className="text-xs text-silver capitalize mt-1">{s}</div>
              </div>
            ))}
          </div>
        )}

        {loading && <div className="text-silver animate-pulse text-center py-10">Loading orders…</div>}
        {error && <div className="text-crimson text-sm">Error: {error}</div>}
        {!loading && orders.length === 0 && (
          <div className="text-center text-silver py-20 text-sm">No orders yet.</div>
        )}

        {orders.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-silver/20">
            <table className="w-full text-sm">
              <thead className="bg-navy-card text-silver text-xs uppercase tracking-wider">
                <tr>
                  {["Order ID","Items","Total","Gateway","Email","Status","Date"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-silver/10">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-navy-card/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-silver">{o.id}</td>
                    <td className="px-4 py-3">{o.items.map((i) => i.name).join(", ")}</td>
                    <td className="px-4 py-3 font-bold">{o.currency} {o.total.toLocaleString()}</td>
                    <td className="px-4 py-3 capitalize">{o.gateway || "—"}</td>
                    <td className="px-4 py-3 text-silver">{o.customerEmail || "—"}</td>
                    <td className={`px-4 py-3 font-semibold uppercase text-xs ${STATUS_COLORS[o.status]}`}>{o.status}</td>
                    <td className="px-4 py-3 text-silver text-xs">{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
