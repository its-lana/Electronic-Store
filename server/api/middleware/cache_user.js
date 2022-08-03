const redisCreateClient = require("../../config/redis_con");

const cacheAddressUser = (req, res, next) => {
	const redisClient = redisCreateClient();
	const userId = req.params.userId;

	redisClient
		.get("address/" + userId)
		.then((result) => {
			if (result) {
				let addresses = JSON.parse(result);
				res.status(201).json({
					fromCache: true,
					data: addresses,
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
	cacheAddressUser,
};
