const { ObjectId } = require("mongodb");
const dbo = require("../../config/db_con");
const redisCreateClient = require("../../config/redis_con");

const addNewProduct = (req, res, next) => {
	const db_connect = dbo.getDb();
	const slug = req.body.name.replace(/ /g, "-") + "-" + Date.now();

	let myobj = {
		name: req.body.name,
		slug: slug,
		price: parseInt(req.body.price),
		stock: parseInt(req.body.stock),
		description: req.body.description,
		productPic: [
			{
				img: req.body.productPic,
			},
		],
		keyword: req.body.keyword,
		category: ObjectId(req.body.category),
		createdBy: ObjectId(req.body.createdBy),
		createdAt: new Date(),
	};

	db_connect
		.collection("product")
		.insertOne(myobj)
		.then((doc) => {
			res.status(201).json({
				message: "Product insert Successfully",
			});
		})
		.catch((er) => {
			res.status(500).json({
				error: er,
			});
		});
	// });
};

const getAllProduct = (req, res, next) => {
	let db_connect = dbo.getDb();
	let redisClient = redisCreateClient();

	db_connect
		.collection("product")
		.find({})
		.toArray()
		.then((products) => {
			redisClient.set("products", JSON.stringify(products)).then(() => {
				redisClient.expire("products", 600);
				res.status(200).json({
					fromCache: false,
					message: products,
				});
			});
		})
		.catch((er) => {
			console.log("masuk eror di produk");
			res.status(500).json({
				error: er,
			});
		});
};

const getProductByCategorySlug = (req, res, next) => {
	let db_connect = dbo.getDb();
	let redisClient = redisCreateClient();
	let filter = {};
	if (req.query.hasOwnProperty("filter")) {
		filter["price"] = parseInt(req.query.price);
	}
	console.log("tes " + req.query.price);
	console.log(filter);
	const slug = req.params.categorySlug;

	db_connect
		.collection("category")
		.findOne({ slug: slug })
		.then((category) => {
			if (category) {
				if (category.parent == "") {
					db_connect
						.collection("category")
						.find({ parent: category._id })
						.toArray()
						.then((categories) => {
							const categoriesAr = categories.map(
								(category) => category._id
							);
							db_connect
								.collection("product")
								.find({ category: { $in: categoriesAr } })
								.sort(filter)
								.toArray()
								.then((products) => {
									redisClient
										.set(slug, JSON.stringify(products))
										.then(() => {
											redisClient.expire(slug, 600);
											res.status(200).json({
												fromCache: false,
												message: products,
											});
										});
								})
								.catch((error) => {
									res.status(500).json({
										error: error,
									});
								});
						})
						.catch((error) => {});
				} else {
					console.log(category.name);
					db_connect
						.collection("product")
						.find({ category: category._id }, { sort: filter })
						.toArray()
						.then((products) => {
							redisClient
								.set(slug, JSON.stringify(products))
								.then(() => {
									redisClient.expire(slug, 600);
									res.status(200).json({
										fromCache: false,
										message: products,
									});
								});
						})
						.catch((error) => {
							return res.status(404).json({
								message: error,
							});
						});
				}
			} else {
				return res.status(404).json({
					message: "Not Found",
				});
			}
		})
		.catch((er) => {
			res.status(500).json({
				error: "test eror",
			});
		});
};

const getOneProduct = (req, res, next) => {
	const db_connect = dbo.getDb();
	const redisClient = redisCreateClient();
	const productSlug = req.params.productSlug;
	db_connect
		.collection("product")
		.findOne({ slug: productSlug })
		.then((product) => {
			if (product) {
				redisClient.set(productSlug, JSON.stringify(product)).then(() => {
					redisClient.expire(productSlug, 600);
					res.status(200).json({
						fromCache: false,
						message: product,
					});
				});
			} else {
				return res.status(404).json({
					message: "Not Found",
				});
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
};

const updateStockProductById = (req, res, next) => {
	let db_connect = dbo.getDb();
	db_connect
		.collection("product")
		.findOneAndUpdate(
			{ _id: ObjectId(req.params.idProduk) },
			{
				$set: {
					stock: parseInt(req.body.stock),
				},
			}
		)
		.then((newItem) => {
			res.status(201).json({
				message: "Stock Updated!",
			});
		})
		.catch((error) => {
			res.status(500).json({
				message: error,
			});
		});
};

module.exports = {
	addNewProduct,
	getAllProduct,
	getOneProduct,
	getProductByCategorySlug,
	updateStockProductById,
};
