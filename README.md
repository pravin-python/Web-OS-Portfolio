# Web-OS Portfolio Simulator

A robust, production-grade Web-based Operating System Simulator designed as a portfolio showcase. This project is built using a decoupled architecture with a full-stack Django backend acting as the kernel/system manager, and a modern React, TypeScript, and TailwindCSS frontend managing the Window Desktop environment.

## 🚀 Features

- **Window Management**: Fully functional draggable, resizable, and minimizable windows with Z-index handling.
- **Virtual File System**: A simulated backend file system mapping directories and files.
- **Interactive Terminal**: An integrated command-line interface capable of executing server-side parsed commands (e.g., `cd`, `ls`, `help`).
- **Core OS Applications**:
  - File Explorer
  - Notepad (with CRUD capabilities)
  - Games: Snake and Tic Tac Toe
- **Customization**: Glassmorphism UI with context-menu (right-click) support on the desktop.
- **RESTful API**: Centralized routing, strict JSON responses, JWT Authentication, and auto-generated Swagger documentation.
- **Role-Based Access**: Specialized Django models for Users interactively controlled via API.

## 🛠️ Technology Stack

**Backend**:
- Django 5.x
- Django REST Framework (DRF)
- SQLite (Local) / PostgreSQL (Ready)
- JWT Authentication (`djangorestframework-simplejwt`)
- Swagger (`drf-yasg`)

**Frontend**:
- React 19 + TypeScript
- Vite
- Zustand (State Management)
- TailwindCSS v4
- `react-rnd` (Window interactions)
- Lucide React (Icons)

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Web-OS-Portfolio
```

### 2. Backend Setup
Navigate to the root directory for the Django setup.
```bash
# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Initialize the file system and default admin
python manage.py create_default_admin
python manage.py init_filesystem

# Run the development server
python manage.py runserver
```
The backend will be available at `http://localhost:8000`. API documentation is available at `http://localhost:8000/api/v1/swagger/`.

### 3. Frontend Setup
Open a new terminal and navigate to the `frontend` folder.
```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## 📂 Project Structure

- `Portfolio-OS/`: Django backend project containing custom OS apps (users, core, terminal, filesystem, notes, etc.).
- `frontend/`: Vite React application hosting the user interface desktop environment.

## 📄 License
MIT License
