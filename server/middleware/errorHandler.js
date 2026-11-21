function errorHandler(error, request, response, next) {
	console.error(error);
	response.status(500).json({ error: "Database operation failed" });
}

module.exports = errorHandler;
