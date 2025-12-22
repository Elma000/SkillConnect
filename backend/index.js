import "dotenv/config";
import "./db.js";
import express from "express";
import jwt from "jsonwebtoken";
import notepadRoute from "./controller/notepad.controller.js";
import userRoute from "./controller/user.controller.js";
import taskRoute from "./controller/task.controller.js";
import notificationRoute from "./controller/notification.controller.js";
import skillRoute from "./controller/skill.controller.js";
import courseRoute from "./controller/course.controller.js";
import {
  findUserByEmail,
  createUser,
  getLoginUser,
} from "./service/user.service.js";
import { authMiddleware } from "./controller/middleware.js";
import cors from "cors";
const app = express();
// increase JSON body limit to allow base64 images in profile updates
app.use(express.json({ limit: "2mb" }), express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
app.use(
  cors({
    origin: "*",
  })
);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await getLoginUser({ email, password });
    if (user) {
      // make jwt token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).send({ userId: user._id, token });
    } else {
      res.status(401).send("Invalid email or password");
    }
  } else {
    res.status(400).send("Missing email or password");
  }
});

app.post("/signup", async (req, res) => {
  const { email, password, fullName } = req.body;
  if (email && password && fullName) {
    const duplicateEmail = await findUserByEmail(email);
    if (duplicateEmail) {
      return res.status(400).send("User already exists");
    }

    createUser({ email, password, fullName })
      .then((user) => {
        res.status(201).send({ userId: user._id });
      })
      .catch((err) => {
        res.status(500).send("Internal Server Error");
      });
  } else {
    res.status(400).send("Missing full name, email or password");
  }
});
app.use("/user", authMiddleware, userRoute);
app.use("/notepad", authMiddleware, notepadRoute);
app.use("/task", authMiddleware, taskRoute);
app.use("/notifications", authMiddleware, notificationRoute);
app.use("/skill", authMiddleware, skillRoute);
app.use("/course", authMiddleware, courseRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});