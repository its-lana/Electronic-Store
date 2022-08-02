const redisCreateClient = require("../../config/redis_con");

const cacheOrdersUser = (req, res, next) => {
	const redisClient = redisCreateClient();
	const userId = req.params.userId;

	redisClient
		.get("getorders/" + userId)
		.then((result) => {
			if (result) {
				let orders = JSON.parse(result);
				res.status(201).json({
					fromCache: true,
					data: orders,
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
	cacheOrdersUser,
};
