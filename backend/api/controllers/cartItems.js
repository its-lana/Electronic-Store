const { ObjectId } = require("mongodb");
const dbo = require("../../config/db_con");

function isEmpty(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) return false;
	}
	return true;
}

const addCartItem = (req, res, next) => {
	const db_connect = dbo.getDb();

	db_connect
		.collection("cartitem")
		.findOne({ user: ObjectId(req.body.user) })
		.then((cartItem) => {
			if (cartItem) {
				const item = cartItem.cart.find((item) =>
					item.product.equals(req.body.product)
				);

				let where, action, set;
				let bol = isEmpty(item);
				console.log(bol);

				if (!bol) {
					action = "$set";
					where = {
						user: ObjectId(req.body.user),
						"cart.product": ObjectId(req.body.product),
					};
					set = "cart.$";
				} else {
					action = "$push";
					where = { user: ObjectId(req.body.user) };
					set = "cart";
				}

				db_connect
					.collection("cartitem")
					.findOneAndUpdate(where, {
						[action]: {
							[set]: {
								_id: item ? item._id : new ObjectId(),
								product: ObjectId(req.body.product),
								name: req.body.name,
								image: req.body.image,
								quantity: item
									? item.quantity + req.body.quantity
									: req.body.quantity,
								price: req.body.price,
								total: item
									? req.body.price *
									  (req.body.quantity + item.quantity)
									: req.body.price * req.body.quantity,
							},
						},
					})
					.then((newItem) => {
						res.status(201).json({
							message: newItem,
						});
					})
					.catch((error) => {
						res.status(500).json({
							message: error,
						});
					});
			} else {
				let myobj = {
					user: ObjectId(req.body.user),
					cart: [
						{
							_id: new ObjectId(),
							product: ObjectId(req.body.product),

							name: req.body.name,
							image: req.body.image,
							quantity: req.body.quantity,
							price: req.body.price,
							total: req.body.quantity * req.body.price,
						},
					],
					createdAt: new Date(),
				};

				db_connect
					.collection("cartitem")
					.insertOne(myobj)
					.then((newCart) => {
						res.status(201).json({
							message: newCart,
						});
					})
					.catch((error) => {
						res.status(500).json({
							error: error,
						});
					});
			}
		})
		.catch((error) => {
			res.status(500).json({
				error: error,
			});
		});
};

const getCartUser = (req, res, next) => {
	const db_connect = dbo.getDb();

	const userId = ObjectId(req.params.userId);

	db_connect
		.collection("cartitem")
		.find({ user: userId })
		.toArray()
		.then((cartItems) => {
			res.status(200).json({
				message: cartItems,
			});
		});
};

const updateCartUser = (req, res, next) => {
	let db_connect = dbo.getDb();

	const userId = ObjectId(req.body.userId);
	const productId = ObjectId(req.body.productId);
	const quantity = req.body.quantity;
	const total = req.body.total;

	db_connect
		.collection("cartitem")
		.updateOne(
			{ user: userId, "cart.product": productId },
			{
				$set: {
					"cart.$.quantity": quantity,
					"cart.$.total": total,
				},
			}
		)
		.then((cartItem) => {
			res.status(201).json({
				message: cartItem,
			});
		})
		.catch((error) => {
			res.status(500).json({
				error: error,
			});
		});
};

module.exports = {
	addCartItem,
	getCartUser,
	updateCartUser,
};
