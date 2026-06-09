module.exports = {
  apiUrl:       process.env.JAZZCASH_PRODUCTION_URL || "",
  sandboxUrl:   process.env.JAZZCASH_SANDBOX_URL    || "",
  merchantId:   process.env.JAZZCASH_MERCHANTID     || "",
  password:     process.env.JAZZCASH_PASSWORD       || "",
  hashKey:      process.env.JAZZCASH_HASHKEY        || "",
  returnUrl:    process.env.JAZZCASH_RETURNURL      || "",
  mode:         process.env.JAZZCASH_PAYMENTMODE    || "sandbox",
  mpin:         process.env.JAZZCASH_MPIN           || "",
  timezone:     process.env.JAZZCASH_TIMEZONE       || "Asia/Karachi",
  // Merchant account details
  mobileNumber: "03318333368",
  merchantName: "PLAYBEAT ARENA MERCHANT ACCOUNT",
};
