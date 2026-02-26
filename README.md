# Web-OS Portfolio Simulator (Frontend-Only Edition)

A robust, production-grade Web-based Operating System Simulator designed as a portfolio showcase. This project is a **100% frontend-only static application** built with React, TypeScript, and TailwindCSS, managing the Window Desktop environment entirely in the browser.

There is **no backend, no database, and no server-side processing**. All state is managed locally via `localStorage` and static JSON files, making it incredibly fast and deployable anywhere.

## 🚀 Features

- **Window Management**: Fully functional draggable, resizable, and minimizable windows with Z-index handling.
- **Virtual File System**: A simulated file system reading dynamically from static JSON (`src/data/filesystem.json`).
- **Interactive Terminal**: An integrated command-line interface capable of executing simulated commands (e.g., `cd`, `ls`, `help`, `cat`, `run snake`).
- **Core OS Applications**:
  - File Explorer (JSON-based read-only view)
  - Notepad (saves locally to `localStorage`)
  - Games: Snake, Tic Tac Toe, and 2048
- **Customization**: Glassmorphism UI, context-menu support on the desktop, and persistent state across reloads.
- **Frontend Architecture**: Pure static application. Role-based access and backend APIs have been completely removed for maximum simplicity and portability.

## 🛠️ Technology Stack

**Frontend**:

- React 19 + TypeScript
- Vite
- Zustand (State Management)
- TailwindCSS v4
- `react-rnd` (Window interactions)
- Lucide React (Icons)
- LocalStorage Engine for state persistence

## 📦 Local Development

### 1. Clone the repository

```bash
git clone https://github.com/pravin-python/Web-OS-Portfolio.git
cd Web-OS-Portfolio/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## 🚀 Build & Deploy Instructions (Static Hosting)

Because this project is 100% static, it can be deployed on any static hosting provider like GitHub Pages, Vercel, Netlify, or Cloudflare Pages.

### Local Build

```bash
cd frontend
npm run build
```

This generates a `dist/` folder containing the compiled, minified HTML, CSS, JS, and JSON data files.

### 🟢 Deploying to Vercel

1. Push your code to GitHub.
2. Log in to [Vercel](https://vercel.com/) and create a "New Project".
3. Import your repository.
4. Set the Framework Preset to **Vite** (Vercel usually detects this automatically).
5. Set the Root Directory to `frontend`.
6. Click **Deploy**.

### 🟢 Deploying to Netlify

1. Push your code to GitHub.
2. Log in to [Netlify](https://www.netlify.com/) and click "Add new site" > "Import an existing project".
3. Connect your GitHub repository.
4. Base directory: `frontend`
5. Build command: `npm run build`
6. Publish directory: `frontend/dist`
7. Click **Deploy site**.

### 🟢 Deploying to GitHub Pages

1. Install the `gh-pages` package:

   ```bash
   cd frontend
   npm install gh-pages --save-dev
   ```

2. Update `frontend/package.json` with a homepage URL:

   ```json
   "homepage": "https://<your-github-username>.github.io/Web-OS-Portfolio",
   ```

   _Note: If deploying to a custom domain or apex, just use `.` or the absolute path._

3. Add deploy scripts to `package.json`:

   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist",
     ...
   }
   ```

4. Run the deploy command:

   ```bash
   npm run deploy
   ```

## 📂 Project Structure

- `frontend/src/apps/`: Individual OS applications (File Explorer, Terminal, Games).
- `frontend/src/core/`: OS system components (Desktop, Taskbar, Window Manager).
- `frontend/src/data/`: Static JSON data serving as the "database" (Filesystem, Projects, Skills, etc.).
- `frontend/src/services/`: Local service wrappers (`storage.ts` for localStorage, `filesystem.ts` for JSON parsing).

## 📄 License

MIT License
