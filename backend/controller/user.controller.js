import express from "express";
import userModel, { findUserById } from "./../service/user.service.js";

const userRoute = express.Router();

// NOTE: don't need, just remove token on client side to "logout"
// userRoute.delete('/logout', (req, res) => {
// Logic for logging out a user
// });
userRoute.get("/profile", async (req, res) => {
  // require authenticated user
  if (!req.userId) return res.status(401).send("Unauthorized");
  const user = await findUserById(req.userId);
  if (user) {
    res.status(200).send({
      fullName: user.fullName,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      skills: user.skills,
      socialLinks: user.socialLinks,
    });
  } else {
    res.status(404).send("User not found");
  }
});
userRoute.put("/update", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  // Accept only allowed fields to avoid accidental overwrite
  const allowed = ["fullName", "email", "bio", "profilePicture", "skills", "socialLinks"];
  const update = {};
  for (const k of allowed) {
    if (req.body[k] !== undefined) update[k] = req.body[k];
  }

  // if profilePicture is provided as data URL, we store it directly (base64)
  if (update.profilePicture && typeof update.profilePicture === "string") {
    // optional basic validation: must start with data:image/
    if (!update.profilePicture.startsWith("data:image/")) {
      return res.status(400).send("Invalid profilePicture format");
    }
  }

  const user = await userModel.findByIdAndUpdate(req.userId, update, {
    new: true,
  });
  if (user) {
    res.status(200).send({ message: "User updated successfully", user });
  } else {
    res.status(404).send("User not found");
  }
});
userRoute.delete("/delete", (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  // Logic for deleting a user account
  userModel
    .findByIdAndDelete(req.userId)
    .then(() => {
      res.status(200).send("User deleted successfully");
    })
    .catch(() => {
      res.status(500).send("Internal Server Error");
    });
});

export default userRoute;
