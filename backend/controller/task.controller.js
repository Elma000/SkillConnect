import express from "express";
import { createTask, getTasksByOwner, findTaskById, updateTask, deleteTask } from "../service/task.service.js";
import { checkAndNotifyIncompleteItems } from "../service/notificationChecker.service.js";

const taskRoute = express.Router();

// create task for logged user
taskRoute.post("/create", async (req, res) => {
	if (!req.userId) return res.status(401).send("Unauthorized");
	const { title, content, goals } = req.body;
	if (!title) return res.status(400).send("Title is required");
	try {
		const task = await createTask({ title, content, goals, owner: req.userId });
		res.status(201).send(task);
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal Server Error");
	}
});

// list tasks for user with completion percent
taskRoute.get("/entries", async (req, res) => {
	if (!req.userId) return res.status(401).send("Unauthorized");
	try {
		const tasks = await getTasksByOwner(req.userId);
		const withPercent = tasks.map((t) => {
			const total = (t.goals || []).length;
			const done = (t.goals || []).filter((g) => g.done).length;
			const percent = total === 0 ? 0 : Math.round((done / total) * 100);
			return { ...t.toObject(), percentCompleted: percent };
		});
		res.status(200).send(withPercent);
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal Server Error");
	}
});

taskRoute.get("/:id", async (req, res) => {
	if (!req.userId) return res.status(401).send("Unauthorized");
	try {
		const task = await findTaskById(req.params.id);
		if (!task) return res.status(404).send("Task not found");
		if (task.owner.toString() !== req.userId) return res.status(403).send("Forbidden");
		const total = (task.goals || []).length;
		const done = (task.goals || []).filter((g) => g.done).length;
		const percent = total === 0 ? 0 : Math.round((done / total) * 100);
		res.status(200).send({ ...task.toObject(), percentCompleted: percent });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal Server Error");
	}
});

taskRoute.put("/update/:id", async (req, res) => {
	if (!req.userId) return res.status(401).send("Unauthorized");
	try {
		const task = await findTaskById(req.params.id);
		if (!task) return res.status(404).send("Task not found");
		if (task.owner.toString() !== req.userId) return res.status(403).send("Forbidden");
		const update = {};
		if (req.body.title !== undefined) update.title = req.body.title;
		if (req.body.content !== undefined) update.content = req.body.content;
		if (req.body.goals !== undefined) update.goals = req.body.goals; // replace full goals array
		const updated = await updateTask(req.params.id, update);
		const total = (updated.goals || []).length;
		const done = (updated.goals || []).filter((g) => g.done).length;
		const percent = total === 0 ? 0 : Math.round((done / total) * 100);
		
		// Check for incomplete items and send notifications (async, don't wait)
		checkAndNotifyIncompleteItems(req.userId, false).catch(err => 
			console.error("Error checking incomplete items:", err)
		);
		
		res.status(200).send({ ...updated.toObject(), percentCompleted: percent });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal Server Error");
	}
});

taskRoute.delete("/delete/:id", async (req, res) => {
	if (!req.userId) return res.status(401).send("Unauthorized");
	try {
		const task = await findTaskById(req.params.id);
		if (!task) return res.status(404).send("Task not found");
		if (task.owner.toString() !== req.userId) return res.status(403).send("Forbidden");
		await deleteTask(req.params.id);
		res.status(200).send({ message: "Task deleted" });
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal Server Error");
	}
});

export default taskRoute;