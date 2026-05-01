# 🚀 Team Task Manager

A full-stack web application for managing team projects and tasks efficiently.

---

## 🌐 Live Demo

- 🔗 Frontend (UI): https://teamflow-manager.vercel.app/signup  
- 🔗 Backend (API): https://team-task-manager-proj-2.onrender.com  

---

## ⚙️ Features

- 🔐 User authentication & authorization (JWT)
- 📁 Create and manage projects
- 👥 Add/remove project members
- ✅ Create, assign, and track tasks
- 📊 Dashboard with statistics
- 🛡️ Role-based access (Admin / Member)

---

## 🧰 Technology Stack

### 🖥️ Backend
- ☕ Java 17  
- 🌱 Spring Boot 3.2.0  
- 🔐 Spring Security (JWT)  
- 🗄️ Spring Data JPA  
- 🐘 PostgreSQL  
- 📦 Maven  
- 🚀 Deployed on Render  

---

### 🎨 Frontend
- ⚛️ React 18  
- 🔀 React Router  
- 📡 Axios  
- 🎨 CSS3  
- 🌍 Deployed on Vercel  

---

## 🧪 How to Check Backend is Working

⚠️ If you open backend URL directly:

👉 https://team-task-manager-proj-2.onrender.com  

You may see **403 Forbidden**

👉 That’s NORMAL! ✅

The backend has no homepage — it's just an API. The 403 error is expected because:

- You are accessing root URL (`/`)
- Spring Security blocks it
- No UI is served from backend

---

## ✅ Method 1: Test API in Browser

Open:

👉 https://team-task-manager-proj-2.onrender.com/api/auth/test  

✔ Expected:
- JSON response  
- OR error (but NOT 403 root error)

---

## ✅ Method 2: Test using Postman

### Without token:
GET https://team-task-manager-proj-2.onrender.com/api/dashboard/stats  

👉 Expected: 401 Unauthorized  
✔ This means backend is working correctly

---

### With token:
- Login first → get JWT  
- Add in header:

Authorization: Bearer <token>

---

## 🧱 API Endpoints

### 🔐 Auth
- POST /api/auth/signup – Register  
- POST /api/auth/login – Login  

### 📁 Projects
- GET /api/projects  
- POST /api/projects  
- GET /api/projects/{id}  
- PUT /api/projects/{id}  
- DELETE /api/projects/{id}  

### ✅ Tasks
- GET /api/projects/{id}/tasks  
- POST /api/projects/{id}/tasks  
- PUT /api/tasks/{id}  
- DELETE /api/tasks/{id}  

### 📊 Dashboard
- GET /api/dashboard  

---

## 🗄️ Database Schema

- users  
- projects  
- project_members  
- tasks  

---

## ⚙️ Environment Variables

### 🔧 Backend
DATABASE_URL=jdbc:postgresql://host:5432/database  
DATABASE_USERNAME=postgres  
DATABASE_PASSWORD=password  
JWT_SECRET=secret  
CORS_ORIGINS=https://teamflow-manager.vercel.app  

---

### 🎨 Frontend
REACT_APP_API_URL=https://team-task-manager-proj-2.onrender.com/api  

---

## 🏁 Final Note

- ✔ Fully functional full-stack app  
- ✔ Backend deployed and accessible  
- ✔ Frontend connected with live API  
- ✔ Role-based system implemented  

---

## 📜 License

MIT
