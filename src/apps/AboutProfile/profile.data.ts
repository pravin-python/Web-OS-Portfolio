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
    "Freelance Full-Stack Developer",
    "Python & Java Developer",
    "AI Agent & Automation Expert",
    "Web Scraping Specialist",
  ],
  tagline:
    "Building intelligent systems, AI agents, and automation workflows for clients worldwide.",
  photoUrl: import.meta.env.BASE_URL + "image/profile.jpg",
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
      "Java",
      "Python",
      "Networking",
      "Operating Systems",
      "Web Technologies",
      "C / C++ Programming",
    ],
    icon: import.meta.env.BASE_URL + "image/Gujarat-university.png",
  },
  {
    id: "edu-2",
    institute: "Indus University",
    degree: "Master of Computer Applications (MCA)",
    years: "2022 – 2024",
    subjects: [
      "Advanced Java",
      "Advanced Python",
      "Data Base Management System",
      "Data Mining",
      "Data Science",
      "Data Warehousing",
      "Advanced Algorithms",
      "Advanced Computer Vision",
      "Advanced NLP",
      "IoT",
      "Data Processing Pipelines",
    ],
    icon: import.meta.env.BASE_URL + "image/indus.jpg",
  },
  {
    id: "edu-3",
    institute: "Online / Self-Study",
    degree: "Machine Learning & AI Specialization",
    years: "2022 – Present",
    subjects: [
      "Supervised Learning",
      "Computer Vision",
      "NLP Fundamentals",
      "Deep Learning Basics",
      "Agentic AI",
      "LLMs",
      "LangChain",
      "OpenAI",
      "Zapier",
      "Web scraping",
    ],
    icon: import.meta.env.BASE_URL + "svg/others/ai-self-study.svg",
  },
];

export const CAREER_TIMELINE: CareerEntry[] = [
  {
    id: "career-1",
    role: "Python Developer",
    company: "Dolphin Web Solution - India",
    duration: "August 2024 – Present",
    responsibilities: [
      "Designed scalable backend services using Python, Django, FastAPI",
      "Built automated invoice processing systems using OCR & AI models (Processed 100K+ docs/month)",
      "Developed web scraping solutions using Selenium, BeautifulSoup & Crawlee",
      "Integrated AWS S3 buckets for secure file storage",
      "Implemented real-time socket connectivity and multi-database connections",
      "Built automated invoice processing systems using OCR & AI models (Processed 100K+ docs/month)",
      "Developed web scraping solutions using Selenium, BeautifulSoup & Crawlee",
      "Integrated AWS S3 buckets for secure file storage",
      "Implemented real-time socket connectivity and multi-database connections",
    ],
    tools: [
      "Python",
      "Django",
      "FastAPI",
      "OCR",
      "Docker",
      "AWS",
      "SQL",
      "NoSQL",
      "LangChain",
      "LLMs",
      "OpenAI",
      "Zapier",
      "Web scraping",
    ],
    icon: import.meta.env.BASE_URL + "image/dolphin-web-solution.png",
  },
];

export const EXPERIENCE_DATA: ExperiencePoint[] = [
  { year: 2019, python: 10, ml: 0, web: 5, security: 0 },
  { year: 2020, python: 25, ml: 5, web: 15, security: 5 },
  { year: 2021, python: 45, ml: 15, web: 30, security: 10 },
  { year: 2022, python: 60, ml: 30, web: 40, security: 20 },
  { year: 2023, python: 75, ml: 50, web: 55, security: 35 },
  { year: 2024, python: 85, ml: 75, web: 70, security: 50 },
  { year: 2025, python: 90, ml: 89, web: 80, security: 60 },
];

export const SKILLS: SkillCategory[] = [
  {
    category: "Programming",
    icon: import.meta.env.BASE_URL + "svg/text editors/vscode.svg",
    skills: [
      {
        name: "Python",
        icon: import.meta.env.BASE_URL + "svg/social icons/python.svg",
        level: 90,
        years: 5,
      },
      {
        name: "Java",
        icon: import.meta.env.BASE_URL + "svg/language/java.svg",
        level: 70,
        years: 3,
      },
      {
        name: "TypeScript",
        icon: import.meta.env.BASE_URL + "svg/language/typescript.svg",
        level: 70,
        years: 2,
      },
      {
        name: "JavaScript",
        icon: import.meta.env.BASE_URL + "svg/social icons/javascript.svg",
        level: 75,
        years: 3,
      },
      {
        name: "C / C++",
        icon: import.meta.env.BASE_URL + "svg/language/c++.svg",
        level: 50,
        years: 3,
      },
    ],
  },
  {
    category: "AI / Machine Learning",
    icon: import.meta.env.BASE_URL + "svg/others/cat-aiml.svg",
    skills: [
      {
        name: "OCR & Document Processing",
        icon: import.meta.env.BASE_URL + "svg/others/skill-ocr.svg",
        level: 80,
        years: 2,
      },
      {
        name: "Computer Vision",
        icon: import.meta.env.BASE_URL + "svg/others/skill-cv.svg",
        level: 65,
        years: 2,
      },
      {
        name: "NLP Basics",
        icon: import.meta.env.BASE_URL + "svg/others/skill-nlp.svg",
        level: 55,
        years: 1,
      },
      {
        name: "Data Processing",
        icon: import.meta.env.BASE_URL + "svg/others/skill-data.svg",
        level: 85,
        years: 3,
      },
    ],
  },
  {
    category: "Web Development",
    icon: import.meta.env.BASE_URL + "svg/social icons/chrome.svg",
    skills: [
      {
        name: "React",
        icon: import.meta.env.BASE_URL + "svg/frameworks/react.svg",
        level: 75,
        years: 2,
      },
      {
        name: "Django",
        icon: import.meta.env.BASE_URL + "svg/frameworks/django.svg",
        level: 80,
        years: 3,
      },
      {
        name: "REST APIs",
        icon: import.meta.env.BASE_URL + "svg/others/html.svg",
        level: 80,
        years: 3,
      },
      {
        name: "HTML / CSS",
        icon: import.meta.env.BASE_URL + "svg/others/css.svg",
        level: 85,
        years: 4,
      },
    ],
  },
  {
    category: "Security",
    icon: import.meta.env.BASE_URL + "svg/social icons/debian.svg",
    skills: [
      {
        name: "Hashing & Encryption",
        icon: import.meta.env.BASE_URL + "svg/text editors/sublime.svg",
        level: 60,
        years: 2,
      },
      {
        name: "Log Analysis",
        icon: import.meta.env.BASE_URL + "svg/social icons/ubuntu.svg",
        level: 55,
        years: 1,
      },
      {
        name: "URL / Phishing Detection",
        icon: import.meta.env.BASE_URL + "svg/social icons/linux.svg",
        level: 65,
        years: 1,
      },
      {
        name: "Auth Fundamentals",
        icon: import.meta.env.BASE_URL + "svg/social icons/github.svg",
        level: 60,
        years: 2,
      },
    ],
  },
  {
    category: "LLMs & Agentic AI",
    icon: import.meta.env.BASE_URL + "svg/others/cat-llm.svg",
    skills: [
      {
        name: "Agentic AI & LangChain",
        icon: import.meta.env.BASE_URL + "svg/others/skill-langchain.svg",
        level: 85,
        years: 2,
      },
      {
        name: "Local LLaMA Deployment",
        icon: import.meta.env.BASE_URL + "svg/others/skill-llama.svg",
        level: 80,
        years: 1,
      },
      {
        name: "OpenRouter API",
        icon: import.meta.env.BASE_URL + "svg/others/skill-openrouter.svg",
        level: 80,
        years: 1,
      },
    ],
  },
  {
    category: "Computer Vision",
    icon: import.meta.env.BASE_URL + "svg/others/cat-cv.svg",
    skills: [
      {
        name: "YOLO & DeepSORT",
        icon: import.meta.env.BASE_URL + "svg/others/skill-yolo.svg",
        level: 85,
        years: 2,
      },
      {
        name: "U-Net",
        icon: import.meta.env.BASE_URL + "svg/others/skill-unet.svg",
        level: 75,
        years: 1,
      },
      {
        name: "MediaPipe",
        icon: import.meta.env.BASE_URL + "svg/others/skill-mediapipe.svg",
        level: 80,
        years: 2,
      },
    ],
  },
  {
    category: "Cloud & DevOps",
    icon: import.meta.env.BASE_URL + "svg/others/cat-cloud-devops.svg",
    skills: [
      {
        name: "AWS (EC2, S3, IAM)",
        icon: import.meta.env.BASE_URL + "svg/cloud/amazon.svg",
        level: 80,
        years: 3,
      },
      {
        name: "Google Cloud",
        icon: import.meta.env.BASE_URL + "svg/cloud/gcloud.svg",
        level: 85,
        years: 2,
      },
      {
        name: "GitLab",
        icon: import.meta.env.BASE_URL + "svg/cloud/gitlab.svg",
        level: 80,
        years: 2,
      },
      {
        name: "Docker & Kubernetes",
        icon: import.meta.env.BASE_URL + "svg/social icons/docker.svg",
        level: 75,
        years: 2,
      },
      {
        name: "Celery & RabbitMQ",
        icon: import.meta.env.BASE_URL + "svg/social icons/linux.svg",
        level: 75,
        years: 2,
      },
    ],
  },
  {
    category: "Databases",
    icon: import.meta.env.BASE_URL + "svg/databases/mysql.svg",
    skills: [
      {
        name: "MySQL",
        icon: import.meta.env.BASE_URL + "svg/databases/mysql.svg",
        level: 85,
        years: 4,
      },
      {
        name: "PostgreSQL",
        icon: import.meta.env.BASE_URL + "svg/databases/postgresql.svg",
        level: 80,
        years: 3,
      },
      {
        name: "MongoDB",
        icon: import.meta.env.BASE_URL + "svg/databases/mongodb.svg",
        level: 75,
        years: 2,
      },
      {
        name: "Redis",
        icon: import.meta.env.BASE_URL + "svg/databases/redis.svg",
        level: 70,
        years: 2,
      },
      {
        name: "Oracle",
        icon: import.meta.env.BASE_URL + "svg/databases/oracle.svg",
        level: 60,
        years: 1,
      },
      {
        name: "Cassandra",
        icon: import.meta.env.BASE_URL + "svg/databases/cassandra.svg",
        level: 55,
        years: 1,
      },
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
    icon: import.meta.env.BASE_URL + "svg/others/proj-invoice.svg",
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
    icon: import.meta.env.BASE_URL + "svg/frameworks/react.svg",
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
    icon: import.meta.env.BASE_URL + "svg/social icons/linux.svg",
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
    icon: import.meta.env.BASE_URL + "svg/others/proj-ai-predict.svg",
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
    icon: import.meta.env.BASE_URL + "svg/others/proj-data-pipe.svg",
  },
  {
    id: "proj-6",
    name: "Bhagavad Gita Psychological Chatbot",
    description:
      "LLM-based chatbot offering emotional support using Gita concepts via local LLaMA3.",
    tech: ["LLM", "Python", "NLP", "Local LLaMA3"],
    problem:
      "Providing privacy-first emotional support grounded in psychological and philosophical concepts.",
    learned:
      "Fine-tuning local LLMs, prompt engineering, and context-aware NLP interactions.",
    icon: import.meta.env.BASE_URL + "svg/social icons/python.svg",
  },
  {
    id: "proj-7",
    name: "Digital Marketing Multi-Agent Dashboard",
    description:
      "Built 25+ automation agents for posts, analytics, and scheduling in a modern dashboard.",
    tech: ["LLM", "Python", "Django", "Agentic AI", "FastAPI"],
    problem:
      "Managing diverse digital marketing operations required heavy manual intervention.",
    learned:
      "Orchestrating multi-agent workflows, API integrations, and scalable dashboard design.",
    icon:
      import.meta.env.BASE_URL +
      "svg/social icons/google_collaborative_content_tools.svg",
  },
  {
    id: "proj-8",
    name: "Chatbot using Flask and OpenRouter LLM",
    description:
      "Real-time interactive chatbot with personality settings and JWT security.",
    tech: ["Python", "Flask", "LLM", "OpenRouter API", "JWT"],
    problem:
      "Needed a secure conversational architecture managing multiple LLM models dynamically.",
    learned:
      "JWT-based authentication, routing API requests, and managing stateless sessions securely.",
    icon: import.meta.env.BASE_URL + "svg/frameworks/flask.svg",
  },
  {
    id: "proj-9",
    name: "Flask Resume Parser & ATS Scorer",
    description:
      "Built a resume parser using NLTK & pdfplumber with ATS scoring and modern UI.",
    tech: ["Python", "NLTK", "Flask", "Machine Learning"],
    problem:
      "Extracting and structuring data from diverse unstructured resume formats.",
    learned:
      "Advanced NLP entity recognition, algorithmic scoring systems, and text preprocessing.",
    icon: import.meta.env.BASE_URL + "svg/others/proj-resume-parser.svg",
  },
  {
    id: "proj-10",
    name: "Road Safety & Vehicle Monitoring System",
    description:
      "Real-time detection of potholes, helmets, violations, and number plates with analytics dashboard.",
    tech: ["IoT", "YOLO", "DeepSORT", "Django", "Computer Vision"],
    problem:
      "Monitoring high-speed traffic for safety violations under varying environmental conditions.",
    learned:
      "High-speed object detection, multi-object tracking, and complex CV pipeline optimization.",
    icon: import.meta.env.BASE_URL + "svg/others/proj-road-safety.svg",
  },
  {
    id: "proj-11",
    name: "Satellite Image Cloud & Shadow Segmentation",
    description:
      "Performed segmentation on satellite TIF RGB images using U-Net with IoU/Dice metrics.",
    tech: ["U-Net", "QGIS", "Python", "OpenCV", "TensorFlow"],
    problem:
      "Automating the removal of atmospheric obstructions in high-resolution earth observation data.",
    learned:
      "Pixel-level image segmentation, spatial architectures, and deep learning inference.",
    icon: import.meta.env.BASE_URL + "svg/others/proj-satellite.svg",
  },
  {
    id: "proj-12",
    name: "Virtual Makeup & Fashion Recommendation",
    description:
      "Applied virtual makeup and recommended outfits based on facial features.",
    tech: ["MediaPipe FaceMesh", "Deep Learning", "Computer Vision"],
    problem:
      "Delivering an interactive augmented reality try-on experience securely and rapidly.",
    learned:
      "Precise facial landmark detection, human body pose estimation, and real-time rendering.",
    icon: import.meta.env.BASE_URL + "svg/others/proj-virtual-makeup.svg",
  },
  {
    id: "proj-13",
    name: "HiveBrain — Operational Intelligence SaaS",
    description:
      "Designed a secure multi-tenant SaaS platform with project-based isolation and AI-powered work detection.",
    tech: ["Python", "FastAPI", "PostgreSQL", "Next.js", "TypeScript"],
    problem:
      "Enterprises lacked a consolidated intelligence platform with fine-grained RBAC.",
    learned:
      "Database-driven RBAC, audit logging, multi-tenant architecture, and full-stack integration.",
    icon: import.meta.env.BASE_URL + "svg/frameworks/react.svg",
  },
  {
    id: "proj-14",
    name: "Admission Management System",
    description:
      "Automated student application and enrollment workflow with secure data handling.",
    tech: ["Python", "Django"],
    problem: "Manual enrollment processes were inefficient and error-prone.",
    learned:
      "Django ORM, building web forms, and handling secure transactions.",
    icon: import.meta.env.BASE_URL + "svg/frameworks/django.svg",
  },
  {
    id: "proj-15",
    name: "Stock-Market-Analysis",
    description:
      "Analyzed historical stock trends and built predictive models.",
    tech: ["Python", "Time Series", "Machine Learning"],
    problem:
      "Identifying patterns in immense volumes of historical financial data.",
    learned:
      "Time series forecasting, data visualization, and predictive modeling.",
    icon: import.meta.env.BASE_URL + "svg/others/proj-stock-market.svg",
  },
  {
    id: "proj-16",
    name: "Breast Cancer Prediction",
    description: "Deep learning model for classifying breast cancer images.",
    tech: ["Python", "CNN", "OpenCV"],
    problem:
      "Assisting medical professionals by automatically identifying cancerous patterns in images.",
    learned:
      "Building and training CNN architectures from scratch for medical imaging.",
    icon: import.meta.env.BASE_URL + "svg/others/proj-cancer-pred.svg",
  },
  {
    id: "proj-17",
    name: "Checker Game",
    description:
      "Implemented AI gameplay using minimax + alpha-beta pruning for efficient move selection.",
    tech: ["Python", "AI Algorithm"],
    problem:
      "Designing an intelligent opponent requiring deep search trees without slowing down gameplay.",
    learned:
      "Minimax algorithm optimization, game state trees, and alpha-beta pruning heuristics.",
    icon: import.meta.env.BASE_URL + "svg/social icons/python.svg",
  },
  {
    id: "proj-18",
    name: "Hand Written Mathematical Expression Evolution",
    description:
      "Trained a CNN model to recognize handwritten digits for mathematical expression understanding.",
    tech: ["Python", "Deep Learning", "Computer Vision"],
    problem:
      "Accurately parsing equations written naturally by humans into machine-readable formats.",
    learned:
      "Digit recognition, mapping symbols, and interpreting complex mathematical groupings.",
    icon: import.meta.env.BASE_URL + "svg/others/proj-math-expr.svg",
  },
  {
    id: "proj-19",
    name: "Ecommerce Web Platform",
    description:
      "Created a full Django-based online store with authentication, cart, and payment modules.",
    tech: ["Django", "Python", "E-commerce"],
    problem: "Creating a holistic shopping experience securely from scratch.",
    learned:
      "Payment gateway integration, session management for shopping carts, and Django templating.",
    icon: import.meta.env.BASE_URL + "svg/frameworks/django.svg",
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    icon: import.meta.env.BASE_URL + "svg/social icons/linux.svg",
    title: "Security Detection Tools",
    description: "Implemented URL scanning and log analysis security toolkit.",
  },
  {
    id: "ach-2",
    icon: import.meta.env.BASE_URL + "svg/frameworks/react.svg",
    title: "Interactive OS Portfolio",
    description:
      "Built a complete operating-system-style portfolio from scratch.",
  },
  {
    id: "ach-3",
    icon: import.meta.env.BASE_URL + "svg/social icons/python.svg",
    title: "AI Game Opponents",
    description: "Implemented minimax AI for TicTacToe with difficulty levels.",
  },
  {
    id: "ach-4",
    icon: import.meta.env.BASE_URL + "svg/social icons/github.svg",
    title: "Full-Stack Development",
    description:
      "Delivered multiple projects spanning frontend, backend, and ML.",
  },
  {
    id: "ach-5",
    icon: import.meta.env.BASE_URL + "svg/social icons/google_scholar.svg",
    title: "Machine Learning Certified - Stanford",
    description:
      "Completed comprehensive Machine Learning specialization by Stanford University.",
  },
  {
    id: "ach-6",
    icon: import.meta.env.BASE_URL + "svg/social icons/linux.svg",
    title: "Information Security and Ethical Hacker",
    description:
      "Certified in critical cybersecurity concepts and ethical hacking.",
  },
  {
    id: "ach-7",
    icon: import.meta.env.BASE_URL + "svg/system/file.svg",
    title: "Research: Perils of Medical AI",
    description:
      "Published research 'The Perils of Medical Artificial Intelligence: A Critical Analysis'.",
  },
  {
    id: "ach-res-2",
    icon: import.meta.env.BASE_URL + "svg/system/file.svg",
    title: "Research: AI in Space Traffic",
    description:
      "Published 'Artificial Intelligence in Space Traffic Management: Challenges, Applications, and Future Prospects'.",
  },
];

export const LEARNING_ROADMAP: LearningItem[] = [
  {
    id: "learn-1",
    topic: "Advanced Machine Learning",
    status: "In Progress",
    progress: 45,
    icon: import.meta.env.BASE_URL + "svg/others/learn-aml.svg",
  },
  {
    id: "learn-2",
    topic: "System Design",
    status: "Researching",
    progress: 25,
    icon: import.meta.env.BASE_URL + "svg/social icons/docker.svg",
  },
  {
    id: "learn-3",
    topic: "Cyber Security",
    status: "Practicing",
    progress: 40,
    icon: import.meta.env.BASE_URL + "svg/social icons/linux.svg",
  },
  {
    id: "learn-4",
    topic: "Deep Learning & Neural Nets",
    status: "In Progress",
    progress: 30,
    icon: import.meta.env.BASE_URL + "svg/others/learn-dl.svg",
  },
  {
    id: "learn-5",
    topic: "Cloud & DevOps",
    status: "Researching",
    progress: 15,
    icon: import.meta.env.BASE_URL + "svg/others/learn-cloud.svg",
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
  {
    id: "overview",
    label: "Overview",
    icon: import.meta.env.BASE_URL + "svg/system/about.svg",
  },
  {
    id: "education",
    label: "Education",
    icon: import.meta.env.BASE_URL + "svg/social icons/google_scholar.svg",
  },
  {
    id: "career",
    label: "Career Timeline",
    icon: import.meta.env.BASE_URL + "svg/social icons/linkedin.svg",
  },
  {
    id: "experience",
    label: "Experience Graph",
    icon: import.meta.env.BASE_URL + "svg/system/dataset.svg",
  },
  {
    id: "skills",
    label: "Skills",
    icon: import.meta.env.BASE_URL + "svg/apps/ai-lab.svg",
  },
  {
    id: "techstack",
    label: "Tech Stack",
    icon: import.meta.env.BASE_URL + "svg/system/settings.svg",
  },
  {
    id: "projects",
    label: "Projects",
    icon: import.meta.env.BASE_URL + "svg/system/folder.svg",
  },
  {
    id: "achievements",
    label: "Achievements",
    icon: import.meta.env.BASE_URL + "svg/social icons/freecodecamp.svg",
  },
  {
    id: "learning",
    label: "Learning Now",
    icon: import.meta.env.BASE_URL + "svg/apps/experiments.svg",
  },
  {
    id: "resume",
    label: "Resume",
    icon: import.meta.env.BASE_URL + "svg/system/file.svg",
  },
];
