const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categories");
const cache_category = require("../middleware/cache_category");

router.get(
	"/",
	cache_category.cacheAllCategory,
	categoryController.getAllCategory
);
router.post("/", categoryController.addNewCategory);

module.exports = router;
