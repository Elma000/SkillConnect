import express from "express";
import {
  createCourse,
  getCoursesByOwner,
  findCourseById,
  updateCourse,
  deleteCourse,
} from "../service/course.service.js";
import { checkAndNotifyIncompleteItems } from "../service/notificationChecker.service.js";

const courseRoute = express.Router();

// Create course for logged user
courseRoute.post("/create", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  const { title, description, lessons } = req.body;
  if (!title) return res.status(400).send("Title is required");
  try {
    const course = await createCourse({
      title,
      description,
      lessons,
      owner: req.userId,
    });
    res.status(201).send(course);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// List courses for user
courseRoute.get("/entries", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  try {
    const courses = await getCoursesByOwner(req.userId);
    res.status(200).send(courses);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Get single course
courseRoute.get("/:id", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  try {
    const course = await findCourseById(req.params.id);
    if (!course) return res.status(404).send("Course not found");
    if (course.owner.toString() !== req.userId)
      return res.status(403).send("Forbidden");
    res.status(200).send(course);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Update course
courseRoute.put("/update/:id", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  try {
    const course = await findCourseById(req.params.id);
    if (!course) return res.status(404).send("Course not found");
    if (course.owner.toString() !== req.userId)
      return res.status(403).send("Forbidden");
    const update = {};
    if (req.body.title !== undefined) update.title = req.body.title;
    if (req.body.description !== undefined) update.description = req.body.description;
    if (req.body.lessons !== undefined) update.lessons = req.body.lessons;
    const updated = await updateCourse(req.params.id, update);
    
    // Check for incomplete items and send notifications (async, don't wait)
    checkAndNotifyIncompleteItems(req.userId, false).catch(err => 
      console.error("Error checking incomplete items:", err)
    );
    
    res.status(200).send(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete course
courseRoute.delete("/delete/:id", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  try {
    const course = await findCourseById(req.params.id);
    if (!course) return res.status(404).send("Course not found");
    if (course.owner.toString() !== req.userId)
      return res.status(403).send("Forbidden");
    await deleteCourse(req.params.id);
    res.status(200).send({ message: "Course deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default courseRoute;

