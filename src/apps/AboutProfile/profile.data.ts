/**
 * About Me – Developer Profile — Central data store.
 *
 * All personal / professional data used by the profile dashboard lives here.
 * Update these objects to reflect your real information.
 */

/* ═══════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════ */

export interface ProfileInfo {
  name: string;
  titles: string[];
  tagline: string;
  photoUrl: string;
  github: string;
  linkedin: string;
  email: string;
}

export interface EducationEntry {
  id: string;
  institute: string;
  degree: string;
  years: string;
  subjects: string[];
  icon: string;
}

export interface CareerEntry {
  id: string;
  role: string;
  company: string;
  duration: string;
  responsibilities: string[];
  tools: string[];
  icon: string;
}

export interface ExperiencePoint {
  year: number;
  python: number;
  ml: number;
  web: number;
  security: number;
}

export interface Skill {
  name: string;
  icon: string;
  level: number; // 0–100, keep ≤ 90 for realism
  years: number;
}

export interface SkillCategory {
  category: string;
  icon: string;
  skills: Skill[];
}

export interface TechStackAxis {
  label: string;
  value: number; // 0–100
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  problem: string;
  learned: string;
  icon: string;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface LearningItem {
  id: string;
  topic: string;
  status: "In Progress" | "Practicing" | "Researching";
  progress: number; // 0–100
  icon: string;
}

/* ═══════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════ */

export const PROFILE_INFO: ProfileInfo = {
  name: "Pravin Prajapati",
  titles: [
    "AI & Machine Learning Engineer",
    "Python Developer",
    "Cyber Security Enthusiast",
  ],
  tagline: "Building intelligent systems and security-aware applications.",
  photoUrl: "/image/profile.jpg",
  github: "https://github.com/pravin-python",
  linkedin: "https://linkedin.com/in/pravin-prajapati-706722281",
  email: "pravin.prajapati0126@gmail.com",
};

export const EDUCATION: EducationEntry[] = [
  {
    id: "edu-1",
    institute: "Gujarat University",
    degree: "Bachelor of Computer Applications (BCA)",
    years: "2019 – 2022",
    subjects: [
      "Data Structures",
      "Database Systems",
      "Networking",
      "Operating Systems",
      "Web Technologies",
      "C / C++ Programming",
    ],
    icon: "🎓",
  },
  {
    id: "edu-2",
    institute: "Online / Self-Study",
    degree: "Machine Learning & AI Specialization",
    years: "2022 – Present",
    subjects: [
      "Supervised Learning",
      "Computer Vision",
      "NLP Fundamentals",
      "Deep Learning Basics",
      "Data Processing Pipelines",
    ],
    icon: "🧠",
  },
];

export const CAREER_TIMELINE: CareerEntry[] = [
  {
    id: "career-1",
    role: "Python Developer",
    company: "Professional Experience",
    duration: "2022 – Present",
    responsibilities: [
      "Built automation scripts for document processing pipelines",
      "Developed OCR extraction systems using EasyOCR and OpenCV",
      "Created data cleaning and transformation utilities",
      "Implemented REST APIs with Django and Django REST Framework",
    ],
    tools: ["Python", "OpenCV", "EasyOCR", "Django", "REST APIs", "PostgreSQL"],
    icon: "🐍",
  },
  {
    id: "career-2",
    role: "AI / ML Engineer",
    company: "Project-Based Work",
    duration: "2023 – Present",
    responsibilities: [
      "Designed and trained ML models for prediction tasks",
      "Built data preprocessing and feature engineering pipelines",
      "Implemented computer vision solutions for image processing",
      "Created model evaluation and logging systems",
    ],
    tools: [
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "TensorFlow Basics",
    ],
    icon: "🤖",
  },
  {
    id: "career-3",
    role: "Full-Stack Developer",
    company: "Side Projects & Portfolio",
    duration: "2024 – Present",
    responsibilities: [
      "Built interactive portfolio as a Web-OS using React + TypeScript",
      "Developed real-time chat system with WebSocket support",
      "Created multiple browser-based games with AI opponents",
      "Implemented security analysis toolkit",
    ],
    tools: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Zustand",
      "WebSocket",
    ],
    icon: "💻",
  },
];

export const EXPERIENCE_DATA: ExperiencePoint[] = [
  { year: 2019, python: 10, ml: 0, web: 5, security: 0 },
  { year: 2020, python: 25, ml: 5, web: 15, security: 5 },
  { year: 2021, python: 45, ml: 15, web: 30, security: 10 },
  { year: 2022, python: 60, ml: 30, web: 40, security: 20 },
  { year: 2023, python: 75, ml: 50, web: 55, security: 35 },
  { year: 2024, python: 85, ml: 65, web: 70, security: 50 },
  { year: 2025, python: 90, ml: 75, web: 80, security: 60 },
];

export const SKILLS: SkillCategory[] = [
  {
    category: "Programming",
    icon: "⌨️",
    skills: [
      { name: "Python", icon: "🐍", level: 90, years: 5 },
      { name: "TypeScript", icon: "📘", level: 70, years: 2 },
      { name: "JavaScript", icon: "🟨", level: 75, years: 3 },
      { name: "C / C++", icon: "⚙️", level: 50, years: 3 },
    ],
  },
  {
    category: "AI / Machine Learning",
    icon: "🧠",
    skills: [
      { name: "OCR & Document Processing", icon: "📄", level: 80, years: 2 },
      { name: "Computer Vision", icon: "👁️", level: 65, years: 2 },
      { name: "NLP Basics", icon: "💬", level: 55, years: 1 },
      { name: "Data Processing", icon: "📊", level: 85, years: 3 },
    ],
  },
  {
    category: "Web Development",
    icon: "🌐",
    skills: [
      { name: "React", icon: "⚛️", level: 75, years: 2 },
      { name: "Django", icon: "🎸", level: 80, years: 3 },
      { name: "REST APIs", icon: "🔌", level: 80, years: 3 },
      { name: "HTML / CSS", icon: "🎨", level: 85, years: 4 },
    ],
  },
  {
    category: "Security",
    icon: "🔐",
    skills: [
      { name: "Hashing & Encryption", icon: "🔑", level: 60, years: 2 },
      { name: "Log Analysis", icon: "📋", level: 55, years: 1 },
      { name: "URL / Phishing Detection", icon: "🌐", level: 65, years: 1 },
      { name: "Auth Fundamentals", icon: "🛡️", level: 60, years: 2 },
    ],
  },
];

export const TECH_STACK: TechStackAxis[] = [
  { label: "Backend", value: 85 },
  { label: "Frontend", value: 75 },
  { label: "AI / ML", value: 70 },
  { label: "Data", value: 80 },
  { label: "Security", value: 55 },
  { label: "Automation", value: 85 },
];

export const PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Invoice OCR System",
    description:
      "Extracts structured data from scanned invoices using OCR and post-processing pipelines.",
    tech: ["Python", "OpenCV", "EasyOCR", "Pandas"],
    problem:
      "Manual data entry from hundreds of invoices was slow and error-prone.",
    learned:
      "Advanced image preprocessing, text extraction accuracy improvement, and data cleaning techniques.",
    icon: "📄",
  },
  {
    id: "proj-2",
    name: "Web-OS Portfolio",
    description:
      "A fully interactive operating-system-style portfolio built with React, featuring windows, a taskbar, and multiple applications.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Zustand", "Vite"],
    problem:
      "Traditional portfolios feel static — this creates an immersive, memorable experience.",
    learned:
      "Complex state management, window manager architecture, and advanced CSS layout techniques.",
    icon: "🖥️",
  },
  {
    id: "proj-3",
    name: "Security Analysis Toolkit",
    description:
      "Browser-based security toolkit for password analysis, URL scanning, hash generation, and log analysis.",
    tech: ["TypeScript", "React", "Web Crypto API"],
    problem:
      "Quick security checks required multiple external tools — this consolidates them.",
    learned:
      "Cryptographic hashing, URL pattern analysis, and security log parsing.",
    icon: "🔐",
  },
  {
    id: "proj-4",
    name: "AI Prediction System",
    description:
      "ML-based prediction interface for classification and regression tasks with real-time feedback.",
    tech: ["Python", "Scikit-learn", "React", "REST API"],
    problem: "Making ML predictions accessible to non-technical users.",
    learned:
      "Model deployment, feature engineering, and building intuitive ML interfaces.",
    icon: "🤖",
  },
  {
    id: "proj-5",
    name: "Data Processing Pipeline",
    description:
      "Automated pipeline for cleaning, transforming, and analyzing large datasets.",
    tech: ["Python", "Pandas", "NumPy", "Matplotlib"],
    problem: "Repetitive data cleaning tasks consumed hours of manual effort.",
    learned:
      "Efficient data transformation patterns and pipeline architecture.",
    icon: "📊",
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    icon: "⚙️",
    title: "Built OCR Extraction Pipeline",
    description:
      "End-to-end OCR system processing hundreds of documents automatically.",
  },
  {
    id: "ach-2",
    icon: "📊",
    title: "Automated Data Processing",
    description:
      "Created automated data cleaning tools reducing manual effort by 80%.",
  },
  {
    id: "ach-3",
    icon: "🔐",
    title: "Security Detection Tools",
    description: "Implemented URL scanning and log analysis security toolkit.",
  },
  {
    id: "ach-4",
    icon: "🖥️",
    title: "Interactive OS Portfolio",
    description:
      "Built a complete operating-system-style portfolio from scratch.",
  },
  {
    id: "ach-5",
    icon: "🎮",
    title: "AI Game Opponents",
    description: "Implemented minimax AI for TicTacToe with difficulty levels.",
  },
  {
    id: "ach-6",
    icon: "🚀",
    title: "Full-Stack Development",
    description:
      "Delivered multiple projects spanning frontend, backend, and ML.",
  },
];

export const LEARNING_ROADMAP: LearningItem[] = [
  {
    id: "learn-1",
    topic: "Advanced Machine Learning",
    status: "In Progress",
    progress: 45,
    icon: "🧠",
  },
  {
    id: "learn-2",
    topic: "System Design",
    status: "Researching",
    progress: 25,
    icon: "🏗️",
  },
  {
    id: "learn-3",
    topic: "Cyber Security",
    status: "Practicing",
    progress: 40,
    icon: "🔐",
  },
  {
    id: "learn-4",
    topic: "Deep Learning & Neural Nets",
    status: "In Progress",
    progress: 30,
    icon: "🔬",
  },
  {
    id: "learn-5",
    topic: "Cloud & DevOps",
    status: "Researching",
    progress: 15,
    icon: "☁️",
  },
];

/* ═══════════════════════════════════════════════════
   Sidebar Navigation Tabs
   ═══════════════════════════════════════════════════ */

export type TabId =
  | "overview"
  | "education"
  | "career"
  | "experience"
  | "skills"
  | "techstack"
  | "projects"
  | "achievements"
  | "learning"
  | "resume";

export interface SidebarTab {
  id: TabId;
  label: string;
  icon: string;
}

export const SIDEBAR_TABS: SidebarTab[] = [
  { id: "overview", label: "Overview", icon: "🏠" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "career", label: "Career Timeline", icon: "📈" },
  { id: "experience", label: "Experience Graph", icon: "📊" },
  { id: "skills", label: "Skills", icon: "🧠" },
  { id: "techstack", label: "Tech Stack", icon: "⚙️" },
  { id: "projects", label: "Projects", icon: "📂" },
  { id: "achievements", label: "Achievements", icon: "🏆" },
  { id: "learning", label: "Learning Now", icon: "🚀" },
  { id: "resume", label: "Resume", icon: "📄" },
];
