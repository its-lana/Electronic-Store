const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orders");
const cache_order = require("../middleware/cache_order");

router.post("/create", orderController.createOrder);
router.put("/updatepaymentstatus/:orderId", orderController.updatePaymentOrder);
router.put("/updateordercompleted/:orderId", orderController.updateStatusOrder);
router.get(
	"/getorders/:userId",
	cache_order.cacheOrdersUser,
	orderController.getUserOrder
);
router.get(
	"/confirmPayment/:userId/:orderId",
	orderController.updateConfirmPayment
);

module.exports = router;
