# TaskFlow — React Frontend

A production-grade Team Task Manager frontend built with React.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local → set REACT_APP_API_URL to your Spring Boot server

# 3. Start dev server
npm start
```

---

## Project Structure

```
src/
├── components/
│   ├── auth/        AuthPage.js         (Login + Signup)
│   ├── layout/      Layout.js           (Sidebar navigation)
│   └── ui/          index.js            (Button, Input, Modal, Badge…)
├── context/
│   └── AuthContext.js                   (JWT auth state)
├── pages/
│   ├── Dashboard.js                     (Stats + charts)
│   ├── Projects.js                      (Project list)
│   ├── ProjectDetail.js                 (Kanban board + task CRUD)
│   └── MyTasks.js                       (Personal task view)
├── services/
│   └── api.js                           (All Axios API calls)
└── App.js                               (Router + providers)
```

---

## Connecting to Spring Boot

### 1. CORS Configuration

Add this to your Spring Boot app:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(
                        "http://localhost:3000",
                        "https://your-frontend.railway.app"
                    )
                    .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### 2. JWT Security Config

The frontend sends `Authorization: Bearer <token>` on every request.

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf().disable()
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
}
```

---

## Expected API Endpoints

The `src/services/api.js` file documents every endpoint. Summary:

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/signup | Register user → returns `{ token, user }` |
| POST | /api/auth/login | Login → returns `{ token, user }` |
| GET | /api/auth/me | Get current user from token |
| GET | /api/projects | List user's projects |
| POST | /api/projects | Create project |
| GET | /api/projects/:id | Get project details |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| GET | /api/projects/:id/members | Get project members |
| POST | /api/projects/:id/members | Add member `{ userId }` |
| DELETE | /api/projects/:id/members/:userId | Remove member |
| GET | /api/projects/:id/tasks | List tasks for project |
| POST | /api/projects/:id/tasks | Create task |
| GET | /api/tasks/my | Get current user's tasks |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| PATCH | /api/tasks/:id/status | Update status `{ status }` |
| GET | /api/dashboard | Get dashboard stats |
| GET | /api/users | List all users |

### Dashboard endpoint response shape:
```json
{
  "totalTasks": 42,
  "byStatus": {
    "TODO": 10,
    "IN_PROGRESS": 20,
    "DONE": 12
  },
  "byUser": [
    { "name": "Jane Smith", "count": 5 },
    { "name": "Bob Lee", "count": 8 }
  ],
  "overdue": []
}
```

### Task object shape:
```json
{
  "id": 1,
  "title": "Fix login bug",
  "description": "Users can't log in on Safari",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2024-06-01T00:00:00",
  "assigneeId": 3,
  "projectId": 1,
  "projectName": "My Project"
}
```

### User object shape:
```json
{
  "id": 1,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "ADMIN"
}
```

---

## Deployment on Railway

### Frontend (Static React)

```bash
# Build
npm run build

# Railway will auto-detect and serve the build/ folder
# Or use: npx serve -s build
```

Set environment variable in Railway:
```
REACT_APP_API_URL = https://your-backend.railway.app/api
```

### Railway railway.json (optional)

```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": { "startCommand": "npx serve -s build -l 3000" }
}
```

---

## Features

- **Dark, polished UI** — Syne + DM Sans fonts, purple accent system
- **JWT Auth** — Auto-attaches token, handles 401 globally
- **Kanban board** — Drag-style status movement per task
- **List view** — Toggle between board and list
- **Dashboard charts** — Recharts pie + bar charts
- **Role-based UI** — Admin sees delete/manage, members see their own actions
- **Overdue highlighting** — Red border on overdue tasks
- **Toast notifications** — react-hot-toast for all actions
- **Responsive sidebar** — Collapsible with icon-only mode
