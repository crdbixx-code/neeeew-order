const express = require("express");
const router = express.Router();

const stripe = require("../controllers/stripeController");
const jazzcash = require("../controllers/jazzcashController");
const alfalah = require("../controllers/alfalahController");
const meezan = require("../controllers/meezanController");

// ─── Stripe ──────────────────────────────────────────────────────────────────
// NOTE: /stripe/webhook must use raw body — configured in app.js BEFORE json parser
router.post("/stripe/webhook", stripe.handleWebhook);
router.post("/stripe/create-checkout", stripe.createCheckout);
router.post("/stripe/create-payment-intent", stripe.createPaymentIntent);
router.get("/stripe/session/:sessionId", stripe.getSession);

// ─── JazzCash ────────────────────────────────────────────────────────────────
router.post("/jazzcash/initiate", jazzcash.initiatePayment);
router.post("/jazzcash/callback", jazzcash.handleCallback);
router.get("/jazzcash/status/:txnRefNo", jazzcash.getStatus);

// ─── Bank Alfalah ────────────────────────────────────────────────────────────
router.post("/alfalah/initiate", alfalah.initiatePayment);
router.post("/alfalah/callback", alfalah.handleCallback);
router.get("/alfalah/bank-details", alfalah.getBankDetails);

// ─── Meezan Bank ─────────────────────────────────────────────────────────────
router.post("/meezan/initiate", meezan.initiatePayment);
router.post("/meezan/success", meezan.handleSuccess);
router.post("/meezan/failed", meezan.handleFailed);
router.get("/meezan/bank-details", meezan.getBankDetails);

// ─── Supported methods overview ──────────────────────────────────────────────
router.get("/methods", (req, res) => {
  res.json({
    success: true,
    methods: [
      { id: "stripe",   label: "Debit / Credit Card",  type: "card",          icon: "stripe",   currencies: ["USD", "PKR"] },
      { id: "jazzcash", label: "JazzCash Wallet",       type: "wallet",        icon: "jazzcash", currencies: ["PKR"] },
      { id: "alfalah",  label: "Bank Alfalah Transfer", type: "bank_transfer", icon: "alfalah",  currencies: ["PKR"] },
      { id: "meezan",   label: "Meezan Bank Transfer",  type: "bank_transfer", icon: "meezan",   currencies: ["PKR"] },
    ],
  });
});

module.exports = router;
