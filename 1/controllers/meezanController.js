const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const config = require("../config/meezan");

// POST /api/payments/meezan/initiate
const initiatePayment = async (req, res, next) => {
  try {
    const { amount, orderId, description } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ success: false, message: "amount and orderId are required" });
    }

    const transactionId = `MEZ-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`;

    // Meezan typically uses MezPay API — structure based on their integration docs
    // Credentials are only used if MezPay API integration is active
    const payload = {
      username: config.username,
      password: config.password,
      orderId,
      transactionId,
      amount: String(amount),
      currency: "PKR",
      description: description || "PlayBeat Purchase",
      successCallback: config.successCallback,
      failedCallback: config.failedCallback,
    };

    // If API credentials are set, call MezPay API
    if (config.username && config.password) {
      // Replace with actual MezPay API endpoint when available
      const response = await axios.post(
        "https://mezpay.meezanbank.com/api/payment/initiate",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      return res.json({ success: true, transactionId, gateway: "meezan", data: response.data });
    }

    // Fallback: return IBAN details for manual bank transfer
    res.json({
      success: true,
      gateway: "meezan",
      method: "bank_transfer",
      transactionId,
      bankDetails: {
        bank: "Meezan Bank",
        iban: config.iban,
        accountTitle: config.accountTitle,
        amount,
        currency: "PKR",
        reference: orderId,
        instructions: `Please transfer PKR ${amount} to the above account and use your Order ID (${orderId}) as the payment reference.`,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/payments/meezan/success
const handleSuccess = (req, res, next) => {
  try {
    const { orderId, transactionId } = req.body;
    console.log(`✅ Meezan success — orderId: ${orderId}, txn: ${transactionId}`);
    // TODO: update DB order status
    res.redirect(`${process.env.FRONTEND_URL}/payment/success?txn=${transactionId}&gateway=meezan`);
  } catch (err) {
    next(err);
  }
};

// POST /api/payments/meezan/failed
const handleFailed = (req, res, next) => {
  try {
    const { orderId, transactionId, reason } = req.body;
    console.log(`❌ Meezan failed — orderId: ${orderId}, txn: ${transactionId}`);
    // TODO: update DB order status
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed?txn=${transactionId}&gateway=meezan`);
  } catch (err) {
    next(err);
  }
};

// GET /api/payments/meezan/bank-details
const getBankDetails = (req, res) => {
  res.json({
    success: true,
    bank: "Meezan Bank",
    iban: config.iban,
    accountTitle: config.accountTitle,
    currency: "PKR",
  });
};

module.exports = { initiatePayment, handleSuccess, handleFailed, getBankDetails };
