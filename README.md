# 🖥️ Web-OS Portfolio — Interactive Developer Portfolio

> A fully interactive **Operating System-style portfolio** hosted on GitHub Pages.  
> 🌐 **Live Demo:** [pravin-python.github.io/Web-OS-Portfolio](https://pravin-python.github.io/Web-OS-Portfolio)

A real desktop OS experience in the browser — built with **React, TypeScript, Zustand, and TailwindCSS v4**. Drag windows, use the terminal, open apps, play games, and explore my work — all without a backend.

---

## ✨ Features

### 🗂️ Desktop Environment

- **Window Manager** — Draggable, resizable, minimizable, maximizable windows with macOS-style traffic light buttons
- **Taskbar & Dock** — Running apps shown in taskbar with minimize/restore support
- **System Tray** — Clock, notifications, and quick-access menu
- **Right-click Context Menu** — Desktop-level actions
- **Mobile Support** — Responsive layout with mobile orientation guard and popup

### 📱 Installed Applications

| App                                                                                                              | Route              | Description                                                               |
| ---------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------- |
| <img src="https://pravin-python.github.io/Web-OS-Portfolio/svg/system/about.svg" width="20"> About Me            | `/about`           | Developer profile — skills, education, experience                         |
| <img src="https://pravin-python.github.io/Web-OS-Portfolio/svg/system/contact.svg" width="20"> Contact Center    | `/contact`         | Email, LinkedIn, GitHub, social links                                     |
| <img src="https://pravin-python.github.io/Web-OS-Portfolio/svg/apps/predictor.svg" width="20"> AI Predictor      | `/ai-predictor`    | ML model-powered interactive predictions                                  |
| <img src="https://pravin-python.github.io/Web-OS-Portfolio/svg/apps/model-logs.svg" width="20"> AI Research Lab  | `/model-logs`      | Model experiments and training logs                                       |
| <img src="https://pravin-python.github.io/Web-OS-Portfolio/svg/system/dataset.svg" width="20"> Datasets          | `/datasets`        | Dataset viewer for ML experiments                                         |
| <img src="https://pravin-python.github.io/Web-OS-Portfolio/svg/apps/dsa-lab.svg" width="20"> DSA Lab             | `/dsa-lab`         | Interactive Data Structures & Algorithms explorer with Python & Java code |
| <img src="https://pravin-python.github.io/Web-OS-Portfolio/svg/apps/ml-lab.svg" width="20"> ML Lab               | `/ml-lab`          | Machine Learning learning lab — concepts, algorithms, visualizations      |
| <img src="https://pravin-python.github.io/Web-OS-Portfolio/svg/system/security.svg" width="20"> Security Toolkit | `/security`        | URL/phishing detection, hashing, encryption tools                         |
| <img src="https://pravin-python.github.io/Web-OS-Portfolio/svg/system/terminal.svg" width="20"> Terminal         | `/terminal`        | Integrated CLI with OS commands (`ls`, `cd`, `run snake`, `help`, etc.)   |
| <img src="https://pravin-python.github.io/Web-OS-Portfolio/svg/system/folder.svg" width="20"> Files              | `/files`           | Virtual file system explorer (JSON-based)                                 |
| <img src="https://pravin-python.github.io/Web-OS-Portfolio/svg/apps/notepad.svg" width="20"> Notepad             | `/notes`           | Local notepad with `localStorage` persistence                             |
| <img src="https://pravin-python.github.io/Web-OS-Portfolio/svg/system/log.svg" width="20"> System Logs           | `/system-logs`     | Real-time OS event log viewer                                             |
| <img src="https://pravin-python.github.io/Web-OS-Portfolio/svg/apps/snake.svg" width="20"> Neural Snake          | `/games/snake`     | Cyberpunk snake game with neon visuals                                    |
| <img src="https://pravin-python.github.io/Web-OS-Portfolio/svg/apps/tictactoe.svg" width="20"> TicTacToe AI      | `/games/tictactoe` | Minimax algorithm AI opponent                                             |
| <img src="https://pravin-python.github.io/Web-OS-Portfolio/svg/apps/game-2048.svg" width="20"> Logic Grid 2048   | `/games/2048`      | Classic 2048 sliding puzzle                                               |
| <img src="https://pravin-python.github.io/Web-OS-Portfolio/svg/system/trash.svg" width="20"> Trash               | `/trash`           | Trash bin for deleted virtual files                                       |

---

## 🛠️ Tech Stack

| Layer               | Technology                        |
| ------------------- | --------------------------------- |
| Framework           | React 19 + TypeScript             |
| Build Tool          | Vite                              |
| State Management    | Zustand                           |
| Styling             | TailwindCSS v4                    |
| Routing             | React Router v7 (`BrowserRouter`) |
| Window Interactions | `react-rnd`                       |
| Icons               | Lucide React + Custom SVGs        |
| Persistence         | `localStorage`                    |
| Hosting             | GitHub Pages                      |

---

## 🌐 Live Deployment

**URL:** [https://pravin-python.github.io/Web-OS-Portfolio](https://pravin-python.github.io/Web-OS-Portfolio)

This app uses **React Router `BrowserRouter`** with clean paths (no `#`).  
A custom `public/404.html` handles GitHub Pages SPA deep-link redirects, allowing direct URL access to any route like `/about` or `/dsa-lab`.

---

## 📦 Local Development

### 1. Clone

```bash
git clone https://github.com/pravin-python/Web-OS-Portfolio.git
cd Web-OS-Portfolio
```

### 2. Install

```bash
npm install
```

### 3. Run

```bash
npm run dev
```

App runs at: `http://localhost:5173/Web-OS-Portfolio/`

---

## 🚀 Build & Deploy

```bash
npm run build
```

Generates a `dist/` folder. Deploy it to GitHub Pages with:

```bash
npm run deploy
```

> Requires `gh-pages` and a `deploy` script in `package.json`.

---

## 📂 Project Structure

```
src/
├── apps/               # Individual applications (Terminal, Games, DSALab, MLLab, etc.)
├── core/               # OS core (appRegistry, appLauncher, state, device detection)
│   ├── appRegistry.ts  # All app definitions & routes
│   ├── appLauncher.ts  # App launch logic
│   └── state/          # Zustand stores (windows, notifications, etc.)
├── components/         # Shared UI components (Window, Taskbar, Dock, Tray, etc.)
├── layouts/            # DesktopLayout — wraps all apps in the OS shell
├── router/             # OSRouter — bridges URL changes to window management
├── hooks/              # Custom hooks (useDraggable, etc.)
└── data/               # Static JSON data (filesystem, projects, skills)

public/
├── svg/                # App icons (system/, apps/)
├── 404.html            # GitHub Pages SPA redirect handler
├── manifest.json       # PWA manifest
└── sitemap.xml         # SEO sitemap
```

---

## 🔒 No Backend Required

This is a **100% frontend-only static application**.

- No server, no database, no API calls
- All data served from static JSON files
- State persisted via `localStorage`
- Deployable on any static host (GitHub Pages, Vercel, Netlify)

---

## 👨‍💻 Author

**Pravin Prajapati** — Freelance Full-Stack Developer  
Python · Java · AI Agent Development · Web Scraping · PHP eCommerce

- 🌐 [Portfolio](https://pravin-python.github.io/Web-OS-Portfolio)
- 💼 [LinkedIn](https://linkedin.com/in/pravin-prajapati-706722281)
- 🐙 [GitHub](https://github.com/pravin-python)
- 📧 pravin.prajapati0126@gmail.com

---

## 📄 License

MIT License
