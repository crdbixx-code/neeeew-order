const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");

const paymentRoutes = require("./routes/payments");
const orderRoutes = require("./routes/orders");
const healthRoutes = require("./routes/health");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

// ─── Security ──────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // CSP off so React scripts load
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ─── Rate Limiting ─────────────────────────────────────────
app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use("/api/payments/", rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }));

// ─── Stripe webhook needs raw body BEFORE json parser ──────
app.use("/api/payments/stripe/webhook", express.raw({ type: "application/json" }));

// ─── Body Parsing ──────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ───────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// ─── API Routes ────────────────────────────────────────────
app.use("/api/health", healthRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);

// ─── Serve Frontend (built React app) ──────────────────────
// Try a few likely locations for the built frontend `dist` directory.
const candidateFrontendDirs = [
  path.join(__dirname, "../playbeat/dist"),
  path.join(__dirname, "../1/dist"),
  path.join(__dirname, "../dist"),
  path.join(__dirname, "../client/dist"),
  path.join(__dirname, "../frontend/dist"),
];

let FRONTEND_DIST = null;
for (const d of candidateFrontendDirs) {
  if (fs.existsSync(d)) {
    FRONTEND_DIST = d;
    break;
  }
}

if (FRONTEND_DIST) {
  // Serve static assets (JS, CSS, images, locales)
  app.use(express.static(FRONTEND_DIST));

  // All non-API routes → index.html (React Router handles client-side routing)
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, "index.html"));
  });

  console.log(`🌐  Serving frontend from ${FRONTEND_DIST}`);
} else {
  console.warn(
    "⚠️  Frontend dist not found. Expected one of: " +
    candidateFrontendDirs.join(", ") +
    " — build the frontend (e.g. from project root: pnpm build or npm run build:prod)"
  );
}

// ─── Error Handling ────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
