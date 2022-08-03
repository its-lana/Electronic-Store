const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisCreateClient = require("../../config/redis_con");
const dbo = require("../../config/db_con");

const getAllAdmin = (req, res, next) => {
	const db_connect = dbo.getDb();
	const redisClient = redisCreateClient();

	db_connect
		.collection("admin")
		.find({})
		.toArray()
		.then((admins) => {
			redisClient.set("admins", JSON.stringify(admins)).then(() => {
				redisClient.expire("admins", 600);
				res.status(200).json({
					fromCache: false,
					message: admins,
				});
			});
		})
		.catch((er) => {
			res.status(500).json({
				error: er,
			});
		});
};

const adminSignUp = (req, res, next) => {
	const db_connect = dbo.getDb();

	db_connect
		.collection("admin")
		.findOne({ email: req.body.email }, function (err, result) {
			if (result != null) {
				return res.status(500).json({
					message: "Already registered, try another email address",
				});
			} else {
				bcrypt.hash(req.body.password, 10, function (err, hash) {
					if (err) {
						return res.status(500).json({
							error: err,
						});
					} else {
						let myobj = {
							firstName: req.body.firstName,
							lastName: req.body.lastName,
							email: req.body.email,
							password: hash,
							createdAt: new Date().toISOString(),
						};

						db_connect
							.collection("admin")
							.insertOne(myobj)
							.then((doc) => {
								res.status(201).json({
									message: "Admin Registered Successfully",
								});
							})
							.catch((er) => {
								res.status(500).json({
									error: er,
								});
							});
					}
				});
			}
		});
};

const adminLogin = (req, res, next) => {
	const db_connect = dbo.getDb();

	db_connect
		.collection("admin")
		.findOne({ email: req.body.email }, function (err, user) {
			if (user == null) {
				return res.status(500).json({
					message: "Incorrect email or password",
				});
			} else {
				bcrypt.compare(
					req.body.password,
					user.password,
					function (err, result) {
						console.log("err", err);
						console.log("result", result);

						if (err) {
							return res.status(500).json({
								error: "Login Failed",
							});
						} else {
							if (result) {
								// Create token
								const payload = {
									userId: user._id,
									iat: Math.floor(Date.now() / 1000) - 30,
									exp: Math.floor(Date.now() / 1000) + 60 * 60,
								};
								jwt.sign(payload, "mysecretkey", function (err, token) {
									if (err) {
										return res.status(200).json({
											error: "err",
										});
									} else {
										res.status(200).json({
											message: "Login Successfully",
											token: token,
										});
									}
								});
							} else {
								res.status(200).json({
									message: "Incorrect email or password",
								});
							}
						}
					}
				);
			}
		});
};

module.exports = {
	getAllAdmin,
	adminSignUp,
	adminLogin,
};
