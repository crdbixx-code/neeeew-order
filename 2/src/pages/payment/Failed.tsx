import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const code = params.get("code");
  const gateway = params.get("gateway");
  const reason = params.get("reason");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-navy-deep to-[#0f172a] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-crimson/30 bg-navy-card p-8 text-center space-y-6 shadow-2xl">
        <div className="text-6xl">❌</div>
        <div>
          <h1 className="text-2xl font-bold text-white">Payment Failed</h1>
          <p className="text-silver mt-2 text-sm">
            Something went wrong with your payment. No money has been charged.
          </p>
        </div>
        {(code || reason) && (
          <div className="rounded-xl bg-navy-surface/50 p-4 text-sm space-y-2 text-left">
            {gateway && (
              <div className="flex justify-between">
                <span className="text-silver">Gateway</span>
                <span className="capitalize text-white">{gateway}</span>
              </div>
            )}
            {code && (
              <div className="flex justify-between">
                <span className="text-silver">Error Code</span>
                <span className="font-mono text-crimson">{code}</span>
              </div>
            )}
            {reason && (
              <div className="flex justify-between">
                <span className="text-silver">Reason</span>
                <span className="text-crimson capitalize">{reason.replace(/_/g, " ")}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="flex-1 rounded-xl bg-gradient-primary py-3 font-bold text-white hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 rounded-xl border border-silver/20 py-3 font-semibold text-silver hover:border-silver/40 transition-colors"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
