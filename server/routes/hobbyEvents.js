const express = require("express");
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../db/mongo");

const router = express.Router();

function categoriesCollection() {
	return getDatabase().collection("hobby-categories");
}

function collection() {
	return getDatabase().collection("hobby-events");
}

function getTimestamp() {
	return new Date().toISOString();
}

function escapeRegex(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findCategoryName(name, type) {
	if (typeof name !== "string" || !name.trim()) return null;

	return categoriesCollection().findOne({
		name: { $regex: `^${escapeRegex(name.trim())}$`, $options: "i" },
		type: { $regex: `^${escapeRegex(type)}$`, $options: "i" },
	});
}

async function validateEventReferences(event) {
	if (!event.activity) {
		return { error: "activity is required" };
	}
	if (!event.location) {
		return { error: "location is required" };
	}
	if (!Array.isArray(event.people) || event.people.length === 0) {
		return { error: "people must contain at least one person name" };
	}

	if (!(await findCategoryName(event.activity, "ACTIVITY"))) {
		return {
			error: `Activity "${event.activity}" must exist as an activity category`,
		};
	}

	if (!(await findCategoryName(event.location, "LOCATION"))) {
		return {
			error: `Location "${event.location}" must exist as a location category`,
		};
	}

	const missingPeople = [];
	for (const personName of event.people) {
		if (!(await findCategoryName(personName, "PERSON"))) {
			missingPeople.push(personName);
		}
	}

	if (missingPeople.length > 0) {
		return {
			error: "Some people do not exist as person categories",
			missingPeople,
		};
	}

	return null;
}

router.get("/", async (request, response, next) => {
	try {
		const events = await collection()
			.find({})
			.sort({ hobbyDateTime: 1 })
			.toArray();
		response.json(events);
	} catch (error) {
		next(error);
	}
});

router.get("/:id", async (request, response, next) => {
	try {
		if (!ObjectId.isValid(request.params.id)) {
			return response
				.status(400)
				.json({ error: "Invalid hobby event id" });
		}

		const event = await collection().findOne({
			_id: new ObjectId(request.params.id),
		});
		if (!event) {
			return response
				.status(404)
				.json({ error: "Hobby event not found" });
		}

		response.json(event);
	} catch (error) {
		next(error);
	}
});

router.post("/", async (request, response, next) => {
	try {
		const timestamp = getTimestamp();
		const event = {
			hobbyDateTime: request.body.hobbyDateTime,
			activity: request.body.activity,
			people: Array.isArray(request.body.people)
				? request.body.people
						.filter(
							(name) => typeof name === "string" && name.trim(),
						)
						.map((name) => name.trim())
				: [],
			location: request.body.location,
			createdTimestamp: timestamp,
			modifiedTimestamp: timestamp,
		};

		if (!event.hobbyDateTime || !event.activity || !event.location) {
			return response.status(400).json({
				error: "hobbyDateTime, activity, and location are required",
			});
		}

		const validationError = await validateEventReferences(event);
		if (validationError) {
			return response.status(400).json(validationError);
		}

		const result = await collection().insertOne(event);
		response.status(201).json({ ...event, _id: result.insertedId });
	} catch (error) {
		next(error);
	}
});

router.put("/:id", async (request, response, next) => {
	try {
		if (!ObjectId.isValid(request.params.id)) {
			return response
				.status(400)
				.json({ error: "Invalid hobby event id" });
		}

		const update = { modifiedTimestamp: getTimestamp() };
		for (const field of ["hobbyDateTime", "activity", "location"]) {
			if (request.body[field] !== undefined)
				update[field] = request.body[field];
		}
		if (request.body.people !== undefined) {
			update.people = Array.isArray(request.body.people)
				? request.body.people
						.filter(
							(name) => typeof name === "string" && name.trim(),
						)
						.map((name) => name.trim())
				: [];
		}

		const existingEvent = await collection().findOne({
			_id: new ObjectId(request.params.id),
		});
		if (!existingEvent) {
			return response
				.status(404)
				.json({ error: "Hobby event not found" });
		}

		const proposedEvent = { ...existingEvent, ...update };
		const validationError = await validateEventReferences(proposedEvent);
		if (validationError) {
			return response.status(400).json(validationError);
		}

		const event = await collection().findOneAndUpdate(
			{ _id: new ObjectId(request.params.id) },
			{ $set: update },
			{ returnDocument: "after" },
		);

		response.json(event);
	} catch (error) {
		next(error);
	}
});

router.delete("/:id", async (request, response, next) => {
	try {
		if (!ObjectId.isValid(request.params.id)) {
			return response
				.status(400)
				.json({ error: "Invalid hobby event id" });
		}

		const result = await collection().deleteOne({
			_id: new ObjectId(request.params.id),
		});
		if (result.deletedCount === 0) {
			return response
				.status(404)
				.json({ error: "Hobby event not found" });
		}

		response.status(204).send();
	} catch (error) {
		next(error);
	}
});

module.exports = router;
