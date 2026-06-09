const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
  return data as T;
}

// ─── Orders ──────────────────────────────────────────────
export const createOrder = (body: {
  items: { name: string; price: number; quantity: number }[];
  customerEmail?: string;
  customerName?: string;
  gateway?: string;
}) => request<{ success: boolean; order: Order }>("/api/orders", { method: "POST", body: JSON.stringify(body) });

export const getOrder = (orderId: string) =>
  request<{ success: boolean; order: Order }>(`/api/orders/${orderId}`);

export const updateOrderStatus = (orderId: string, body: { status: string; txnRef?: string; gateway?: string }) =>
  request<{ success: boolean; order: Order }>(`/api/orders/${orderId}/status`, { method: "PUT", body: JSON.stringify(body) });

// ─── Payments ────────────────────────────────────────────
export const getPaymentMethods = () =>
  request<{ success: boolean; methods: PaymentMethod[] }>("/api/payments/methods");

export const createStripeCheckout = (body: {
  items: { name: string; price: number; quantity: number; images?: string[] }[];
  orderId: string;
  customerEmail?: string;
}) => request<{ success: boolean; sessionId: string; url: string }>("/api/payments/stripe/create-checkout", {
  method: "POST",
  body: JSON.stringify(body),
});

export const initiateJazzcash = (body: { amount: number; orderId: string; mobileNumber?: string }) =>
  request<{ success: boolean; txnRefNo: string; response: unknown }>("/api/payments/jazzcash/initiate", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const initiateAlfalah = (body: { amount: number; orderId: string; description?: string }) =>
  request<{ success: boolean; transactionId: string; data: unknown; bankDetails: BankDetails }>("/api/payments/alfalah/initiate", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const initiateMeezan = (body: { amount: number; orderId: string; description?: string }) =>
  request<{ success: boolean; transactionId: string; method: string; bankDetails?: BankDetails }>("/api/payments/meezan/initiate", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const getAlfalahBankDetails = () =>
  request<{ success: boolean } & BankDetails>("/api/payments/alfalah/bank-details");

export const getMeezanBankDetails = () =>
  request<{ success: boolean } & BankDetails>("/api/payments/meezan/bank-details");

export const getStripeSession = (sessionId: string) =>
  request<{ success: boolean; session: unknown }>(`/api/payments/stripe/session/${sessionId}`);

// ─── Types ───────────────────────────────────────────────
export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  currency: string;
  customerEmail: string | null;
  customerName: string | null;
  gateway: string | null;
  status: "pending" | "paid" | "failed" | "refunded" | "cancelled";
  txnRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  images?: string[];
}

export interface PaymentMethod {
  id: string;
  label: string;
  type: string;
  icon: string;
  currencies: string[];
}

export interface BankDetails {
  bank?: string;
  accountNumber?: string;
  accountTitle?: string;
  iban?: string;
  currency?: string;
}
