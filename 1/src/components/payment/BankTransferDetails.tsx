import type { BankDetails } from "../../services/api";

interface Props {
  bank: BankDetails & { bank?: string; iban?: string; accountNumber?: string; accountTitle?: string };
  amount: number;
  orderId: string;
}

export default function BankTransferDetails({ bank, amount, orderId }: Props) {
  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="rounded-xl border border-silver/20 bg-navy-card p-5 space-y-4">
      <div className="flex items-center gap-2 text-warm-yellow font-semibold">
        <span>🏦</span>
        <span>{bank.bank} — Bank Transfer</span>
      </div>
      <p className="text-silver text-sm">
        Transfer <strong className="text-white">PKR {amount.toLocaleString()}</strong> to the account below,
        then send us your payment screenshot.
      </p>
      <div className="space-y-3 text-sm">
        {bank.iban && (
          <Row label="IBAN" value={bank.iban} onCopy={() => copy(bank.iban!)} />
        )}
        {bank.accountNumber && (
          <Row label="Account No" value={bank.accountNumber} onCopy={() => copy(bank.accountNumber!)} />
        )}
        {bank.accountTitle && (
          <Row label="Account Title" value={bank.accountTitle} onCopy={() => copy(bank.accountTitle!)} />
        )}
        <Row label="Reference / Order ID" value={orderId} onCopy={() => copy(orderId)} highlight />
      </div>
      <p className="text-xs text-silver/60">
        ⚠️ Always include your Order ID as the payment reference so we can identify your transfer.
      </p>
    </div>
  );
}

function Row({ label, value, onCopy, highlight }: {
  label: string; value: string; onCopy: () => void; highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-navy-surface/50 px-3 py-2">
      <div>
        <div className="text-xs text-silver/60">{label}</div>
        <div className={highlight ? "font-bold text-crimson" : "text-white font-medium"}>{value}</div>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="shrink-0 rounded-md px-2 py-1 text-xs text-silver hover:bg-silver/10 transition-colors"
      >
        Copy
      </button>
    </div>
  );
}
