const redisCreateClient = require("../../config/redis_con");

const cacheAllProducts = (req, res, next) => {
	const redisClient = redisCreateClient();

	redisClient
		.get("products")
		.then((result) => {
			if (result) {
				let products = JSON.parse(result);
				res.status(201).json({
					fromCache: true,
					data: products,
				});
			} else {
				next();
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
};

const cacheProductsUseCategory = (req, res, next) => {
	const redisClient = redisCreateClient();
	const slug = req.params.categorySlug;

	redisClient
		.get(slug)
		.then((result) => {
			if (result) {
				let products = JSON.parse(result);
				res.status(201).json({
					fromCache: true,
					data: products,
				});
			} else {
				next();
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
};

const cacheProductsSlug = (req, res, next) => {
	const redisClient = redisCreateClient();
	const productSlug = req.params.productSlug;

	redisClient
		.get(productSlug)
		.then((result) => {
			if (result) {
				let product = JSON.parse(result);
				res.status(201).json({
					fromCache: true,
					data: product,
				});
			} else {
				next();
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
};

module.exports = {
	cacheAllProducts,
	cacheProductsUseCategory,
	cacheProductsSlug,
};
