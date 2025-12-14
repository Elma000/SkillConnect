import { Link, useNavigate } from "react-router";
import { isLoggedIn, logout } from "./services/auth";
import "./App.css"; 

function App() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Welcome to MERN Course Project</h1>
        <p className="mt-4 text-lg text-slate-600">A simple starter project with Express backend and React (Vite) frontend.</p>

        <div className="mt-8 flex items-center justify-center gap-3">
          {isLoggedIn() ? (
            <>
              <Link to="/profile" className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700">Profile</Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="px-4 py-2 rounded-md border border-slate-200 hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700">Sign in</Link>
              <Link to="/signup" className="px-4 py-2 rounded-md border border-slate-200 hover:bg-slate-50">Create account</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
