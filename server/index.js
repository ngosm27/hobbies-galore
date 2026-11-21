require("dotenv").config();

const express = require("express");
const {
	MONGODB_DATABASE,
	connectToMongo,
	closeMongo,
	getDatabase,
} = require("./db/mongo");
const hobbyEventsRouter = require("./routes/hobbyEvents");
const hobbyCategoriesRouter = require("./routes/hobbyCategories");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (request, response) => {
	response.json({ message: "Hobbies Galore API is running" });
});

app.get("/api/health", async (request, response, next) => {
	try {
		await getDatabase().command({ ping: 1 });
		response.json({ status: "ok", database: MONGODB_DATABASE });
	} catch (error) {
		next(error);
	}
});

app.use("/api/hobby-events", hobbyEventsRouter);
app.use("/api/hobby-categories", hobbyCategoriesRouter);
app.use(errorHandler);

async function startServer() {
	try {
		await connectToMongo();

		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
			console.log(`MongoDB database: ${MONGODB_DATABASE}`);
		});
	} catch (error) {
		console.error("Could not connect to MongoDB:", error.message);
		process.exit(1);
	}
}

async function shutdown() {
	await closeMongo();
	process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
