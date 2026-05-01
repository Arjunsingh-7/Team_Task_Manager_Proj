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

Complete API testing with screenshots demonstrating all endpoints.

### 🧪 API Testing Guide

**Base URL:** `https://team-task-manager-proj-2.onrender.com`

---

### 1️⃣ **User Signup**

**Endpoint:** `POST /api/auth/signup`

![Signup](Postman%20Api%20Testing/SignUp.png)

---

### 2️⃣ **User Login**

**Endpoint:** `POST /api/auth/login`

![Login](Postman%20Api%20Testing/Login.png)

---

### 3️⃣ **Get Dashboard Stats**

**Endpoint:** `GET /api/dashboard`  
**Auth Required:** ✅ Yes

![Dashboard](Postman%20Api%20Testing/Get%20DashBoard.png)

---

### 4️⃣ **Create Project**

**Endpoint:** `POST /api/projects`  
**Auth Required:** ✅ Yes

![Create Project](Postman%20Api%20Testing/Create%20Project.png)

---

### 5️⃣ **Get All Projects**

**Endpoint:** `GET /api/projects`  
**Auth Required:** ✅ Yes

![Get Projects](Postman%20Api%20Testing/Get%20All%20projects.png)

---

### 6️⃣ **Create Task**

**Endpoint:** `POST /api/projects/{projectId}/tasks`  
**Auth Required:** ✅ Yes

![Create Task](Postman%20Api%20Testing/Create%20Task.png)

---

### 7️⃣ **Get All Tasks**

**Endpoint:** `GET /api/projects/{projectId}/tasks`  
**Auth Required:** ✅ Yes

![Get Tasks](Postman%20Api%20Testing/Get%20All%20Tasks.png)

---

### 8️⃣ **Update Task Status**

**Endpoint:** `PATCH /api/projects/{projectId}/tasks/{taskId}/status`  
**Auth Required:** ✅ Yes

![Update Task](Postman%20Api%20Testing/Updating%20Tasks.png)

---

### 9️⃣ **Delete Task**

**Endpoint:** `DELETE /api/projects/{projectId}/tasks/{taskId}`  
**Auth Required:** ✅ Yes

![Delete Task](Postman%20Api%20Testing/Deleting%20Tasks.png)

---

### 🔟 **Delete Project**

**Endpoint:** `DELETE /api/projects/{id}`  
**Auth Required:** ✅ Yes

![Delete Project](Postman%20Api%20Testing/Delete%20All%20Projects.png)

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
