# Team Task Manager — Spring Boot Backend

## Tech Stack
- **Backend**: Spring Boot 3.2, Java 17
- **Database**: PostgreSQL
- **Auth**: JWT (jjwt 0.11.5)
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security

---

## Project Structure

```
src/main/java/com/taskmanager/
├── config/           # SecurityConfig, CurrentUserProvider
├── controller/       # REST controllers
├── dto/              # Request/Response DTOs
├── entity/           # JPA entities
├── exception/        # Custom exceptions + GlobalExceptionHandler
├── repository/       # Spring Data repositories
├── security/         # JWT utils, UserDetails
└── service/          # Business logic
```

---

## Database Schema (Auto-Created by Hibernate)

Tables created automatically on startup:
- `users` — id, name, email, password, created_at, updated_at
- `projects` — id, name, description, created_by(FK→users), created_at, updated_at
- `project_members` — id, project_id(FK), user_id(FK), role(ADMIN/MEMBER), joined_at
- `tasks` — id, title, description, status, priority, due_date, project_id(FK), assignee_id(FK), created_by(FK), created_at, updated_at

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://localhost:5432/taskmanager` |
| `DB_USERNAME` | DB username | `postgres` |
| `DB_PASSWORD` | DB password | `postgres` |
| `JWT_SECRET` | Base64 secret key | (dev default) |
| `JWT_EXPIRATION` | Token lifetime in ms | `86400000` (24h) |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:3000` |
| `PORT` | Server port | `8080` |

---

## REST API Reference

### Auth
| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | `/api/auth/signup` | ❌ | `{name, email, password}` |
| POST | `/api/auth/login` | ❌ | `{email, password}` |

### Users
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/users/me` | ✅ |
| GET | `/api/users/me/tasks` | ✅ |
| GET | `/api/users` | ✅ |
| GET | `/api/users/{id}` | ✅ |

### Projects
| Method | Endpoint | Auth | Role |
|---|---|---|---|
| POST | `/api/projects` | ✅ | Any |
| GET | `/api/projects` | ✅ | Any |
| GET | `/api/projects/{id}` | ✅ | Member+ |
| PUT | `/api/projects/{id}` | ✅ | Admin |
| DELETE | `/api/projects/{id}` | ✅ | Admin |
| GET | `/api/projects/{id}/members` | ✅ | Member+ |
| POST | `/api/projects/{id}/members` | ✅ | Admin |
| DELETE | `/api/projects/{id}/members/{userId}` | ✅ | Admin |

### Tasks
| Method | Endpoint | Auth | Role |
|---|---|---|---|
| POST | `/api/projects/{id}/tasks` | ✅ | Admin |
| GET | `/api/projects/{id}/tasks` | ✅ | Member+ |
| GET | `/api/projects/{id}/tasks/{taskId}` | ✅ | Member+ |
| PUT | `/api/projects/{id}/tasks/{taskId}` | ✅ | Admin |
| PATCH | `/api/projects/{id}/tasks/{taskId}/status` | ✅ | Member (own tasks) |
| DELETE | `/api/projects/{id}/tasks/{taskId}` | ✅ | Admin |

### Dashboard
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/dashboard` | ✅ |
| GET | `/api/dashboard/project/{id}` | ✅ |

---

## Response Format

All endpoints return:
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

---

## Local Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL 14+

### Step 1 — Create PostgreSQL Database
```sql
CREATE DATABASE taskmanager;
CREATE USER taskuser WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE taskmanager TO taskuser;
```

### Step 2 — Configure Environment
Edit `src/main/resources/application.properties` or set env vars:
```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/taskmanager
export DB_USERNAME=taskuser
export DB_PASSWORD=yourpassword
export JWT_SECRET=<base64-encoded-256-bit-key>
```

### Step 3 — Build & Run
```bash
mvn clean install -DskipTests
mvn spring-boot:run
```

Server starts at: `http://localhost:8080`

---

## Deployment on Railway

1. Push code to GitHub
2. On Railway: New Project → Deploy from GitHub
3. Add PostgreSQL plugin (Railway auto-sets `DATABASE_URL`)
4. Set environment variables:
   - `JWT_SECRET` → generate with: `openssl rand -base64 32`
   - `CORS_ORIGINS` → your frontend Railway URL
5. Railway auto-detects Maven and builds the JAR

---

## Generate a Safe JWT Secret
```bash
openssl rand -base64 32
```
