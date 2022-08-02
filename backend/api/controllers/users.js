const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const redisCreateClient = require("../../config/redis_con");
const dbo = require("../../config/db_con");

const userSignUp = (req, res, next) => {
	const db_connect = dbo.getDb();

	db_connect
		.collection("user")
		.findOne({ email: req.body.email })
		.then((user) => {
			if (user) {
				return res.status(500).json({
					message: "Email Already Exists",
				});
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({
							error: "Something went wrong",
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
							.collection("user")
							.insertOne(myobj)
							.then((doc) => {
								res.status(201).json({
									message: "Account Created Successfully",
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

const userLogin = (req, res, next) => {
	let db_connect = dbo.getDb();

	db_connect
		.collection("user")
		.findOne({ email: req.body.email })
		.then((user) => {
			if (user) {
				bcrypt.compare(req.body.password, user.password, (err, result) => {
					if (err) {
						return res.status(500).json({
							message: "Login Failed",
						});
					} else {
						if (result) {
							const payload = {
								userId: user._id,
								iat: Math.floor(Date.now() / 1000) - 30,
								exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60 * 24,
							};
							jwt.sign(payload, "mysecretkey", (err, token) => {
								if (err) {
									return res.status(500).JSON({
										message: "Authentication Failed",
									});
								} else {
									res.status(200).json({
										message: {
											user: {
												userId: user._id,
												firstName: user.firstName,
												lastName: user.lastName,
												email: user.email,
											},
											token: token,
										},
									});
								}
							});
						} else {
							res.status(500).json({
								message: "Incorrect Password",
							});
						}
					}
				});
			} else {
				res.status(500).json({
					message: "Email doesn't not exists",
				});
			}
		})
		.catch((error) => {
			res.status(500).json({
				error: error,
			});
		});
};

const userAddNewAddress = (req, res, next) => {
	const db_connect = dbo.getDb();

	db_connect
		.collection("useraddress")
		.findOne({ user: ObjectId(req.body.userId) })
		.then((user) => {
			if (user) {
				let myobj1 = {
					_id: new ObjectId(),
					namaLengkap: req.body.address.fullName,
					noHp: parseInt(req.body.address.mobileNumber),
					alamat: req.body.address.address,
					kecamatan: req.body.address.locality,
					kabupatenKota: req.body.address.cityDistrictTown,
					kodePos: parseInt(req.body.address.pinCode),
					provinsi: req.body.address.state,
				};

				db_connect
					.collection("useraddress")
					.findOneAndUpdate(
						{ user: ObjectId(req.body.userId) },
						{
							$push: {
								address: myobj1,
							},
						},
						{
							new: true,
						}
					)
					.then((doc) => {
						res.status(201).json({
							message: doc,
						});
					});
			} else {
				let myobj1 = {
					_id: new ObjectId(),
					namaLengkap: req.body.address.fullName,
					noHp: parseInt(req.body.address.mobileNumber),
					alamat: req.body.address.address,
					kecamatan: req.body.address.locality,
					kabupatenKota: req.body.address.cityDistrictTown,
					kodePos: parseInt(req.body.address.pinCode),
					provinsi: req.body.address.state,
				};

				let myobj = {
					user: ObjectId(req.body.userId),
					address: [myobj1],
				};

				db_connect
					.collection("useraddress")
					.insertOne(myobj)
					.then((doc) => {
						res.status(201).json({
							message: doc,
						});
					})
					.catch((error) => {
						res.status(500).json({
							error: error,
						});
					});
			}
		});
};

const getAllUserAddress = (req, res, next) => {
	const db_connect = dbo.getDb();
	const redisClient = redisCreateClient();
	const userId = req.params.userId;

	db_connect
		.collection("useraddress")
		.findOne({ user: ObjectId(userId) })
		.then((result) => {
			redisClient
				.set("address/" + userId, JSON.stringify(result))
				.then(() => {
					redisClient.expire("address/" + userId, 600);
					res.status(200).json({
						fromCache: false,
						message: result,
					});
				});
		})
		.catch((error) => {
			res.status(500).json({
				error: error,
			});
		});
};

module.exports = {
	userSignUp,
	userLogin,
	userAddNewAddress,
	getAllUserAddress,
};
