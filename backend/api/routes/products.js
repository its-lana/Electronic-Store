const express = require("express");
const router = express.Router();
const productController = require("../controllers/products");
const cache_product = require("../middleware/cache_product");
const authenticate = require("../middleware/authenticate");

router.post("/create", authenticate, productController.addNewProduct);
router.get(
	"/",
	cache_product.cacheAllProducts,
	productController.getAllProduct
);
router.get(
	"/:categorySlug",
	cache_product.cacheProductsUseCategory,
	productController.getProductByCategorySlug
);
router.get(
	"/:categorySlug/:productSlug",
	cache_product.cacheProductsSlug,
	productController.getOneProduct
);
router.put("/updatestock/:idProduk", productController.updateStockProductById);

module.exports = router;
