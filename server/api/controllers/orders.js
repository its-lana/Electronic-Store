const { ObjectId } = require("mongodb");
const dbo = require("../../config/db_con");
const redisCreateClient = require("../../config/redis_con");

function parseBool(val) {
	return val === true || val === "true";
}

const createOrder = (req, res, next) => {
	const db_connect = dbo.getDb();

	const order = req.body.order.map((item) => {
		return {
			_id: new ObjectId(),
			product: ObjectId(item.product),
			name: item.name,
			image: item.image,
			price: item.price,
			quantity: item.quantity,
		};
	});

	let myobj = {
		user: ObjectId(req.body.user),
		order: order,
		address: ObjectId(req.body.address),
		orderDate: new Date(),
		paymentType: req.body.paymentType,
		paymentStatus: req.body.paymentStatus,
		courier: req.body.courier,
		confirmPayment: false,
		isOrderCompleted: parseBool(req.body.isOrderCompleted),
		noResi: "",
	};

	db_connect
		.collection("order")
		.insertOne(myobj)
		.then((order) => {
			let listOrder = [];
			listOrder = myobj.order;

			for (let i = 0; i < listOrder.length; i++) {
				db_connect
					.collection("product")
					.findOne({ _id: listOrder[i].product })
					.then((item) => {
						db_connect
							.collection("product")
							.findOneAndUpdate(
								{ _id: item._id },
								{
									$set: {
										stock: item.stock - listOrder[i].quantity,
									},
								}
							)
							.then((newItem) => {
								console.log("Update stock successfully!");
							});
					});
			}

			db_connect
				.collection("cartitem")
				.deleteOne({ user: ObjectId(req.body.user) })
				.then((doc) => {
					res.status(201).json({
						message: order,
					});
				})
				.catch((error) => {
					res.status(500).json({
						error: error,
					});
				});
		})
		.catch((error) => {
			res.status(500).json({
				error: error,
			});
		});
};

const updatePaymentOrder = (req, res, next) => {
	const db_connect = dbo.getDb();
	let resi = parseInt(Math.random().toFixed(16).replace("0.", ""));

	db_connect
		.collection("order")
		.findOneAndUpdate(
			{ _id: ObjectId(req.params.orderId) },
			{
				$set: {
					paymentStatus: "Lunas",
					noResi: resi,
				},
			}
		)
		.then((newItem) => {
			res.status(201).json({
				message: "Pembayaran Lunas!",
			});
		})
		.catch((error) => {
			res.status(500).json({
				message: error,
			});
		});
};

const updateStatusOrder = (req, res, next) => {
	let db_connect = dbo.getDb();
	db_connect
		.collection("order")
		.findOneAndUpdate(
			{ _id: ObjectId(req.params.orderId) },
			{
				$set: {
					isOrderCompleted: true,
				},
			}
		)
		.then((newItem) => {
			res.status(201).json({
				message: "Order Completed!",
			});
		})
		.catch((error) => {
			res.status(500).json({
				message: error,
			});
		});
};

const getUserOrder = (req, res, next) => {
	const db_connect = dbo.getDb();
	const userId = req.params.userId;
	const objectUserId = ObjectId(req.params.userId);
	const redisClient = redisCreateClient();

	db_connect
		.collection("order")
		.find({ user: objectUserId })
		.toArray()
		.then((orders) => {
			db_connect
				.collection("useraddress")
				.findOne({ user: objectUserId })
				.then((userAddress) => {
					const orderWithAddress = orders.map((order) => {
						const address = userAddress.address.find((userAdd) =>
							order.address.equals(userAdd._id)
						);
						return {
							_id: order._id,
							order: order.order,
							address: address,
							orderDate: order.orderDate,
							paymentType: order.paymentType,
							paymentStatus: order.paymentStatus,
							isOrderCompleted: order.isOrderCompleted,
							confirmPayment: order.confirmPayment,
							noResi: order.noResi,
						};
					});
					redisClient
						.set("getorders/" + userId, JSON.stringify(orderWithAddress))
						.then(() => {
							redisClient.expire("getorders/" + userId, 600);
							res.status(200).json({
								fromCache: false,
								message: orderWithAddress,
							});
						});
				})
				.catch((error) => {
					return res.status(500).json({
						error: error,
					});
				});
		})
		.catch((error) => {
			res.status(500).json({
				error: error,
			});
		});
};

const updateConfirmPayment = (req, res, next) => {
	const db_connect = dbo.getDb();
	const orderId = ObjectId(req.params.orderId);
	db_connect
		.collection("order")
		.findOne({ _id: orderId })
		.then((order) => {
			let bol;
			if (!order.confirmPayment) {
				bol = true;
			} else {
				bol = false;
			}

			db_connect
				.collection("order")
				.findOneAndUpdate(
					{ _id: orderId },
					{
						$set: {
							confirmPayment: bol,
						},
					}
				)
				.then((newItem) => {
					console.log("Update confirmPayment successfully!");
				})
				.catch((error) => {
					res.status(500).json({
						error: error,
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
	createOrder,
	updatePaymentOrder,
	updateStatusOrder,
	getUserOrder,
	updateConfirmPayment,
};
