import { Schema, ObjectId, model } from "mongoose";

const goalSchema = new Schema(
  {
    title: { type: String, required: true },
    done: { type: Boolean, default: false },
  },
  { _id: false }
);

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    goals: { type: [goalSchema], default: [] },
    owner: { type: ObjectId, ref: "users", required: true },
  },
  {
    timestamps: true,
  }
);

const Task = model("tasks", taskSchema);
export default Task;

export const createTask = async ({ title, content, goals, owner }) => {
  const task = new Task({ title, content: content || "", goals: goals || [], owner });
  return await task.save();
};

export const getTasksByOwner = async (ownerId) => {
  return await Task.find({ owner: ownerId }).sort({ updatedAt: -1 });
};

export const findTaskById = async (id) => {
  return await Task.findById(id);
};

export const updateTask = async (id, update) => {
  return await Task.findByIdAndUpdate(id, update, { new: true });
};

export const deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};

// Get incomplete tasks for a user (tasks with at least one incomplete goal)
export const getIncompleteTasks = async (userId) => {
  const tasks = await Task.find({ owner: userId });
  return tasks.filter((task) => {
    if (!task.goals || task.goals.length === 0) return false;
    return task.goals.some((goal) => !goal.done);
  });
};