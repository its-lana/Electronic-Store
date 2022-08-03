const redisCreateClient = require("../../config/redis_con");

const cacheAllAdmin = (req, res, next) => {
	const redisClient = redisCreateClient();

	redisClient
		.get("admins")
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

module.exports = {
	cacheAllAdmin,
};
