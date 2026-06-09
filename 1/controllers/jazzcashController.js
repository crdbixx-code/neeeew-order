const crypto = require("crypto");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const config = require("../config/jazzcash");

/**
 * Build HMAC-SHA256 hash for JazzCash request integrity.
 * JazzCash sorts all pp_ params alphabetically and joins with &
 */
function buildHash(params) {
  const sorted = Object.keys(params)
    .filter((k) => k.startsWith("pp_") && params[k] !== "")
    .sort()
    .map((k) => params[k])
    .join("&");

  const str = config.hashKey + "&" + sorted;
  return crypto.createHmac("sha256", config.hashKey).update(str).digest("hex").toUpperCase();
}

function getDateTime(offsetMinutes = 0) {
  const now = new Date(Date.now() + offsetMinutes * 60000);
  return now
    .toISOString()
    .replace(/[-T:]/g, "")
    .slice(0, 14);
}

// POST /api/payments/jazzcash/initiate
const initiatePayment = async (req, res, next) => {
  try {
    const { amount, orderId, description, mobileNumber } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ success: false, message: "amount and orderId are required" });
    }

    const txnRefNo = `T${Date.now()}${uuidv4().slice(0, 6).toUpperCase()}`;
    const txnDateTime = getDateTime();
    const txnExpiryDateTime = getDateTime(60); // 1 hour expiry
    const amountPaisa = String(Math.round(amount * 100)); // JazzCash uses paisa

    const params = {
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_Language: "EN",
      pp_MerchantID: config.merchantId,
      pp_Password: config.password,
      pp_MobileNumber: mobileNumber || config.mobileNumber,
      pp_CNIC: "",
      pp_TxnRefNo: txnRefNo,
      pp_Amount: amountPaisa,
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: txnDateTime,
      pp_BillReference: orderId,
      pp_Description: description || "PlayBeat Purchase",
      pp_TxnExpiryDateTime: txnExpiryDateTime,
      pp_ReturnURL: config.returnUrl,
      pp_SecureHash: "",
    };

    params.pp_SecureHash = buildHash(params);

    const apiUrl = config.mode === "sandbox" ? config.sandboxUrl : config.apiUrl;
    const response = await axios.post(apiUrl, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    res.json({
      success: true,
      txnRefNo,
      gateway: "jazzcash",
      response: response.data,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/payments/jazzcash/callback  (JazzCash posts here after payment)
const handleCallback = (req, res, next) => {
  try {
    const data = req.body;
    const receivedHash = data.pp_SecureHash;

    // Re-build hash to verify authenticity
    const paramsWithoutHash = { ...data };
    delete paramsWithoutHash.pp_SecureHash;
    paramsWithoutHash.pp_SecureHash = "";

    const expectedHash = buildHash(paramsWithoutHash);

    if (receivedHash !== expectedHash) {
      console.error("JazzCash hash mismatch — possible tampered callback");
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?reason=hash_mismatch`);
    }

    const responseCode = data.pp_ResponseCode;
    const txnRefNo = data.pp_TxnRefNo;
    const orderId = data.pp_BillReference;

    if (responseCode === "000") {
      console.log(`✅ JazzCash success — orderId: ${orderId}, txn: ${txnRefNo}`);
      // TODO: update DB order status
      return res.redirect(`${process.env.FRONTEND_URL}/payment/success?txn=${txnRefNo}&gateway=jazzcash`);
    } else {
      console.log(`❌ JazzCash failed — code: ${responseCode}, orderId: ${orderId}`);
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?code=${responseCode}&gateway=jazzcash`);
    }
  } catch (err) {
    next(err);
  }
};

// GET /api/payments/jazzcash/status/:txnRefNo
const getStatus = async (req, res, next) => {
  try {
    const { txnRefNo } = req.params;
    const txnDateTime = getDateTime();

    const params = {
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_Language: "EN",
      pp_MerchantID: config.merchantId,
      pp_Password: config.password,
      pp_TxnRefNo: txnRefNo,
      pp_TxnDateTime: txnDateTime,
      pp_SecureHash: "",
    };
    params.pp_SecureHash = buildHash(params);

    const apiUrl = config.mode === "sandbox"
      ? "https://sandbox.jazzcash.com.pk/ApplicationAPI/API/PaymentInquiry/Inquire"
      : "https://payments.jazzcash.com.pk/ApplicationAPI/API/PaymentInquiry/Inquire";

    const response = await axios.post(apiUrl, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    res.json({ success: true, data: response.data });
  } catch (err) {
    next(err);
  }
};

module.exports = { initiatePayment, handleCallback, getStatus };
