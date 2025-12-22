import { Schema, ObjectId, model } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    fullName: String,
    email: String,
    password: String,
    bio: String,
    profilePicture: String,
    skills: [String],
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      facebook: String,
    },
  },
  {
    timestamps: true,
  }
);
const userModel = model("users", userSchema);
export default userModel;
/**
 *
 * @param {Object} userData
 * @returns Boolean
 */
export const createUser = async (userData) => {
  const user = new userModel({
    fullName: userData.fullName,
    email: userData.email,
    password: bcrypt.hashSync(userData.password, 10),
  });
  return await user.save();
};

export const findUserByEmail = async (email) => {
  return await userModel.findOne({ email });
};

export const findUserById = async (id) => {
  return await userModel.findById(id);
};
export const getLoginUser = async ({ email, password }) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    return null;
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return null;
  }
  return user;
};

/**
 * Search for skills across all users
 * Returns unique skills with count of users who have each skill
 * @param {string} query - Search query (optional)
 * @returns {Array} Array of skills with name and count
 */
export const searchSkills = async (query = "") => {
  const q = (query || "").trim().toLowerCase();
  const pipeline = [
    { $unwind: "$skills" },
    { $match: { skills: { $exists: true, $ne: null, $ne: "" } } },
    { $addFields: { skillLower: { $toLower: "$skills" } } },
  ];

  if (q) {
    pipeline.push({ $match: { skillLower: { $regex: q, $options: "i" } } });
  }

  pipeline.push(
    { $group: { _id: "$skillLower", name: { $first: "$skills" }, count: { $sum: 1 } } },
    { $sort: { count: -1, name: 1 } }
  );

  const rows = await userModel.aggregate(pipeline);
  return rows.map(({ name, count }) => ({ name, count }));
};