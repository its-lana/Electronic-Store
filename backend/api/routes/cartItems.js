const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartItems");

router.post("/add", cartController.addCartItem);
router.get("/user/:userId", cartController.getCartUser);
router.put("/update/quantity", cartController.updateCartUser);

module.exports = router;
