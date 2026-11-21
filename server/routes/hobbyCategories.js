const express = require("express");
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../db/mongo");

const router = express.Router();

function collection() {
	return getDatabase().collection("hobby-categories");
}

function getTimestamp() {
	return new Date().toISOString();
}

router.get("/", async (request, response, next) => {
	try {
		const categories = await collection()
			.find({})
			.sort({ type: 1, category: 1 })
			.toArray();
		response.json(categories);
	} catch (error) {
		next(error);
	}
});

router.get("/:id", async (request, response, next) => {
	try {
		if (!ObjectId.isValid(request.params.id)) {
			return response
				.status(400)
				.json({ error: "Invalid hobby category id" });
		}

		const category = await collection().findOne({
			_id: new ObjectId(request.params.id),
		});
		if (!category) {
			return response
				.status(404)
				.json({ error: "Hobby category not found" });
		}

		response.json(category);
	} catch (error) {
		next(error);
	}
});

router.post("/", async (request, response, next) => {
	try {
		const timestamp = getTimestamp();
		const category = {
			name:
				typeof request.body.name === "string"
					? request.body.name.trim()
					: "",
			type:
				typeof request.body.type === "string"
					? request.body.type.trim().toUpperCase()
					: "",
			category:
				typeof request.body.category === "string"
					? request.body.category.trim()
					: "",
			createdTimestamp: timestamp,
			modifiedTimestamp: timestamp,
		};

		if (
			typeof request.body.subCategory === "string" &&
			request.body.subCategory.trim()
		) {
			category.subCategory = request.body.subCategory.trim();
		}

		if (!category.name || !category.type || !category.category) {
			return response.status(400).json({
				error: "name, type, and category are required",
			});
		}

		if (!["PERSON", "LOCATION", "ACTIVITY"].includes(category.type)) {
			return response.status(400).json({
				error: "type must be PERSON, LOCATION, or ACTIVITY",
			});
		}

		const result = await collection().insertOne(category);
		response.status(201).json({ ...category, _id: result.insertedId });
	} catch (error) {
		next(error);
	}
});

router.put("/:id", async (request, response, next) => {
	try {
		if (!ObjectId.isValid(request.params.id)) {
			return response
				.status(400)
				.json({ error: "Invalid hobby category id" });
		}

		const update = { modifiedTimestamp: getTimestamp() };
		for (const field of ["name", "category"]) {
			if (request.body[field] !== undefined)
				update[field] = request.body[field];
		}
		if (request.body.subCategory !== undefined) {
			if (
				typeof request.body.subCategory === "string" &&
				request.body.subCategory.trim()
			) {
				update.subCategory = request.body.subCategory.trim();
			} else {
				update.subCategory = null;
			}
		}

		if (request.body.type !== undefined) {
			if (typeof request.body.type !== "string") {
				return response.status(400).json({
					error: "type must be PERSON, LOCATION, or ACTIVITY",
				});
			}

			const type = request.body.type.trim().toUpperCase();
			if (!["PERSON", "LOCATION", "ACTIVITY"].includes(type)) {
				return response.status(400).json({
					error: "type must be PERSON, LOCATION, or ACTIVITY",
				});
			}
			update.type = type;
		}

		const category = await collection().findOneAndUpdate(
			{ _id: new ObjectId(request.params.id) },
			{ $set: update },
			{ returnDocument: "after" },
		);

		if (!category) {
			return response
				.status(404)
				.json({ error: "Hobby category not found" });
		}

		response.json(category);
	} catch (error) {
		next(error);
	}
});

router.delete("/:id", async (request, response, next) => {
	try {
		if (!ObjectId.isValid(request.params.id)) {
			return response
				.status(400)
				.json({ error: "Invalid hobby category id" });
		}

		const result = await collection().deleteOne({
			_id: new ObjectId(request.params.id),
		});
		if (result.deletedCount === 0) {
			return response
				.status(404)
				.json({ error: "Hobby category not found" });
		}

		response.status(204).send();
	} catch (error) {
		next(error);
	}
});

module.exports = router;
