# Database Setup Guide

## ✅ Current Configuration

Your `application.properties` is configured with:

```properties
# Server
server.port=8082

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/taskmanager
spring.datasource.username=postgres
spring.datasource.password=Arjun#0079
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update  ← This will auto-create tables!
spring.jpa.show-sql=true              ← This will show SQL queries in logs
```

## 📋 Steps to Verify Database

### 1. Open pgAdmin4

### 2. Connect to PostgreSQL Server
- Expand "Servers" → "PostgreSQL [version]"
- Enter your password: `Arjun#0079`

### 3. Check if `taskmanager` database exists
- Look under "Databases"
- If you see `taskmanager` → ✅ Good!
- If NOT, create it:
  - Right-click "Databases"
  - Select "Create" → "Database..."
  - Name: `taskmanager`
  - Owner: `postgres`
  - Click "Save"

### 4. Verify Database is Empty (First Time)
- Expand `taskmanager` → "Schemas" → "public" → "Tables"
- Should be empty initially
- Spring Boot will create tables automatically when it starts!

## 🚀 Start the Backend

Run this command in the Backend folder:

```bash
mvn spring-boot:run
```

## 📊 What Will Happen

When Spring Boot starts with `ddl-auto=update`, it will:

1. ✅ Connect to PostgreSQL
2. ✅ Create these tables automatically:
   - `users` (id, name, email, password, created_at, updated_at)
   - `projects` (id, name, description, admin_id, created_at, updated_at)
   - `project_members` (id, project_id, user_id, role, joined_at)
   - `tasks` (id, title, description, status, priority, due_date, project_id, assignee_id, created_at, updated_at)

3. ✅ Create all foreign key relationships
4. ✅ Create indexes and constraints

## 🔍 Verify Tables Were Created

After starting the backend:

1. Go back to pgAdmin4
2. Right-click on "Tables" under `taskmanager` database
3. Click "Refresh"
4. You should see 4 tables: `users`, `projects`, `project_members`, `tasks`

## ⚠️ Common Issues

### Issue 1: "password authentication failed"
**Solution**: Update the password in `application.properties` to match your PostgreSQL password

### Issue 2: "database 'taskmanager' does not exist"
**Solution**: Create the database in pgAdmin4 (see step 3 above)

### Issue 3: Port 8082 already in use
**Solution**: Change the port in `application.properties`:
```properties
server.port=8083
```
And update Frontend `.env.local`:
```
REACT_APP_API_URL=http://localhost:8083/api
```

## ✅ Success Indicators

When the backend starts successfully, you'll see:

```
Started TaskManagerApplication in X.XXX seconds
Tomcat started on port(s): 8082 (http)
```

And in pgAdmin4, you'll see all 4 tables created with proper structure!
