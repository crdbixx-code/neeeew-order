const { v4: uuidv4 } = require("uuid");

// In-memory store for demo — replace with your DB (Supabase, MongoDB, etc.)
const orders = new Map();

// POST /api/orders
const createOrder = (req, res, next) => {
  try {
    const { items, customerEmail, customerName, gateway } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "items array is required" });
    }

    const orderId = `PB-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;
    const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

    const order = {
      id: orderId,
      items,
      total,
      currency: "PKR",
      customerEmail: customerEmail || null,
      customerName: customerName || null,
      gateway: gateway || null,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.set(orderId, order);
    console.log(`📦 Order created: ${orderId} — PKR ${total}`);

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:orderId
const getOrder = (req, res, next) => {
  try {
    const order = orders.get(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// PUT /api/orders/:orderId/status
const updateOrderStatus = (req, res, next) => {
  try {
    const { status, txnRef, gateway } = req.body;
    const order = orders.get(req.params.orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const validStatuses = ["pending", "paid", "failed", "refunded", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    order.status = status;
    order.txnRef = txnRef || order.txnRef;
    order.gateway = gateway || order.gateway;
    order.updatedAt = new Date().toISOString();
    orders.set(order.id, order);

    console.log(`📦 Order ${order.id} → ${status}`);
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders  (all orders — admin use)
const listOrders = (req, res) => {
  const all = Array.from(orders.values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json({ success: true, count: all.length, orders: all });
};

module.exports = { createOrder, getOrder, updateOrderStatus, listOrders };
