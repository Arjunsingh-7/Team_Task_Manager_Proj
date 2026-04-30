# 🚀 TaskFlow - Team Task Management Application

A modern, full-stack team task management application built with React, Spring Boot, and PostgreSQL.

![TaskFlow](https://img.shields.io/badge/Status-Production%20Ready-success)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based authentication
- 👥 **Team Collaboration** - Create projects and invite team members
- 📋 **Task Management** - Create, assign, and track tasks
- 📊 **Visual Dashboard** - Real-time overview of projects and tasks
- 🎯 **Role-Based Access** - Admin and Member roles with different permissions
- 🔔 **Task Status Tracking** - TODO, IN_PROGRESS, DONE
- ⚡ **Priority Levels** - LOW, MEDIUM, HIGH
- 📅 **Due Dates** - Track deadlines and overdue tasks
- 🎨 **Modern UI** - Clean, professional design

## 🛠️ Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.x**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** (Hibernate)
- **PostgreSQL**
- **Maven**

### Frontend
- **React 18**
- **React Router** (Navigation)
- **Axios** (API calls)
- **React Hot Toast** (Notifications)
- **Modern CSS** (No framework)

### Database
- **PostgreSQL** (via Supabase)

### Deployment
- **Backend**: Railway
- **Frontend**: Vercel
- **Database**: Supabase

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- PostgreSQL (or use Supabase)
- Maven

### Backend Setup

```bash
# Navigate to backend folder
cd Backend

# Update application.properties with your database credentials
# Or set environment variables:
export DATABASE_URL=jdbc:postgresql://localhost:5432/taskmanager
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=your_password

# Run the application
mvn spring-boot:run
```

Backend will start on: http://localhost:8082

### Frontend Setup

```bash
# Navigate to frontend folder
cd Frontend

# Install dependencies
npm install

# Create .env.local file
echo "REACT_APP_API_URL=http://localhost:8082/api" > .env.local

# Start the application
npm start
```

Frontend will start on: http://localhost:3000

## 📦 Deployment

### Deploy to Railway (Backend)

1. Push code to GitHub
2. Sign up at https://railway.app
3. Deploy from GitHub repo
4. Set environment variables:
   ```
   DATABASE_URL=your_supabase_url
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_password
   JWT_SECRET=your_secret
   CORS_ORIGINS=your_frontend_url
   PORT=8080
   ```

### Deploy to Vercel (Frontend)

1. Sign up at https://vercel.com
2. Import GitHub repository
3. Set Root Directory: `Frontend`
4. Add environment variable:
   ```
   REACT_APP_API_URL=your_railway_backend_url/api
   ```

See [DEPLOY_TO_RAILWAY.md](DEPLOY_TO_RAILWAY.md) for detailed instructions.

## 📚 API Documentation

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Members
- `GET /api/projects/{id}/members` - List project members
- `POST /api/projects/{id}/members` - Add member (Admin only)
- `DELETE /api/projects/{id}/members/{userId}` - Remove member (Admin only)

### Tasks
- `GET /api/projects/{id}/tasks` - List project tasks
- `POST /api/projects/{id}/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `PATCH /api/tasks/{id}/status` - Update task status
- `DELETE /api/tasks/{id}` - Delete task (Admin only)

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Users
- `GET /api/users` - List all users
- `GET /api/users/me` - Get current user

## 🔐 Security

- JWT-based authentication
- Password encryption with BCrypt
- CORS configuration
- Role-based access control
- Environment variables for sensitive data

## 🎨 Screenshots

### Login Page
Modern split-screen design with gradient background

### Dashboard
Real-time overview of tasks and projects

### Project Board
Kanban-style task management

### Task Management
Create and assign tasks with priorities and due dates

## 📝 Environment Variables

### Backend (.env or Railway)
```
DATABASE_URL=jdbc:postgresql://host:5432/database
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
CORS_ORIGINS=http://localhost:3000,https://your-app.vercel.app
PORT=8080
```

### Frontend (.env.local or Vercel)
```
REACT_APP_API_URL=http://localhost:8082/api
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Spring Boot for the amazing backend framework
- React for the powerful frontend library
- Supabase for the managed PostgreSQL database
- Railway for easy backend deployment
- Vercel for seamless frontend hosting

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

---

**Made with ❤️ using Spring Boot and React**
