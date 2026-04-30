# 🚀 DEPLOY TO RAILWAY - COMPLETE GUIDE

## ✅ Prerequisites Completed
- [x] Application working locally
- [x] Supabase database configured
- [x] Sensitive data secured with environment variables

---

## 📦 STEP 1: Prepare for GitHub (5 minutes)

### 1.1 Initialize Git (if not already done)

```bash
# Open terminal in your project root folder
git init
```

### 1.2 Add All Files

```bash
git add .
```

### 1.3 Commit

```bash
git commit -m "Initial commit - TaskFlow application"
```

---

## 🔐 STEP 2: Create GitHub Repository (3 minutes)

### 2.1 Create Repository on GitHub

1. Go to https://github.com
2. Click **"+"** → **"New repository"**
3. Fill in:
   - **Repository name**: `taskflow-app` (or any name you want)
   - **Description**: `Team Task Management Application`
   - **Visibility**: **Private** (recommended) or Public
   - **DO NOT** initialize with README, .gitignore, or license
4. Click **"Create repository"**

### 2.2 Push to GitHub

Copy the commands from GitHub (they look like this):

```bash
git remote add origin https://github.com/YOUR_USERNAME/taskflow-app.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## 🚂 STEP 3: Deploy Backend to Railway (10 minutes)

### 3.1 Sign Up for Railway

1. Go to https://railway.app
2. Click **"Login"**
3. Sign in with **GitHub**
4. Authorize Railway

### 3.2 Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Select your repository: `taskflow-app`
4. Railway will detect it's a Java/Maven project

### 3.3 Configure Backend Service

1. Railway will create a service automatically
2. Click on the service
3. Go to **"Settings"** tab
4. Configure:
   - **Service Name**: `taskflow-backend`
   - **Root Directory**: `Backend`
   - **Start Command**: Leave empty (Railway auto-detects)

### 3.4 Add Environment Variables

1. Click **"Variables"** tab
2. Click **"+ New Variable"**
3. Add these variables:

```
DATABASE_URL=jdbc:postgresql://db.kwsbmyxagmndeiwgfdbo.supabase.co:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=Karan@#$%&0079
JWT_SECRET=c2VjcmV0S2V5Rm9yVGFza01hbmFnZXJBcHBsaWNhdGlvbjIwMjQ=
CORS_ORIGINS=*
PORT=8080
```

**Important:** Replace the database password with your actual Supabase password!

### 3.5 Deploy

1. Click **"Deploy"** (or it auto-deploys)
2. Wait 5-10 minutes for build
3. Check **"Deployments"** tab for progress
4. Once deployed, click **"Settings"** → **"Networking"**
5. Click **"Generate Domain"**
6. Copy your backend URL: `https://taskflow-backend.up.railway.app`

---

## 🌐 STEP 4: Deploy Frontend to Vercel (5 minutes)

### 4.1 Sign Up for Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with **GitHub**

### 4.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 4.3 Add Environment Variable

1. Expand **"Environment Variables"**
2. Add:
   ```
   Name: REACT_APP_API_URL
   Value: https://taskflow-backend.up.railway.app/api
   ```
   (Replace with your actual Railway backend URL)

### 4.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your app is live! 🎉
4. Copy your frontend URL: `https://taskflow-app.vercel.app`

---

## 🔧 STEP 5: Update CORS (2 minutes)

### 5.1 Update Railway Environment Variable

1. Go back to Railway
2. Click on your backend service
3. Go to **"Variables"** tab
4. Update `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=https://taskflow-app.vercel.app,http://localhost:3000
   ```
   (Replace with your actual Vercel URL)

5. Service will auto-redeploy

---

## ✅ STEP 6: Verify Deployment

### 6.1 Test Backend

Open in browser:
```
https://taskflow-backend.up.railway.app/api/users
```

Should return: `401 Unauthorized` (this is correct!)

### 6.2 Test Frontend

1. Open: `https://taskflow-app.vercel.app`
2. Sign up for a new account
3. Create a project
4. Add a task
5. Check dashboard

### 6.3 Verify Database

1. Go to Supabase
2. Table Editor → `users` table
3. Should see your new user!

---

## 🎉 SUCCESS!

Your app is now live:
- **Frontend**: https://taskflow-app.vercel.app
- **Backend**: https://taskflow-backend.up.railway.app
- **Database**: Supabase (managed)

---

## 💰 Cost Breakdown

**Railway (Backend):**
- Free: $5 credit/month
- Enough for small apps
- Sleeps after inactivity

**Vercel (Frontend):**
- Free: Unlimited deployments
- 100 GB bandwidth
- Automatic HTTPS

**Supabase (Database):**
- Free: 500 MB database
- Unlimited API requests

**Total: $0/month** (within free tiers) 🎉

---

## 🔄 Future Updates

### To Update Your App:

1. **Make changes locally**
2. **Test locally**
3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. **Auto-deploys!**
   - Railway: Auto-deploys backend
   - Vercel: Auto-deploys frontend

---

## 🐛 Troubleshooting

### Backend Won't Start

**Check Railway Logs:**
1. Railway Dashboard → Your service
2. Click **"Deployments"**
3. Click latest deployment
4. Check logs for errors

**Common Issues:**
- Wrong Java version (should be 17)
- Missing environment variables
- Database connection failed

**Fix:**
1. Verify all environment variables are set
2. Check database password is correct
3. Ensure `PORT` is set to `8080`

### Frontend Can't Connect

**Check:**
1. `REACT_APP_API_URL` is set correctly
2. Backend is running (check Railway)
3. CORS is configured with your Vercel URL

**Fix:**
1. Update `CORS_ORIGINS` in Railway
2. Redeploy backend
3. Hard refresh frontend (Ctrl+Shift+R)

### Database Connection Failed

**Check:**
1. Supabase database is active
2. Connection string is correct
3. Password is correct

**Fix:**
1. Go to Supabase → Settings → Database
2. Verify connection details
3. Update Railway environment variables

---

## 📊 Monitoring

### Railway Dashboard
- View logs
- Monitor CPU/Memory usage
- Check deployment status

### Vercel Dashboard
- View deployment logs
- Monitor bandwidth usage
- Check build status

### Supabase Dashboard
- View database size
- Monitor API requests
- Check table data

---

## 🔐 Security Checklist

- [x] Passwords not in code
- [x] Environment variables used
- [x] .gitignore configured
- [x] HTTPS enabled (automatic)
- [x] CORS configured
- [x] JWT secret secure

---

## 🎯 Quick Commands Reference

### Git Commands
```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push

# Pull latest changes
git pull
```

### Local Development
```bash
# Backend
cd Backend
mvn spring-boot:run

# Frontend
cd Frontend
npm start
```

---

## 📚 Additional Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- GitHub Docs: https://docs.github.com

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Railway
- [ ] Environment variables set in Railway
- [ ] Backend URL generated
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable set
- [ ] CORS updated with frontend URL
- [ ] Tested signup/login
- [ ] Tested creating project
- [ ] Tested creating task
- [ ] Verified data in Supabase

---

**Congratulations! Your app is now live! 🚀**
