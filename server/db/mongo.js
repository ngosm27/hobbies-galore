const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || "hobbies-galore";

const mongoClient = new MongoClient(MONGODB_URI);
let database;

async function connectToMongo() {
	await mongoClient.connect();
	database = mongoClient.db(MONGODB_DATABASE);
	return database;
}

function getDatabase() {
	if (!database) {
		throw new Error("MongoDB is not connected");
	}
	return database;
}

async function closeMongo() {
	await mongoClient.close();
}

module.exports = {
	MONGODB_DATABASE,
	connectToMongo,
	getDatabase,
	closeMongo,
};
