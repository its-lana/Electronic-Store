const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const cache_user = require("../middleware/cache_user");
const authenticate = require("../middleware/authenticate");

router.post("/signup", userController.userSignUp);
router.post("/login", userController.userLogin);
router.post("/new-address", authenticate, userController.userAddNewAddress);
router.get(
	"/get-addresses/:userId",
	authenticate,
	cache_user.cacheAddressUser,
	userController.getAllUserAddress
);

module.exports = router;
