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
