module.exports = {
  username:        process.env.MEZPAY_USERNAME         || "",
  password:        process.env.MEZPAY_PASSWORD         || "",
  successCallback: process.env.MEZPAY_SUCCESS_CALLBACK || "",
  failedCallback:  process.env.MEZPAY_FAILED_CALLBACK  || "",
  // Bank account details
  iban:            "PK86MEZN0015040115102971",
  accountTitle:    "PLAYBEAT DIGITAL PRIVATE LIMITED",
};
