<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,14,26&height=220&section=header&text=TaskFlow%20%7C%20Project%20Management%20System&fontSize=38&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Streamline%20Workflows%20%E2%80%A2%20Supercharge%20Productivity%20%E2%80%A2%20Empower%20Teams&descSize=16&descAlignY=58" width="100%" alt="Header Banner" />

  <p align="center">
    <b>A modern, enterprise-grade, high-performance Project Management System engineered for seamless sprint planning, real-time collaboration, and intelligent task tracking.</b>
  </p>

  <p align="center">
    <a href="#-key-features">Features</a> •
    <a href="#-tech-stack--icon-pack">Tech Stack</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-project-structure">Structure</a> •
    <a href="#-roadmap">Roadmap</a>
  </p>
</p>
  <p align="center">
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge\&logo=node.js\&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.5-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[![Groq AI](https://img.shields.io/badge/Groq_AI-LLaMA--3.3-F34B21?style=for-the-badge\&logo=meta\&logoColor=white)](https://groq.com/)
<img src="https://img.shields.io/badge/status-active-success?style=for-the-badge&logo=statuspage&logoColor=white&color=10B981" alt="Status" />
<img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge&logo=github&logoColor=white&color=06B6D4" alt="PRs Welcome" />
<img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge&logo=open-source-initiative&logoColor=white&color=3B82F6" alt="License" />
<img src="https://img.shields.io/badge/Platform-Mobile%20%7C%20Web%20%7C%20API-orange?style=for-the-badge&logo=flutter&logoColor=white&color=F59E0B" alt="Platforms" />
  </p>

</div>

---

## 🌟 Highlights

- ⚡ **Real-Time Kanban & Sprint Boards:** Drag-and-drop task workflows with live synchronization.
- 🎯 **Milestone & Sprint Management:** Track deliverables, sprint velocities, and critical path items.
- 👥 **Team & Role-Based Access Control (RBAC):** Granular permissions for admins, managers, and contributors.
- 📊 **Productivity & Burn-Down Analytics:** Interactive visual charts detailing progress and velocity.
- 🔔 **Instant Notifications:** Cross-platform alerts for task updates, mentions, and approaching deadlines.
- 🎨 **Adaptive Modern UI:** Sleek glassmorphism-inspired theme with complete Dark & Light mode support.

---

## 🛠 Tech Stack & Icon Pack

### 🎨 Icon Showcase
<div align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=flutter,dart,react,nodejs,express,mongodb,firebase,postgres,tailwind,docker,git,github,figma,postman" alt="Tech Stack Icons" />
  </a>
</div>

<br/>

### 📦 Component Breakdown

| Layer | Technologies & Badges | Purpose |
| :--- | :--- | :--- |
| **Mobile & Frontend** | <img src="https://img.shields.io/badge/Flutter-02569B?style=flat-square&logo=flutter&logoColor=white" /> <img src="https://img.shields.io/badge/Dart-0175C2?style=flat-square&logo=dart&logoColor=white" /> <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" /> <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" /> | Cross-platform client UI, interactive task widgets, animations |
| **Backend & APIs** | <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" /> <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" /> <img src="https://img.shields.io/badge/REST_API-02569B?style=flat-square&logo=fastapi&logoColor=white" /> | Business logic, authentication, RESTful service endpoints |
| **Database & Cache** | <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" /> <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" /> <img src="https://img.shields.io/badge/Firebase_Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black" /> | Data persistence, ACID transactions, offline persistence |
| **DevOps & Tools** | <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" /> <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white" /> <img src="https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white" /> <img src="https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=figma&logoColor=white" /> | Containerization, version control, API testing, UI/UX design |

---

## 🌟 Key Features Overview

### 🎨 Frontend Highlights (React 19 + Vite 8 + Zustand)
- **Dashboard & Project Workspaces**:
  - Interactive grid displaying projects with status pills (`Active`, `Planning`, `Completed`), description summaries, and real-time team member counts.
  - **Create Project Modal**: Modal dialog for creating projects with validation, description fields, status selector pills, and initial team size allocation.
- **Kanban Board & Task Management**:
  - Dynamic multi-column board (`To Do`, `In Progress`, `Done`) with real-time column task counters.
  - **Add Task Modal**: Create tasks pre-selecting column status (`todo`, `in_progress`, `done`).
  - **Interactive Task Card Menu**: Quick-action dropdown (`...`) allowing users to advance tasks between `To Do` ➔ `In Progress` ➔ `Done` or delete tasks.
  - **Visual Strikethrough & Completion**: Completed tasks render with success checkmarks and strikethrough typography.
- **Employee & Team Management**:
  - **Manage Employees Modal**: Positioned directly before the "Add Task" button on the Project Board header.
  - **Add Employees**: Assign team members to projects using Name, Email / Employee ID, and Role (`Member` or `Project Admin`).
  - **Remove Employees**: Remove members with instant member count updates across Dashboard cards and Project Boards.
- **User Profile & WebRTC Camera Capture**:
  - **Persistent User Credentials**: Displays user registered `Full Name`, `Employee ID`, and `Email Address`. Read-only by default to prevent unintended edits, editable via **Edit Profile**.
  - **Profile Image Options**:
    - **From Device**: File upload selector converting images into persistent data URLs.
    - **Take Picture**: Built-in camera capture modal utilizing WebRTC `getUserMedia` live video preview and canvas snapshot capabilities.
  - **Logout Action**: Dedicated **Logout** button below profile disclaimer text and in the top navigation bar.
- **Fixed Sticky Top Navigation**:
  - Pinned `position: sticky; top: 0; z-index: 1000` with an opaque dark frosted background (`rgba(10, 10, 12, 0.96)`) and 16px backdrop blur.
  - Prevents scrolling content from bleeding through or overlapping.
  - Fully responsive across Desktop (> 1024px), Tablet (768px), and Mobile (480px).

### ⚙️ Backend Highlights (Node.js ES Modules + Express 5 + MongoDB)
- **Advanced Authentication & Security**:
  - Dual JWT mechanism (Access & Refresh tokens stored securely in Cookies/Headers).
  - Bcrypt password hashing, email verification tokens, and password reset flows.
- **Multi-Tier Role-Based Access Control (RBAC)**:
  - **Admin**: Full system access, project workspace deletion, and member management.
  - **Project Admin**: Task CRUD, subtask allocation, note creation, and member role assignment.
  - **Member**: Read access, task board interaction, and status updates.
- **Project & Task API Engine**:
  - MongoDB Mongoose 9 ODM with aggregation pipelines for team counts and task metrics.
  - Subtask breakdown management (`/api/v1/tasks/:projectId/t/:taskId/subtasks`).
  - Scoped project notes API (`/api/v1/notes`).
  - File upload engine configured with Multer for task attachments.
- **Transactional HTML Email Service**:
  - Nodemailer & Mailgen engine for sending structured HTML emails for password resets and email verifications.

---

## 🛠️ Technology Stack

### Frontend Architecture
| Tech | Description |
| :--- | :--- |
| **React 19** | Modern UI Library |
| **Vite 8** | Next-Gen Frontend Tooling & HMR |
| **Zustand 5** | Lightweight Global State Management |
| **React Router 7** | Client-Side Routing & Protected Routes |
| **Axios** | HTTP Client with Token Interceptors |
| **Lucide React** | Comprehensive Icon Set |
| **Vanilla CSS3** | Custom Glassmorphic Dark Design System |

### Backend Architecture
| Tech | Description |
| :--- | :--- |
| **Node.js (ES Modules)** | JavaScript Runtime (`"type": "module"`) |
| **Express 5** | Web Framework & Middleware Pipeline |
| **MongoDB & Mongoose 9** | NoSQL Database & Aggregation ODM |
| **JWT (JsonWebToken)** | Secure Stateless Token Auth |
| **Express-Validator** | Request Payload Sanitization & Validation |
| **Multer** | Multipart Form-Data File Upload Engine |
| **Nodemailer & Mailgen** | Transactional HTML Email Engine |

---

## 📁 Repository Directory Structure

```
Project-Management-System/
├── Backend/                 # Express 5 REST API Backend
│   ├── public/              # Static uploads & file attachment storage
│   ├── src/
│   │   ├── db/              # MongoDB connection initializer
│   │   ├── models/          # User, Project, ProjectMember, Task, SubTask, Note schemas
│   │   ├── controllers/     # Auth, Project, Task, Note & HealthCheck handlers
│   │   ├── routes/          # Express route endpoints
│   │   ├── middlewares/     # JWT Auth, Multer upload & Validation middlewares
│   │   ├── validators/      # Express-validator schema rules
│   │   ├── utils/           # ApiError, ApiResponse, AsyncHandler & Mail utilities
│   │   ├── app.js           # Express application setup
│   │   └── index.js         # Backend entry point
│   ├── .env                 # Backend environment variables
│   ├── package.json         # Backend dependencies & scripts
│   └── Readme.MD            # Detailed Backend API Documentation
│
├── Frontend/                # React 19 + Vite 8 Frontend Application
│   ├── public/              # Static public assets
│   ├── src/
│   │   ├── assets/          # Brand logos & graphics
│   │   ├── components/      # CreateProjectModal, CreateTaskModal, ManageEmployeesModal
│   │   ├── pages/           # Dashboard, ProjectDetails, AdminProfile, Login, Register
│   │   ├── store/           # Zustand stores: authStore, projectStore, taskStore
│   │   ├── utils/           # Axios API client setup
│   │   ├── App.jsx          # React Router & ProtectedRoute wrapper
│   │   └── index.css        # Global CSS design system & sticky top nav
│   ├── package.json         # Frontend dependencies & scripts
│   └── README.md            # Detailed Frontend Documentation
│
└── Readme.MD                # Master Project Documentation
```

---

## 📡 REST API Endpoint Overview

All API endpoints are prefixed with `/api/v1/`:

| Module | Base Path | Key Functionality |
| :--- | :--- | :--- |
| **Auth** | `/api/v1/auth` | Login, Register, Logout, Current User, Refresh Token, Password Reset, Email Verification |
| **Projects** | `/api/v1/projects` | Workspace CRUD, Team Member List, Add Member, Update Role, Remove Member |
| **Tasks** | `/api/v1/tasks` | Task CRUD, File Attachment Uploads, Status Updates, Subtask Management |
| **Notes** | `/api/v1/notes` | Project Notes CRUD |
| **Health** | `/api/v1/healthcheck` | Server Operational Status Check |

For complete payload structures and detailed request parameters, see the [Backend Readme.MD](file:///d:/Chai%20and%20Code/Node%20Js%20Project/Project%20Managment%20System/Backend/Readme.MD).

---

## 🚦 Getting Started (Local Setup)

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **MongoDB** Atlas Cluster or local MongoDB server

---

### 2. Backend Setup & Run

1. Open terminal and navigate to `Backend`:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `Backend` directory:
   ```env
   PORT=8000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/projmanage
   CORS_ORIGIN=http://localhost:5173

   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_Expiry=10d

   MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
   MAILTRAP_SMTP_PORT=2525
   MAILTRAP_SMTP_USERNAME=your_username
   MAILTRAP_SMTP_PASSWORD=your_password
   FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/forgot-password
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   The backend API will run on: `http://localhost:8000/`

---

### 3. Frontend Setup & Run

1. Open a new terminal and navigate to `Frontend`:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   The application UI will run on: `http://localhost:5173/`

---

## 🔐 Quick Test Credentials

You can test the application using default credentials or register a new user:

- **Employee ID**: `EMP-001`
- **Password**: `password123`

---

## 📜 License

This project is open-source software licensed under the [ISC License](LICENSE).

<div align="center">

## 👨‍💻 Author

**K Tirumala Achari**  
Full Stack Developer | Aspiring Software Engineer

<a href="mailto:ktirumalachari@gmail.com">
  <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail"/>
</a>
<a href="https://www.linkedin.com/in/k-tirumala-achari-921106307/">
  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
</a>
<a href="https://github.com/ktirumalaachari">
  <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
</a>
<a href="https://www.ktirumalaachari.me">
  <img src="https://img.shields.io/badge/Portfolio-FF6B35?style=for-the-badge&logo=firefox&logoColor=white" alt="Portfolio"/>
</a>
<br/><br/>

> _"Passionate about building impactful, user-centric solutions through technology,_
> _committed to continuous learning and innovation."_

<div align="center">
**⭐ If you found this project helpful or inspiring, please give it a star! ⭐**

<br/>
Made with ❤️ by **K Tirumala Achari**

[![GitHub](https://img.shields.io/badge/GitHub-ktirumalaachari-blue?style=flat&logo=github)](https://github.com/ktirumalaachari)

</div>

