const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 2019;
const cors = require("cors");
const authenticate = require("./api/middleware/authenticate");
const dbo = require("./config/db_con");

const adminRoutes = require("./api/routes/admins");
const cartItemRoutes = require("./api/routes/cartItems");
const categoryRoutes = require("./api/routes/categories");
const orderRoutes = require("./api/routes/orders");
const productRoutes = require("./api/routes/products");
const userRoutes = require("./api/routes/users");

app.use(cors());
app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/category", categoryRoutes);
app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", authenticate, cartItemRoutes);
app.use("/order", authenticate, orderRoutes);
app.use((req, res, next) => {
	res.status(404).json({
		message: "Not Found",
	});
});

app.listen(port, () => {
	dbo.connectToServer(function (err) {
		if (err) console.error(err);
	});
	console.log(`Server is running on port: ${port}`);
});
