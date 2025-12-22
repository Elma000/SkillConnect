import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import ProfileEdit from "./pages/ProfileEdit.jsx";
import NotepadList from "./pages/NotepadList.jsx";
import NotepadEdit from "./pages/NotepadEdit.jsx";
import NotepadView from "./pages/NotepadView.jsx";
import TaskList from "./pages/TaskList.jsx";
import TaskView from "./pages/TaskView.jsx";
import TaskEdit from "./pages/TaskEdit.jsx";
import Notifications from "./pages/Notifications.jsx";
import SkillSearch from "./pages/SkillSearch.jsx";
import Layout from "./layouts/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "profile", element: <Profile /> },
      { path: "profile/edit", element: <ProfileEdit /> },
      { path: "notepad", element: <NotepadList /> },
      { path: "notepad/new", element: <NotepadEdit /> },
      { path: "notepad/:id", element: <NotepadView /> },
      { path: "notepad/:id/edit", element: <NotepadEdit /> },
      { path: "task", element: <TaskList /> },
      { path: "task/new", element: <TaskEdit /> },
      { path: "task/:id", element: <TaskView /> },
      { path: "task/:id/edit", element: <TaskEdit /> },
      { path: "notifications", element: <Notifications /> },
      { path: "skillsearch", element: <SkillSearch /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);