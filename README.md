# 🚀 Team Task Manager

A full-stack web application for managing team projects and tasks efficiently.

---

## 🌐 Live Demo

- 🔗 **Frontend (UI):** https://teamflow-manager.vercel.app
- 🔗 **Backend (API):** https://team-task-manager-proj-2.onrender.com

---

## ⚙️ Features

- 🔐 User authentication & authorization (JWT)
- 📁 Create and manage projects
- 👥 Add/remove project members
- ✅ Create, assign, and track tasks
- 📊 Dashboard with statistics
- 🛡️ Role-based access control (Owner / Member)

---

## 🧰 Technology Stack

### 🖥️ Backend
- ☕ **Java 17**
- 🌱 **Spring Boot 3.2.0**
- 🔐 **Spring Security** (JWT Authentication)
- 🗄️ **Spring Data JPA** (Hibernate)
- 🐘 **PostgreSQL** Database
- 📦 **Maven** Build Tool
- 🚀 **Deployed on Render**

### 🎨 Frontend
- ⚛️ **React 18**
- 🔀 **React Router** (Navigation)
- 📡 **Axios** (HTTP Client)
- 🎨 **Tailwind CSS** (Styling)
- 🌍 **Deployed on Vercel**

---

## 📸 Postman API Testing

Complete API testing documentation with screenshots is available in the **`Postman Api Testing/`** folder.

### 📂 Testing Documentation Structure

```
Postman Api Testing/
├── 01-signup.png          # User registration
├── 02-login.png           # User authentication
├── 03-dashboard.png       # Dashboard statistics
├── 04-create-project.png  # Project creation
├── 05-get-projects.png    # List all projects
├── 06-create-task.png     # Task creation
├── 07-get-tasks.png       # List project tasks
├── 08-update-status.png   # Update task status
└── 09-delete-task.png     # Delete task
```

### 🧪 API Testing Guide

**Base URL:** `https://team-task-manager-proj-2.onrender.com`

#### 1️⃣ **Authentication Endpoints**

| Method | Endpoint | Description | Screenshot |
|--------|----------|-------------|------------|
| POST | `/api/auth/signup` | Register new user | [View](blob/main/Postman%20Api%20Testing/SignUp.png) |
| POST | `/api/auth/login` | Login & get JWT token | [View](Postman%20Api%20Testing/02-login.png) |

#### 2️⃣ **Dashboard Endpoints**

| Method | Endpoint | Auth Required | Screenshot |
|--------|----------|---------------|------------|
| GET | `/api/dashboard` | ✅ Yes | [View](Postman%20Api%20Testing/03-dashboard.png) |

#### 3️⃣ **Project Endpoints**

| Method | Endpoint | Description | Screenshot |
|--------|----------|-------------|------------|
| POST | `/api/projects` | Create new project | [View](Postman%20Api%20Testing/04-create-project.png) |
| GET | `/api/projects` | Get all projects | [View](Postman%20Api%20Testing/05-get-projects.png) |
| GET | `/api/projects/{id}` | Get project details | - |
| DELETE | `/api/projects/{id}` | Delete project | - |

#### 4️⃣ **Task Endpoints**

| Method | Endpoint | Description | Screenshot |
|--------|----------|-------------|------------|
| POST | `/api/projects/{projectId}/tasks` | Create task | [View](Postman%20Api%20Testing/06-create-task.png) |
| GET | `/api/projects/{projectId}/tasks` | Get all tasks | [View](Postman%20Api%20Testing/07-get-tasks.png) |
| PATCH | `/api/projects/{projectId}/tasks/{taskId}/status` | Update status | [View](Postman%20Api%20Testing/08-update-status.png) |
| DELETE | `/api/projects/{projectId}/tasks/{taskId}` | Delete task | [View](Postman%20Api%20Testing/09-delete-task.png) |

### 🔑 Authentication Flow

1. **Signup/Login** → Receive JWT token
2. **Add token to headers** for all protected endpoints:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. **Make API requests** with the token

### 📝 Sample Request Bodies

<details>
<summary><b>Signup Request</b></summary>

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
</details>

<details>
<summary><b>Login Request</b></summary>

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
</details>

<details>
<summary><b>Create Project Request</b></summary>

```json
{
  "name": "Website Redesign",
  "description": "Complete redesign of company website"
}
```
</details>

<details>
<summary><b>Create Task Request</b></summary>

```json
{
  "title": "Design Homepage",
  "description": "Create mockup for new homepage",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-05-15"
}
```
</details>

<details>
<summary><b>Update Task Status Request</b></summary>

```json
{
  "status": "IN_PROGRESS"
}
```
</details>

---

## 🧪 How to Verify Backend is Working

⚠️ **Important Note:** If you open the backend URL directly in a browser:

👉 https://team-task-manager-proj-2.onrender.com

You may see **403 Forbidden** — **This is NORMAL!** ✅

**Why?**
- The backend is a REST API (no homepage/UI)
- Spring Security blocks unauthenticated root access
- APIs are meant to be accessed via endpoints, not root URL

### ✅ Correct Ways to Test:

**Method 1: Test API Endpoint**
```
GET https://team-task-manager-proj-2.onrender.com/api/dashboard
```
Expected: `401 Unauthorized` (means backend is working, just needs auth)

**Method 2: Use the Frontend**
```
https://teamflow-manager.vercel.app
```
Try signup/login — if it works, backend is working!

**Method 3: Use Postman**

See the **Postman Api Testing** folder for complete testing guide with screenshots.

---

## 🗄️ Database Schema

### **users**
- `id` (Primary Key)
- `name`, `email`, `password` (encrypted)
- `role` (USER/ADMIN)
- `created_at`

### **projects**
- `id` (Primary Key)
- `name`, `description`
- `owner_id` (Foreign Key → users)
- `created_at`

### **project_members**
- `id` (Primary Key)
- `project_id` (Foreign Key → projects)
- `user_id` (Foreign Key → users)
- `role` (OWNER/MEMBER)

### **tasks**
- `id` (Primary Key)
- `title`, `description`
- `status` (TODO/IN_PROGRESS/DONE)
- `priority` (LOW/MEDIUM/HIGH)
- `project_id` (Foreign Key → projects)
- `assigned_to` (Foreign Key → users)
- `due_date`, `created_at`

---

## ⚙️ Environment Variables

### 🔧 Backend (.env)
```env
DATABASE_URL=jdbc:postgresql://host:5432/database
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
CORS_ORIGINS=https://teamflow-manager.vercel.app
PORT=10000
```

### 🎨 Frontend (.env.local)
```env
REACT_APP_API_URL=https://team-task-manager-proj-2.onrender.com/api
```

---

## 🚀 Deployment

### Backend (Render)
- **Platform:** Render.com
- **Type:** Web Service (Docker)
- **Database:** PostgreSQL (Render)
- **Auto-deploy:** Enabled (on git push)

### Frontend (Vercel)
- **Platform:** Vercel
- **Framework:** Create React App
- **Auto-deploy:** Enabled (on git push)

---

## 🏁 Project Status

✅ **Fully Functional Full-Stack Application**
- Backend API deployed and accessible
- Frontend connected with live backend
- Database hosted and configured
- JWT authentication implemented
- Role-based access control working
- All CRUD operations functional
- Comprehensive API testing completed

---

## 📜 License

MIT License - feel free to use this project for learning and development.

---

## 👨‍💻 Developer

Built with ❤️ using Spring Boot & React

**Live Demo:** https://teamflow-manager.vercel.app
