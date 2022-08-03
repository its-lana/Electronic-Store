const { ObjectId } = require("mongodb");
const redisCreateClient = require("../../config/redis_con");
const dbo = require("../../config/db_con");

function categoryTree(parentId, docs) {
	let category = docs.filter(function (doc) {
		return doc.parent.toString() == parentId.toString();
	});

	var categories = [];

	for (var i = 0; i < category.length; i++) {
		categories.push({
			_id: category[i]._id,
			name: category[i].name,
			slug: category[i].slug,
			children: categoryTree(category[i]._id, docs),
		});
	}

	return categories;
}

const getAllCategory = (req, res, next) => {
	const db_connect = dbo.getDb();
	const redisClient = redisCreateClient();

	db_connect
		.collection("category")
		.find({})
		.toArray()
		.then((doc) => {
			const categories = categoryTree("", doc);

			redisClient.set("categories", JSON.stringify(categories)).then(() => {
				redisClient.expire("categories", 600);
				res.status(200).json({
					fromCache: false,
					message: categories,
				});
			});
		})
		.catch((er) => {
			res.status(500).json({
				error: er,
			});
		});
};

const addNewCategory = (req, res, next) => {
	const db_connect = dbo.getDb();
	let prt;
	if (req.body.parent === "") {
		prt = "";
	} else {
		prt = ObjectId(req.body.parent);
	}

	let myobj = {
		name: req.body.name,
		slug: req.body.slug,
		parent: prt,
		createdAt: new Date(),
		createdBy: ObjectId(req.body.createdBy),
	};
	db_connect
		.collection("category")
		.insertOne(myobj)
		.then((doc) => {
			res.status(201).json({
				message: doc,
			});
		})
		.catch((er) => {
			res.status(500).json({
				error: er,
			});
		});
};

module.exports = {
	getAllCategory,
	addNewCategory,
};
