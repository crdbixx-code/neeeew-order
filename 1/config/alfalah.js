module.exports = {
  apiUrl:           process.env.ALFAPAY_API_URL            || "https://sandbox.bankalfalah.com/HS/api/HSAPI/HSAPI",
  mode:             process.env.ALFAPAY_MODE               || "sandbox",
  channelId:        process.env.ALFAPAY_CHANNEL_ID         || "1002",
  merchantId:       process.env.ALFAPAY_MERCHANT_ID        || "197",
  storeId:          process.env.ALFAPAY_STORE_ID           || "000001",
  returnUrl:        process.env.ALFAPAY_RETURN_URL         || "",
  merchantUsername: process.env.ALFAPAY_MERCHANT_USERNAME  || "",
  merchantPassword: process.env.ALFAPAY_MERCHANT_PASSWORD  || "",
  merchantHash:     process.env.ALFAPAY_MERCHANT_HASH      || "",
  key1:             process.env.ALFAPAY_KEY_1              || "",
  key2:             process.env.ALFAPAY_KEY_2              || "",
  // Bank account details for manual transfer info display
  accountNumber:    "00681011050474",
  accountTitle:     "PLAYBEAT DIGITAL (PRIVATE LIMITED)",
};
