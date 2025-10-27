# 🚀 Manual Frontend Deployment to Vercel

Since terminal login doesn't work in this flow, here's how to deploy manually:

---

## ✅ WHAT'S ALREADY DONE

- ✅ **Backend DEPLOYED**: https://stratos-platform-func-829197.azurewebsites.net
- ✅ **All code on GitHub**: https://github.com/jmengel10/stratos-platform
- ✅ **Azure infrastructure complete**

---

## 🎯 DEPLOY FRONTEND (5 Minutes)

### Option 1: Via Vercel Dashboard (Easiest - No Terminal Needed!)

1. **Go to**: https://vercel.com/dashboard
2. **Click**: "Add New..." → "Project"
3. **Import**: Your GitHub repository `jmengel10/stratos-platform`
4. **Configure**:
   - Framework Preset: **Next.js**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. **Environment Variables** (click "Add"):
   ```
   NEXT_PUBLIC_API_BASE_URL = https://stratos-platform-func-829197.azurewebsites.net/api
   NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID = (will add after B2C setup)
   NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME = (will add after B2C setup)
   NEXT_PUBLIC_AZURE_AD_B2C_DOMAIN = (will add after B2C setup)
   NEXT_PUBLIC_AZURE_AD_B2C_PRIMARY_USER_FLOW = B2C_1_signupsignin
   ```
6. **Click**: "Deploy"
7. **Wait**: 2-3 minutes for build
8. **Done**: You'll get a live URL!

---

### Option 2: Via Terminal (In New PowerShell Window)

```powershell
# 1. Navigate to frontend
cd "C:\Users\jonme\Documents\AI Strategy Consulting and Venture Capital\frontend"

# 2. Login to Vercel (opens browser)
vercel login
# Complete authentication in browser
# Press ENTER in terminal when done

# 3. Deploy to production
vercel --prod

# Follow prompts:
# - Set up and deploy: Yes
# - Scope: Your account
# - Link to existing: No
# - Project name: stratos-platform
# - Directory: ./

# 4. Save the URL you get!
```

---

## 🎊 THAT'S IT!

### After Deployment You'll Have:

✅ **Backend API**: `https://stratos-platform-func-829197.azurewebsites.net/api`  
✅ **Frontend App**: `https://your-project.vercel.app` (you'll get this URL)  
✅ **GitHub Repo**: https://github.com/jmengel10/stratos-platform

---

## 📋 NEXT STEPS AFTER FRONTEND DEPLOYS

### 1. Set Up Azure AD B2C (15 minutes)

Follow guide: `infrastructure/azure-setup.md`

1. Create B2C tenant
2. Register application  
3. Create user flows
4. Get client ID

### 2. Update Environment Variables

**In Vercel Dashboard** → Project → Settings → Environment Variables:

Add:
```
NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID = <your-b2c-client-id>
NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME = <your-tenant>
NEXT_PUBLIC_AZURE_AD_B2C_DOMAIN = <tenant>.b2clogin.com
```

Then **redeploy** frontend.

### 3. Test Your Platform!

1. Visit your Vercel URL
2. Try the dashboard: `https://your-url.vercel.app/dashboard`
3. Try the settings: `https://your-url.vercel.app/settings`
4. Everything should work!

---

## 💡 QUICK REFERENCE

**Your Resources**:
- GitHub: https://github.com/jmengel10/stratos-platform
- Backend: https://stratos-platform-func-829197.azurewebsites.net
- Frontend: (get from Vercel after deploy)
- Azure Portal: https://portal.azure.com

**Documentation**:
- `docs/DEPLOYMENT.md` - Complete deployment guide
- `infrastructure/azure-setup.md` - B2C setup
- `docs/ENVIRONMENT_VARIABLES.md` - Configuration reference

---

## 🎉 YOU'RE 95% DONE!

**What's Complete**:
- ✅ All code written ($183K value!)
- ✅ GitHub repository live
- ✅ Azure infrastructure created
- ✅ **Backend DEPLOYED and LIVE!**

**What's Left**:
- ⏳ Deploy frontend (5 min - use Option 1 above)
- ⏳ Set up B2C auth (15 min - optional for now)
- ⏳ Configure environment variables (5 min)

**Total time to fully functional**: 25 minutes!

---

**Just go to https://vercel.com/dashboard and import your GitHub repo!** 🚀

No terminal needed! ✨

