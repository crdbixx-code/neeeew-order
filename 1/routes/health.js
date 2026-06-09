const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    service: "PlayBeat Digital API",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
    gateways: {
      stripe:   !!process.env.STRIPE_SECRET_KEY,
      jazzcash: !!process.env.JAZZCASH_MERCHANTID,
      alfalah:  !!process.env.ALFAPAY_MERCHANT_HASH,
      meezan:   !!process.env.MEZPAY_USERNAME,
    },
  });
});

module.exports = router;
