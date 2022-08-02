const redis = require("redis");
let Client;
const redisCreateClient = () => {
	Client = redis.createClient();
	Client.connect()
		.then(() => {
			console.log("redis connected!");
		})
		.catch((error) => {
			res.status(500).json({
				error: error,
			});
		});
	return Client;
};

module.exports = redisCreateClient;
