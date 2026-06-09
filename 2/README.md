# PlayBeat Digital — Node.js/Express Backend

Payment gateway backend for PlayBeat Digital. Supports Stripe (card), JazzCash (wallet), Bank Alfalah, and Meezan Bank.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill env vars
cp .env.example .env

# 3. Development (auto-restart)
npm run dev

# 4. Production
npm start
```

Server runs at: `http://localhost:5000`

---

## Environment Variables

See `.env.example` for the full list. Key ones:

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `FRONTEND_URL` | Your frontend origin for CORS |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | From Stripe Dashboard → Webhooks |
| `ALFAPAY_MERCHANT_HASH` | Bank Alfalah signing hash |
| `JAZZCASH_HASHKEY` | JazzCash HMAC key |
| `MEZPAY_USERNAME` | Meezan MezPay username |

---

## API Reference

### Health
```
GET /api/health
```

### Payment Methods
```
GET /api/payments/methods
```
Returns all supported payment methods with icons and currency support.

---

### Stripe

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/stripe/create-checkout` | Create a hosted checkout session |
| POST | `/api/payments/stripe/create-payment-intent` | Create a payment intent (custom UI) |
| POST | `/api/payments/stripe/webhook` | Stripe webhook (raw body) |
| GET  | `/api/payments/stripe/session/:id` | Retrieve session details |

**Create Checkout body:**
```json
{
  "items": [{ "name": "Pro Plan", "price": 9.99, "quantity": 1 }],
  "orderId": "PB-123",
  "customerEmail": "user@example.com"
}
```

---

### JazzCash

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/jazzcash/initiate` | Initiate wallet payment |
| POST | `/api/payments/jazzcash/callback` | JazzCash posts here after payment |
| GET  | `/api/payments/jazzcash/status/:txnRef` | Query payment status |

**Initiate body:**
```json
{
  "amount": 500,
  "orderId": "PB-123",
  "mobileNumber": "03001234567"
}
```

---

### Bank Alfalah

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/alfalah/initiate` | Initiate card/transfer payment |
| POST | `/api/payments/alfalah/callback` | Alfalah posts here after payment |
| GET  | `/api/payments/alfalah/bank-details` | Returns account number & title |

---

### Meezan Bank

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/meezan/initiate` | Initiate bank transfer |
| POST | `/api/payments/meezan/success` | MezPay success callback |
| POST | `/api/payments/meezan/failed` | MezPay failed callback |
| GET  | `/api/payments/meezan/bank-details` | Returns IBAN & account title |

---

### Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create a new order |
| GET  | `/api/orders` | List all orders (admin) |
| GET  | `/api/orders/:orderId` | Get order by ID |
| PUT  | `/api/orders/:orderId/status` | Update order status |

**Create Order body:**
```json
{
  "items": [{ "name": "Pro Plan", "price": 999, "quantity": 1 }],
  "customerEmail": "user@example.com",
  "gateway": "jazzcash"
}
```

**Update Status body:**
```json
{ "status": "paid", "txnRef": "T123456", "gateway": "jazzcash" }
```
Valid statuses: `pending | paid | failed | refunded | cancelled`

---

## Project Structure

```
playbeat-server/
├── server.js               # Entry point
├── app.js                  # Express app, middleware, routes
├── .env.example            # Environment template
├── config/
│   ├── stripe.js           # Stripe client
│   ├── alfalah.js          # Alfalah config
│   ├── meezan.js           # Meezan config
│   └── jazzcash.js         # JazzCash config
├── controllers/
│   ├── stripeController.js
│   ├── jazzcashController.js
│   ├── alfalahController.js
│   ├── meezanController.js
│   └── ordersController.js
├── middleware/
│   ├── errorHandler.js     # Global error + 404 handler
│   └── auth.js             # API key auth middleware
└── routes/
    ├── payments.js         # All payment gateway routes
    ├── orders.js           # Order management routes
    └── health.js           # Health check
```

---

## Database Integration (Next Step)

The orders controller currently uses an in-memory Map. Replace it with your DB:

- **Supabase**: use `@supabase/supabase-js` (already in frontend deps)
- **MongoDB**: use `mongoose`
- **PostgreSQL**: use `pg` or `prisma`

---

## Security Notes

- ⚠️ Never commit real API keys — use `.env` (already in `.gitignore`)
- Stripe webhook endpoint uses raw body parsing (configured before `express.json()`)
- JazzCash callback verifies HMAC-SHA256 hash before processing
- Rate limiting applied: 100 req/15min global, 20 req/15min on payment routes
