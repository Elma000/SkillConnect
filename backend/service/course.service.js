import { Schema, ObjectId, model } from "mongoose";

const lessonSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    completed: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    lessons: { type: [lessonSchema], default: [] },
    owner: { type: ObjectId, ref: "users", required: true },
    progress: { type: Number, default: 0 }, // Percentage completed
  },
  {
    timestamps: true,
  }
);

const Course = model("courses", courseSchema);
export default Course;

export const createCourse = async ({ title, description, lessons, owner }) => {
  const course = new Course({
    title,
    description: description || "",
    lessons: lessons || [],
    owner,
    progress: 0,
  });
  return await course.save();
};

export const getCoursesByOwner = async (ownerId) => {
  return await Course.find({ owner: ownerId }).sort({ updatedAt: -1 });
};

export const findCourseById = async (id) => {
  return await Course.findById(id);
};

export const updateCourse = async (id, update) => {
  const course = await Course.findByIdAndUpdate(id, update, { new: true });
  if (course && course.lessons) {
    // Calculate progress
    const totalLessons = course.lessons.length;
    const completedLessons = course.lessons.filter((l) => l.completed).length;
    course.progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    await course.save();
  }
  return course;
};

export const deleteCourse = async (id) => {
  return await Course.findByIdAndDelete(id);
};

// Get incomplete courses for a user
export const getIncompleteCourses = async (userId) => {
  const courses = await Course.find({ owner: userId });
  return courses.filter((course) => {
    if (!course.lessons || course.lessons.length === 0) return false;
    return course.lessons.some((lesson) => !lesson.completed);
  });
};

