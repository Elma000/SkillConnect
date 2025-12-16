import express from "express";
import { searchSkills } from "../service/user.service.js";

const skillRoute = express.Router();

// Search available skills across all users (auth required)
skillRoute.get("/search", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  try {
    const skills = await searchSkills(req.query.q || "");
    res.status(200).send(skills);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default skillRoute;

