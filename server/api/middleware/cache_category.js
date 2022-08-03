const redisCreateClient = require("../../config/redis_con");

const cacheAllCategory = (req, res, next) => {
	const redisClient = redisCreateClient();

	redisClient
		.get("categories")
		.then((result) => {
			if (result) {
				let categories = JSON.parse(result);
				res.status(201).json({
					fromCache: true,
					data: categories,
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
	cacheAllCategory,
};
