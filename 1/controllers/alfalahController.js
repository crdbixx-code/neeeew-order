const crypto = require("crypto");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const config = require("../config/alfalah");

/**
 * AES-128-CBC encryption used by Bank Alfalah HS API
 */
function encryptData(data, key1, key2) {
  const key = Buffer.from(key1 + key2, "utf8").slice(0, 16);
  const iv = Buffer.from(key1 + key2, "utf8").slice(0, 16);
  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

function decryptData(data, key1, key2) {
  const key = Buffer.from(key1 + key2, "utf8").slice(0, 16);
  const iv = Buffer.from(key1 + key2, "utf8").slice(0, 16);
  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  let decrypted = decipher.update(data, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// POST /api/payments/alfalah/initiate
const initiatePayment = async (req, res, next) => {
  try {
    const { amount, orderId, description } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ success: false, message: "amount and orderId are required" });
    }

    const transactionId = `ALF-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`;
    const dateTime = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);

    // Build the request hash
    const hashString = `${config.merchantId}${config.storeId}${transactionId}${amount}${dateTime}${config.merchantHash}`;
    const hash = crypto.createHash("sha256").update(hashString).digest("hex");

    const payload = {
      ChannelId: config.channelId,
      Currency: "PKR",
      IsBIN: "0",
      ReturnURL: config.returnUrl,
      MerchantId: config.merchantId,
      StoreId: config.storeId,
      MerchantHash: hash,
      MerchantUsername: config.merchantUsername,
      MerchantPassword: encryptData(config.merchantPassword, config.key1, config.key2),
      TransactionTypeId: "3", // Sale
      TransactionReferenceNumber: transactionId,
      TransactionAmount: String(amount),
      TransactionDateTime: dateTime,
      IsTokenizeRequest: "0",
      OrderNumber: orderId,
      PaymentTokenizationApplicable: "FALSE",
      SignatureMechanism: "SHA-256",
    };

    const response = await axios.post(config.apiUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });

    res.json({
      success: true,
      transactionId,
      gateway: "alfalah",
      data: response.data,
      // Bank account details for reference
      bankDetails: {
        accountNumber: config.accountNumber,
        accountTitle: config.accountTitle,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/payments/alfalah/callback
const handleCallback = async (req, res, next) => {
  try {
    const data = req.body;
    const { TransactionReferenceNumber, ResponseCode, AuthCode, OrderNumber } = data;

    if (ResponseCode === "00" || ResponseCode === "000") {
      console.log(`✅ Alfalah success — orderId: ${OrderNumber}, txn: ${TransactionReferenceNumber}`);
      // TODO: update DB order status
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/success?txn=${TransactionReferenceNumber}&gateway=alfalah`
      );
    } else {
      console.log(`❌ Alfalah failed — code: ${ResponseCode}, orderId: ${OrderNumber}`);
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?code=${ResponseCode}&gateway=alfalah`
      );
    }
  } catch (err) {
    next(err);
  }
};

// GET /api/payments/alfalah/bank-details  (for manual transfer info)
const getBankDetails = (req, res) => {
  res.json({
    success: true,
    bank: "Bank Alfalah",
    accountNumber: config.accountNumber,
    accountTitle: config.accountTitle,
    currency: "PKR",
  });
};

module.exports = { initiatePayment, handleCallback, getBankDetails };
