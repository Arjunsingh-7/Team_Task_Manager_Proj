# Testing Signup Issue

## Steps to Debug:

1. **Restart the React app** (important for .env.local changes):
   ```bash
   cd Frontend
   npm start
   ```

2. **Open Browser Console** (F12) and check for:
   - Network tab: Look for the POST request to `/api/auth/signup`
   - Console tab: Look for the console.log messages I added
   - Any CORS errors (red text about "Access-Control-Allow-Origin")

3. **Try to sign up** with:
   - Name: Test User
   - Email: test2@example.com
   - Password: password123

4. **Check what you see**:
   - Network error?
   - CORS error?
   - 400 Bad Request?
   - 500 Server Error?
   - Response data structure issue?

## Common Issues:

### Issue 1: CORS Error
If you see: `Access to XMLHttpRequest at 'http://localhost:8082/api/auth/signup' from origin 'http://localhost:3000' has been blocked by CORS`

**Solution**: Backend CORS is already configured, but verify the backend is running on port 8082.

### Issue 2: Network Error / Connection Refused
If you see: `Network Error` or `ERR_CONNECTION_REFUSED`

**Solution**: Make sure the Spring Boot backend is running:
```bash
cd Backend
mvn spring-boot:run
```

### Issue 3: Wrong API URL
If the request goes to the wrong port (8080 instead of 8082):

**Solution**: 
1. Make sure `.env.local` exists in Frontend folder with:
   ```
   REACT_APP_API_URL=http://localhost:8082/api
   ```
2. Restart the React app (Ctrl+C and `npm start` again)

### Issue 4: Response Structure Mismatch
If signup succeeds but then fails to save token:

**Solution**: Already fixed in AuthContext.js - it now handles both response structures.

## What the Console Should Show:

When you click "Create account", you should see:
```
Submitting form: {name: "Test User", email: "test2@example.com", isLogin: false}
Signup response: {success: true, message: "User registered successfully", data: {...}}
```

If you see an error instead, copy the exact error message and share it.
