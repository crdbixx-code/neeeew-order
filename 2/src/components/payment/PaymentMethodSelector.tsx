import { useEffect, useState } from "react";
import { getPaymentMethods, type PaymentMethod } from "../../services/api";
import { cn } from "../../lib/utils";

const ICONS: Record<string, string> = {
  stripe:   "💳",
  jazzcash: "📱",
  alfalah:  "🏦",
  meezan:   "🏦",
};

interface Props {
  selected: string;
  onChange: (id: string) => void;
  currency?: string;
}

export default function PaymentMethodSelector({ selected, onChange, currency = "PKR" }: Props) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPaymentMethods()
      .then((r) => setMethods(r.methods.filter((m) => m.currencies.includes(currency))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currency]);

  if (loading) return <div className="text-silver text-sm animate-pulse">Loading payment methods…</div>;

  return (
    <div className="grid grid-cols-2 gap-3">
      {methods.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          className={cn(
            "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all",
            selected === m.id
              ? "border-crimson bg-navy-card text-white shadow-lg shadow-crimson/20"
              : "border-silver/20 bg-navy-card/50 text-silver hover:border-silver/40 hover:bg-navy-card"
          )}
        >
          <span className="text-2xl">{ICONS[m.id] ?? "💰"}</span>
          <div>
            <div className="text-sm font-semibold">{m.label}</div>
            <div className="text-xs opacity-60 capitalize">{m.type.replace("_", " ")}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
