const stripe = require("../config/stripe");

// POST /api/payments/stripe/create-checkout
const createCheckout = async (req, res, next) => {
  try {
    if (!stripe) return res.status(503).json({ success: false, message: "Stripe not configured" });

    const { items, orderId, customerEmail, successUrl, cancelUrl } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "items array is required" });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name, images: item.images || [] },
        unit_amount: Math.round(item.price * 100), // cents
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail || undefined,
      metadata: { orderId: orderId || "" },
      success_url: successUrl || `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/payment/cancel`,
    });

    res.json({ success: true, sessionId: session.id, url: session.url });
  } catch (err) {
    next(err);
  }
};

// POST /api/payments/stripe/create-payment-intent
const createPaymentIntent = async (req, res, next) => {
  try {
    if (!stripe) return res.status(503).json({ success: false, message: "Stripe not configured" });

    const { amount, currency = "usd", orderId } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: { orderId: orderId || "" },
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/payments/stripe/webhook  (raw body required — set in app.js)
const handleWebhook = async (req, res, next) => {
  try {
    if (!stripe) return res.status(503).json({ success: false, message: "Stripe not configured" });

    const sig = req.headers["stripe-signature"];
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(500).json({ success: false, message: "Webhook secret not configured" });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log(`✅ Payment success — orderId: ${session.metadata.orderId}, session: ${session.id}`);
        // TODO: update your DB order status here
        break;
      }
      case "payment_intent.payment_failed": {
        const intent = event.data.object;
        console.log(`❌ Payment failed — orderId: ${intent.metadata.orderId}`);
        // TODO: update your DB order status here
        break;
      }
      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};

// GET /api/payments/stripe/session/:sessionId
const getSession = async (req, res, next) => {
  try {
    if (!stripe) return res.status(503).json({ success: false, message: "Stripe not configured" });
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

module.exports = { createCheckout, createPaymentIntent, handleWebhook, getSession };
