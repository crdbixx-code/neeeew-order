const express = require("express");
const router = express.Router();
const { createOrder, getOrder, updateOrderStatus, listOrders } = require("../controllers/ordersController");

router.get("/", listOrders);
router.post("/", createOrder);
// PUT and POST both supported for status update (POST for easier client calls)
router.put("/:orderId/status", updateOrderStatus);
router.post("/:orderId/status", updateOrderStatus);
router.get("/:orderId", getOrder);

module.exports = router;
