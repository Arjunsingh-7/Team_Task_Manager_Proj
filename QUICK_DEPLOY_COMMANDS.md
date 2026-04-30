# ⚡ QUICK DEPLOY COMMANDS

## 🚀 Copy & Paste These Commands

### STEP 1: Initialize Git & Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - TaskFlow application"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/taskflow-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### STEP 2: Railway Environment Variables

Copy these and paste in Railway → Variables tab:

```
DATABASE_URL=jdbc:postgresql://db.kwsbmyxagmndeiwgfdbo.supabase.co:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=Karan@#$%&0079
JWT_SECRET=c2VjcmV0S2V5Rm9yVGFza01hbmFnZXJBcHBsaWNhdGlvbjIwMjQ=
CORS_ORIGINS=*
PORT=8080
```

**After frontend is deployed, update CORS_ORIGINS to:**
```
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:3000
```

---

### STEP 3: Vercel Environment Variable

In Vercel → Environment Variables:

```
Name: REACT_APP_API_URL
Value: https://your-backend.up.railway.app/api
```

(Replace with your actual Railway backend URL)

---

## 🔄 Future Updates

```bash
# Make changes to your code
# Then run:

git add .
git commit -m "Description of your changes"
git push

# That's it! Auto-deploys to Railway & Vercel
```

---

## 🧪 Test Deployment

### Test Backend:
```
https://your-backend.up.railway.app/api/users
```
Should return: `401 Unauthorized` ✅

### Test Frontend:
```
https://your-app.vercel.app
```
Should show login page ✅

---

## 📋 Deployment Checklist

1. [ ] Create GitHub repository (Private recommended)
2. [ ] Push code to GitHub
3. [ ] Sign up for Railway with GitHub
4. [ ] Deploy from GitHub repo
5. [ ] Set Root Directory: `Backend`
6. [ ] Add environment variables in Railway
7. [ ] Generate domain in Railway
8. [ ] Sign up for Vercel with GitHub
9. [ ] Import GitHub repository
10. [ ] Set Root Directory: `Frontend`
11. [ ] Add `REACT_APP_API_URL` environment variable
12. [ ] Deploy on Vercel
13. [ ] Update `CORS_ORIGINS` in Railway with Vercel URL
14. [ ] Test the app!

---

## 🎯 Important URLs

**GitHub:** https://github.com
**Railway:** https://railway.app
**Vercel:** https://vercel.com
**Supabase:** https://supabase.com

---

## 💡 Pro Tips

1. **Use Private Repository** - Keep your code secure
2. **Never Commit Passwords** - Always use environment variables
3. **Test Locally First** - Before pushing to GitHub
4. **Check Logs** - If deployment fails, check Railway/Vercel logs
5. **Monitor Usage** - Keep an eye on free tier limits

---

## 🆘 Quick Fixes

### Backend Not Starting?
- Check Railway logs
- Verify environment variables
- Ensure Java 17 is used

### Frontend Can't Connect?
- Check `REACT_APP_API_URL` is correct
- Verify backend is running
- Update CORS in Railway

### Database Error?
- Check Supabase is active
- Verify connection string
- Check password is correct

---

**Ready to deploy? Follow DEPLOY_TO_RAILWAY.md for detailed steps!** 🚀
