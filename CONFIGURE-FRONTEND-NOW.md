# ⚙️ Configure Frontend Environment Variables in Vercel

**Time Required**: 3 minutes  
**What You'll Do**: Add the backend API URL to your frontend

---

## 🎯 **STEP-BY-STEP INSTRUCTIONS**

### Step 1: Open Vercel Settings

1. **Go to**: https://vercel.com/stratos
2. **Click**: "Settings" tab (top navigation)
3. **Click**: "Environment Variables" (left sidebar)

---

### Step 2: Add Backend API URL

**Click**: "Add New" button

**Fill in**:
- **Name**: `NEXT_PUBLIC_API_BASE_URL`
- **Value**: `https://stratos-platform-func-829197.azurewebsites.net/api`
- **Environments**: 
  - ✅ Production
  - ✅ Preview
  - ✅ Development

**Click**: "Save"

---

### Step 3: Add Application Name (Optional)

**Click**: "Add New" button again

**Fill in**:
- **Name**: `NEXT_PUBLIC_APP_NAME`
- **Value**: `StratOS Platform`
- **Environments**: ✅ All three

**Click**: "Save"

---

### Step 4: Add Environment Indicator (Optional)

**Click**: "Add New" button

**Fill in**:
- **Name**: `NEXT_PUBLIC_ENVIRONMENT`
- **Value**: `production`
- **Environments**: ✅ Production only

**Click**: "Save"

---

### Step 5: Redeploy

1. **Click**: "Deployments" tab (top navigation)
2. **Find**: Your latest deployment
3. **Click**: The "..." menu (three dots)
4. **Click**: "Redeploy"
5. **Confirm**: Click "Redeploy" in the popup
6. **Wait**: 2-3 minutes for build to complete

---

## ✅ **THAT'S IT!**

**You just configured**:
- ✅ Backend API URL (connects frontend to your Azure backend)
- ✅ App name (optional branding)
- ✅ Environment indicator (optional)

---

## 🎯 **AFTER REDEPLOY**

**Your frontend will**:
- ✅ Know where your backend API is
- ✅ Be able to make API calls
- ✅ Have proper configuration

**You can add B2C variables later when you set up authentication!**

---

## 📋 **ENVIRONMENT VARIABLES ADDED**

### Essential (Just Added):
- ✅ `NEXT_PUBLIC_API_BASE_URL` - Backend API URL

### Optional (Can Add Now):
- ✅ `NEXT_PUBLIC_APP_NAME` - Display name
- ✅ `NEXT_PUBLIC_ENVIRONMENT` - Environment indicator

### For Later (After B2C Setup):
- ⏳ `NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID`
- ⏳ `NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME`
- ⏳ `NEXT_PUBLIC_AZURE_AD_B2C_DOMAIN`
- ⏳ `NEXT_PUBLIC_AZURE_AD_B2C_PRIMARY_USER_FLOW`

---

## 🚀 **WHAT TO DO NOW**

1. **Go to**: https://vercel.com/stratos/settings/environment-variables
2. **Add**: The environment variables above
3. **Redeploy**: From the Deployments tab
4. **Wait**: 2-3 minutes
5. **Visit**: https://stratos.vercel.app
6. **Done!** ✅

---

## ✅ **SUMMARY**

**Essential Variable to Add**:
```
NEXT_PUBLIC_API_BASE_URL = https://stratos-platform-func-829197.azurewebsites.net/api
```

**How**:
- Vercel Dashboard → Settings → Environment Variables → Add New

**Then**:
- Redeploy from Deployments tab

**Time**: 3 minutes total

---

**Go to https://vercel.com/stratos/settings/environment-variables and add it now!** 🚀

**When done, your platform will be fully connected frontend ↔ backend!**

