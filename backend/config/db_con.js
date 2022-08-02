const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.DB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

var _db;

module.exports = {
	connectToServer: function (callback) {
		client.connect(function (err, db) {
			// Verify we got a good "db" object
			if (db) {
				_db = db.db(process.env.DB_NAME);
				console.log("Successfully connected to MongoDB.");
			}
			return callback(err);
		});
	},

	getDb: function () {
		return _db;
	},
};
