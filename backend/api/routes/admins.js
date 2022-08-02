const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admins");
const cache_admin = require("../middleware/cache_admin");

router.get("/", cache_admin.cacheAllAdmin, adminController.getAllAdmin);
router.post("/signup", adminController.adminSignUp);
router.post("/login", adminController.adminLogin);

module.exports = router;
