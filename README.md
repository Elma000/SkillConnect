# MERN Course Project

This repository contains a simple MERN (MongoDB, Express, React, Node) course project scaffold with separate `backend` and `frontend` folders.

## Repo Structure

- backend/ - Express web server, API routes, dotenv configuration and development tooling (nodemon)
- frontend/ - React (Vite) client

## Prerequisites

- Node.js (recommended >= 18.x)
- npm (Node package manager)
- Optional: `nvm` or other Node version managers


## Backend (Development)

This repo uses `nodemon` to restart the backend server automatically when files change. The backend has a `nodemon.json` configuration file and a `dev` script in the `package.json`.

- Start the backend dev server:

```powershell
npm run dev
```

- Production start (run the built/packaged server or `node .`):

```powershell
npm start
```

### nodemon

- Where: `backend/nodemon.json` and `package.json` both contain nodemon config entries.
- Behavior: nodemon watches the backend directory and ignores `node_modules` to avoid unnecessary restarts.
- To add Node inspector (debug):

```json
"scripts": {
	"dev:debug": "nodemon --inspect=9229 ."
}
```

## Frontend (Development)

The frontend uses Vite. Run the dev server with:

```powershell
npm run dev
```

To create a production build:

```powershell
npm run build
```

## Environment variables

Backend uses `dotenv`. Add a `.env` file in `backend/` with values for things like `PORT`, `MONGODB_URI`, etc. Example:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mydb

```

## Useful Commands

- Backend dev: `npm run dev`  (inside `backend`)
- Backend prod: `npm start` (inside `backend`)
- Frontend dev: `npm run dev` (inside `frontend`)
- Frontend build: `npm run build` (inside `frontend`)

## Further Suggestions

- If you want nodemon to watch only `src/` or subfolders, update `nodemon.json` or `nodemonConfig` in `backend/package.json`.
- Consider adding a root `package.json` or scripts for convenience (if you want to `npm run dev` from repo root to start both backend and frontend). For example, add a root `dev` script using `concurrently`:

```
npm install --save-dev concurrently
```

And in root `package.json`:

```json
"scripts": {
	"dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""
}
```

## License

This project is scaffolded for learning; check or specify an open-source license if you plan to publish or collaborate.

---

If you'd like, I can add a root-level `package.json` with convenience scripts, or add a `Makefile`/PowerShell script to start both backend and frontend together. Which would you prefer? 💡
