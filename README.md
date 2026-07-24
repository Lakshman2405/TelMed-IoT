# 🏥 TeleMed-IoT: Enterprise Remote Health & IoT Telemedicine Platform

> **AI Agent & Developer Master Documentation**  
> *This document serves as the canonical, end-to-end specification for human developers and Autonomous AI Agents. It defines the system architecture, component contracts, security paradigms, data models, API endpoints, and execution blueprints required to operate, extend, or refactor the TeleMed-IoT codebase.*

---

## 📋 Table of Contents
1. [Executive Summary & Purpose](#-executive-summary--purpose)
2. [Tech Stack & Dependency Matrix](#-tech-stack--dependency-matrix)
3. [Project Directory & File Map](#-project-directory--file-map)
4. [System Architecture & Data Flow](#-system-architecture--data-flow)
5. [Database Models & Schemas](#-database-models--schemas)
6. [API Specification & Endpoints](#-api-specification--endpoints)
7. [Frontend Architecture & Routing](#-frontend-architecture--routing)
8. [Security & Authentication Architecture](#-security--authentication-architecture)
9. [Setup & Installation Guide](#-setup--installation-guide)
10. [AI Agent Execution & Refactoring Protocols](#-ai-agent-execution--refactoring-protocols)

---

## 🎯 Executive Summary & Purpose

**TeleMed-IoT** is a full-stack, decoupled Web and IoT Telemedicine application designed for real-time remote patient monitoring, consultation scheduling, and health data tracking.

### Core System Objectives
* **Remote Vitals & Health Tracking**: Interface for continuous telemetry and monitoring solutions (ECG, Continuous Glucose Monitoring, Respiratory Spirometry, Sleep Diagnostics).
* **Role-Based Access Control (RBAC)**: Strict segregation of privileges across `patient`, `doctor`, and `admin` actors.
* **Stateless JWT Security**: Token-based authentication using HTTP Bearer headers, protected routes, and bcrypt password hashing.
* **Consultation Brokerage**: Patient-to-Doctor consultation submission pipeline supporting third-party submissions (e.g., family members submitting requests for dependents).

---

## 🛠️ Tech Stack & Dependency Matrix

### 🟢 Backend Subsystem (`/backend`)
| Technology | Version / Range | Role / Description |
| :--- | :--- | :--- |
| **Node.js** | `>=18.x` | JavaScript Runtime Engine |
| **Express** | `^5.2.1` | HTTP Web Application Server Framework |
| **Mongoose** | `^9.5.0` | Object Data Modeling (ODM) for MongoDB |
| **jsonwebtoken** | `^9.0.3` | JWT Signing & Verification for stateless auth |
| **bcryptjs** | `^3.0.3` | Password Hashing & Salt generation |
| **express-validator**| `^7.3.2` | Input sanitization, validation rules & middleware |
| **cors** | `^2.8.6` | Cross-Origin Resource Sharing middleware |
| **cookie-parser** | `^1.4.7` | HTTP Cookie parsing utility |
| **dotenv** | `^17.4.2` | Environment Variable loading from `.env` |
| **nodemon** | `^3.1.14` | Dev-mode auto-restarting process monitor |

### 🔵 Frontend Subsystem (`/frontend`)
| Technology | Version / Range | Role / Description |
| :--- | :--- | :--- |
| **React** | `^19.2.5` | UI Library & Declarative Component Tree |
| **React Router DOM**| `^7.14.2` | Client-Side Routing & Navigation Guards |
| **Bootstrap / React-Bootstrap** | `^5.3.8 / ^2.10.10` | Responsive UI Grid & Component Styling |
| **Axios** | `^1.15.2` | Promise-based HTTP Client for API Requests |
| **React Icons** | `^5.6.0` | SVG Icon Library (`FaHeartbeat`, `FaShieldAlt`, etc.) |
| **React Scripts** | `5.0.1` | Build tooling and Create React App CLI |

---

## 📁 Project Directory & File Map

```text
TelMed-IoT/
├── .gitignore                    # Root git exclusion file (node_modules, .env, build output)
├── README.md                     # Canonical AI & Human Documentation (This file)
├── backend/                      # Express.js REST API Backend
│   ├── config/
│   │   └── db.js                 # Mongoose database connection setup & error handling
│   ├── controllers/
│   │   └── authController.js    # Business logic for register, login, getMe, updatePassword, logout
│   ├── middleware/
│   │   ├── auth.js               # JWT verification (`protect`) & Role authorization (`authorize`)
│   │   └── validation.js         # Input validation schemas and error handler middleware
│   ├── models/
│   │   ├── Patient.js            # MongoDB Mongoose schema & methods for Patient users
│   │   └── Consultation.js       # MongoDB Mongoose schema for patient consultation requests
│   ├── routes/
│   │   ├── api.js                # Protected patient CRUD & consultation endpoints
│   │   └── authRoutes.js         # Public/Private authentication endpoints
│   ├── package.json              # Backend dependencies and scripts (`npm run dev`)
│   └── server.js                 # Main server initialization entry point
└── frontend/                     # React 19 Single Page Application
    ├── package.json              # Frontend dependencies and scripts (`npm start`)
    ├── public/                   # Static public assets & HTML entry template
    └── src/
        ├── App.js                # Master route definition & global token state manager
        ├── index.js              # React DOM mounting entry file
        ├── index.css             # Global CSS styling
        ├── components/
        │   ├── Contact.js        # Consultation desk request form component
        │   ├── Home.js           # Platform landing dashboard & metrics display
        │   ├── Login.js          # Authentication login card component
        │   ├── NavBar.js         # Navigation header bar with auth controls
        │   ├── Register.js       # User account creation component
        │   ├── Settings.js       # Tabbed profile view/edit/deactivate component
        │   └── Solutions.js      # IoT Health Monitoring solution packages grid
        └── styles/
            └── App.css           # Additional custom application styles
```

---

## 🏗️ System Architecture & Data Flow

### Architectural Overview Diagram
```
                     +---------------------------------------+
                     |            Client Layer               |
                     |  React 19 SPA (Port 3000)             |
                     +-------------------+-------------------+
                                         |
                                         | HTTP Requests (Bearer Token)
                                         v
                     +-------------------+-------------------+
                     |            Server Layer               |
                     |  Express 5 REST API Server (Port 5000) |
                     +---------+-------------------+---------+
                               |                   |
            +------------------+                   +------------------+
            | Middleware Layer                     | Controller Layer |
            | • auth.js (JWT Check)                | • authController |
            | • validation.js                      | • api handlers   |
            +------------------+                   +------------------+
                               |                   |
                               +---------+---------+
                                         |
                                         | Mongoose ODM (Query / Write)
                                         v
                     +-------------------+-------------------+
                     |           Database Layer              |
                     |     MongoDB database (`telemed-iot`)  |
                     | • Patients Collection                 |
                     | • Consultations Collection            |
                     +---------------------------------------+
```

### Data Flow Execution Lifecycle
1. **User Authentication**:
   * User registers at `/api/auth/register` or logs in at `/api/auth/login`.
   * Server validates credentials using `bcrypt.compare()` against `Patient` schema.
   * Server issues a signed JWT (`JWT_SECRET`) with payload `{ id: patient._id }`.
   * Frontend stores JWT token in `localStorage` under key `'token'`.

2. **Authenticated Request Pipeline**:
   * Frontend attaches `Authorization: Bearer <token>` header to Axios calls.
   * Backend `protect` middleware extracts Bearer token, verifies signature, decodes `id`, and attaches target user document to `req.user` (excluding `password`).
   * Role authorization middleware (`authorize('admin', 'doctor')`) asserts `req.user.role` against required roles.
   * Controller performs operational logic on MongoDB collections (`Patient`, `Consultation`).

---

## 💾 Database Models & Schemas

### 1. Patient Schema (`/backend/models/Patient.js`)
Stores user accounts for patients, doctors, and admins.

```javascript
{
  name: { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  healthConcern: { type: String, required: true, trim: true, minlength: 10 },
  healthSummary: { type: String, default: '', trim: true, maxlength: 500 },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}
```
* **Pre-Save Middleware Hook**: Hashes modified passwords via `bcrypt.genSalt(10)` and updates `updatedAt`.
* **Instance Methods**: `comparePassword(enteredPassword)` returns `Promise<Boolean>`.

### 2. Consultation Schema (`/backend/models/Consultation.js`)
Stores health consultation requests submitted by logged-in users.

```javascript
{
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  healthConcern: { type: String, required: true, trim: true },
  submittedBy: { type: String, required: true }, // Email of logged-in user creating entry
  createdAt: { type: Date, default: Date.now }
}
```

---

## 📡 API Specification & Endpoints

### Base URL: `http://localhost:5000`

#### 🏥 Health Check
* **`GET /health`**
  * **Access**: Public
  * **Response `200 OK`**:
    ```json
    {
      "status": "OK",
      "message": "Server is running",
      "mongodb": "Connected"
    }
    ```

---

#### 🔐 Authentication Endpoints (`/api/auth`)

| Endpoint | Method | Access | Description | Request Body Payload |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register new patient account | `{ "name": "...", "email": "...", "password": "...", "healthConcern": "..." }` |
| `/api/auth/login` | `POST` | Public | Authenticate user & issue JWT | `{ "email": "...", "password": "..." }` |
| `/api/auth/me` | `GET` | Private | Retrieve current user profile | None (`Header: Authorization Bearer`) |
| `/api/auth/updatepassword` | `PUT` | Private | Change account password | `{ "currentPassword": "...", "newPassword": "..." }` |
| `/api/auth/logout` | `POST` | Private | Client-side session termination | None |

##### Example Authentication Success Response (`200 OK` / `201 Created`):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "66a1b2c3d4e5f67890123456",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "patient",
    "healthConcern": "Experiencing mild hypertension"
  }
}
```

---

#### 📋 Patient & Consultation API Endpoints (`/api`)

| Endpoint | Method | Access | Authorization Rules | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/patients` | `GET` | Protected | `admin`, `doctor` | Fetch all active patient documents |
| `/api/patients/:email` | `GET` | Protected | Own Email OR `admin` | Fetch single patient document |
| `/api/consultation` | `POST` | Protected | Any Logged-in User | Submit consultation desk request |
| `/api/patients/:email` | `PUT` | Protected | Own Email Only | Update profile (`email`, `healthSummary`) |
| `/api/patients/:email` | `DELETE` | Protected | Own Email OR `admin` | Soft delete profile (`isActive: false`) |

##### Consultation Creation Payload (`POST /api/consultation`):
```json
{
  "name": "John Doe",
  "email": "john.patient@example.com",
  "healthConcern": "Frequent migraines during low pressure conditions"
}
```

---

## 🎨 Frontend Architecture & Routing

### Route Table (`frontend/src/App.js`)
Client routing is built with React Router v7. Unauthenticated requests are automatically redirected to `/login`.

```text
/login       ---> Login Component (Public)
/register    ---> Register Component (Public)
/            ---> Home Component (Guarded by token)
/solutions   ---> Solutions Component (Guarded by token)
/contact     ---> Contact Component (Guarded by token)
/settings    ---> Settings Component (Guarded by token)
```

### Component Breakdown
1. **`App.js`**: Holds global `token` state synced with `localStorage.getItem('token')`. Handles application-wide logout via `handleLogout()`.
2. **`NavBar.js`**: Top navigation header containing branding, links to all main views, and an explicit Logout action button.
3. **`Home.js`**: Platform overview featuring hero metrics (99.99% uptime, 1M+ active patients), enterprise trust badges, and navigation quick actions.
4. **`Solutions.js`**: Displays a responsive grid of 6 specialized IoT remote health packages:
   * *Cardiac Care Plus* (24/7 ECG & Arrhythmia detection)
   * *Sleep Study Pro* (REM & O2 Saturation tracking)
   * *Diabetes Management* (Continuous Glucose Monitoring & insulin tracking)
   * *Respiratory Wellness* (Spirometry & Air Quality alerts)
   * *Neurological Care* (Seizure detection & Migraine logging)
   * *Maternal Health* (Fetal monitoring & Contraction timing)
5. **`Contact.js`**: Interactive consultation request form. Allows logged-in users to submit consultation tickets for themselves or family members.
6. **`Settings.js`**: Tabbed account management suite:
   * Tab 1: **View Profile** (Fetch and view current health summary by email)
   * Tab 2: **Edit Records** (Update email address or update health summary text)
   * Tab 3: **Deactivate Profile** (Danger Zone — soft deactivates account upon exact name confirmation)

---

## 🔒 Security & Authentication Architecture

1. **Stateless JWT Header Parsing**: Requests to protected routes must include standard HTTP Bearer syntax:
   `Authorization: Bearer <jwt_token_string>`
2. **Password Isolation**: The `password` field in `Patient` schema sets `select: false` by default, ensuring credentials are never exposed in standard query results unless explicitly requested via `.select('+password')`.
3. **Input Sanitization & Normalization**: `express-validator` normalizes emails (`normalizeEmail()`) and trims incoming string inputs to prevent whitespace manipulation and vector injection.
4. **Soft Deactivation System**: Calling `DELETE /api/patients/:email` does not delete the database row; it flags `isActive = false`, preventing logins while preserving historical records for medical audit compliance.

---

## 🚀 Setup & Installation Guide

### Prerequisites
* **Node.js** `>=18.0.0`
* **npm** `>=9.0.0`
* **MongoDB Server** (Local instance running at `mongodb://localhost:27017` or MongoDB Atlas URI)

### Environment Configuration (`/backend/.env`)
Create a `.env` file inside the `/backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/telemed-iot
JWT_SECRET=super_secret_telemed_iot_key_2026
JWT_EXPIRE=7d
```

### Installation Steps

#### 1. Backend Setup & Run
```bash
# Navigate to backend directory
cd backend

# Install Node dependencies
npm install

# Run backend in development mode (with nodemon auto-reload)
npm run dev

# Or run in standard production mode
npm start
```
*Backend server will start on `http://localhost:5000`.*

#### 2. Frontend Setup & Run
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start React development server
npm start
```
*Frontend application will launch at `http://localhost:3000`.*

---

## 🤖 AI Agent Execution & Refactoring Protocols

> **Notice to AI Agents (LLMs / Autonomous Coding Assistants)**  
> When performing edits, feature additions, or bug fixes on this repository, strictly adhere to the following protocols:

1. **Schema & Model Consistency**:
   * When modifying `Patient.js` or `Consultation.js`, update corresponding validation rules in `/backend/middleware/validation.js` and `/backend/routes/authRoutes.js`.
   * Mongoose 7/8/9 `pre('save')` hooks MUST NOT receive or call a `next()` callback parameter when using `async/await` syntax.
2. **Endpoint Defense Rules**:
   * Always wrap protected routes with `protect` middleware from `backend/middleware/auth.js`.
   * Apply role restrictions using `authorize('admin', 'doctor')` for administrative actions.
3. **CORS & Axios Base Alignment**:
   * Backend CORS is configured for `http://localhost:3000` with `credentials: true`.
   * Frontend Axios calls must send `Authorization: Bearer ${token}` header for all endpoints under `/api/patients` and `/api/consultation`.
4. **Error Handling Pattern**:
   * Express error responses MUST strictly maintain the standard JSON response format:
     `res.status(statusCode).json({ success: false, error: "Detailed error message" });`
   * Controller success responses MUST strictly maintain:
     `res.status(statusCode).json({ success: true, message: "...", data: {...} });`

---

*Documentation compiled and verified for TeleMed-IoT Repository.*
