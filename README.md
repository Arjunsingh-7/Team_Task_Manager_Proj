# Team Task Manager

A full-stack web application for managing team projects and tasks.

## Features

- User authentication and authorization
- Create and manage projects
- Assign tasks to team members
- Track task status and priorities
- Dashboard with project statistics
- Role-based access control (Admin/Member)

## Technology Stack

**Backend:**
- Java 17
- Spring Boot 3.2.0
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL
- Maven

**Frontend:**
- React 18
- React Router
- Axios
- CSS3

## Setup Instructions

### Backend

1. Navigate to Backend folder
2. Configure database in `application.properties`
3. Run: `mvn spring-boot:run`
4. Server starts on port 8082

### Frontend

1. Navigate to Frontend folder
2. Install dependencies: `npm install`
3. Create `.env.local` with: `REACT_APP_API_URL=http://localhost:8082/api`
4. Run: `npm start`
5. App opens on port 3000

## API Endpoints

### Auth
- POST `/api/auth/signup` - Register
- POST `/api/auth/login` - Login

### Projects
- GET `/api/projects` - List projects
- POST `/api/projects` - Create project
- GET `/api/projects/{id}` - Get project
- PUT `/api/projects/{id}` - Update project
- DELETE `/api/projects/{id}` - Delete project

### Tasks
- GET `/api/projects/{id}/tasks` - List tasks
- POST `/api/projects/{id}/tasks` - Create task
- PUT `/api/tasks/{id}` - Update task
- DELETE `/api/tasks/{id}` - Delete task

### Dashboard
- GET `/api/dashboard` - Get statistics

## Database Schema

- **users** - User accounts
- **projects** - Project information
- **project_members** - Project membership
- **tasks** - Task details

## Configuration

Backend environment variables:
```
DATABASE_URL=jdbc:postgresql://host:5432/database
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
JWT_SECRET=secret
CORS_ORIGINS=http://localhost:3000
```

Frontend environment variables:
```
REACT_APP_API_URL=http://localhost:8082/api
```

## License

MIT
